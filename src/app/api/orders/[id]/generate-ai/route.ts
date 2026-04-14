import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDB } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { calculateSaju } from "@/lib/saju/saju-engine";
import { generateAdvancedSajuContextFromResult } from "@/lib/saju/advanced-analysis";
import { callAnthropic } from "@/lib/llm/anthropic";
import { buildPaidAnalysisPrompt, parseAiTextResponse } from "@/lib/llm/promptBuilder";
import { AI_TEXT_KEYS } from "@/lib/llm/types";

const TIME_TO_HOUR: Record<string, number> = {
  joja: 0, chuk: 2, in: 4, myo: 6, jin: 8, sa: 10,
  oh: 12, mi: 14, shin: 16, yu: 18, sul: 20, hae: 22, yaja: 23,
};

async function getApiKey(): Promise<string | null> {
  // Local dev: .env.local → process.env
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY;
  // CF Workers: wrangler secret → env binding
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env.ANTHROPIC_API_KEY || null;
  } catch {
    return null;
  }
}

// POST /api/orders/[id]/generate-ai — generate or return cached AI text
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: orderId } = await params;
  const db = await getDB();

  // 1. 주문 조회 + 소유권 + 결제 확인
  const order = await db
    .prepare(
      "SELECT id, user_id, name, birthdate, birthtime, gender, calendar_type, question, love_status, love_duration, paid FROM orders WHERE id = ?",
    )
    .bind(orderId)
    .first<{
      id: string;
      user_id: string;
      name: string;
      birthdate: string;
      birthtime: string;
      gender: string;
      calendar_type: string | null;
      question: string | null;
      love_status: string | null;
      love_duration: string | null;
      paid: number;
    }>();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.user_id !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!order.paid) {
    return NextResponse.json({ error: "Payment required" }, { status: 402 });
  }

  // 2. 캐시 확인
  const cached = await db
    .prepare("SELECT ai_json FROM ai_texts WHERE order_id = ?")
    .bind(orderId)
    .first<{ ai_json: string }>();

  if (cached) {
    // 생성 중(pending sentinel)이면 202 반환
    if (cached.ai_json === '{"__pending":true}') {
      return NextResponse.json(
        { error: "AI generation in progress", pending: true },
        { status: 202 },
      );
    }
    return NextResponse.json(JSON.parse(cached.ai_json));
  }

  // 3. API 키 확인
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error("[generate-ai] ANTHROPIC_API_KEY not configured");
    return NextResponse.json(
      { error: "AI service not configured" },
      { status: 500 },
    );
  }

  // 4. 동시 요청 방어 — sentinel row 삽입 (INSERT ... DO NOTHING)
  const sentinelId = `ai_${orderId}`;
  try {
    const { meta } = await db
      .prepare(
        `INSERT INTO ai_texts (id, order_id, ai_json, model)
         VALUES (?, ?, '{"__pending":true}', 'pending')
         ON CONFLICT(order_id) DO NOTHING`,
      )
      .bind(sentinelId, orderId)
      .run();

    // rows_written === 0이면 다른 요청이 이미 sentinel을 넣은 것 → 생성 중
    if (meta.rows_written === 0) {
      return NextResponse.json(
        { error: "AI generation in progress", pending: true },
        { status: 202 },
      );
    }
  } catch (e) {
    console.error("[generate-ai] Sentinel insert failed:", e);
    return NextResponse.json(
      { error: "Temporary error, please retry" },
      { status: 503 },
    );
  }

  // 5. 사주 재계산
  const parts = order.birthdate.split(".").map(Number);
  const [year, month, day] = parts;
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
    await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
    return NextResponse.json({ error: "Invalid birthdate format" }, { status: 400 });
  }
  const hour = TIME_TO_HOUR[order.birthtime] ?? 12;
  const unknownTime = order.birthtime === "unknown" || !order.birthtime;
  const gender = order.gender === "여성" ? "female" as const : "male" as const;

  const sajuResult = calculateSaju({
    year,
    month,
    day,
    hour,
    minute: 0,
    gender,
    isLunar: order.calendar_type === "lunar",
    unknownTime,
  });

  // 6. 고급 분석 맥락 생성
  const advancedContext = await generateAdvancedSajuContextFromResult(
    sajuResult,
    year,
    month,
    day,
    unknownTime ? null : hour,
    gender,
  );

  // 7. 프롬프트 빌드
  const { system, user } = buildPaidAnalysisPrompt({
    name: order.name,
    gender,
    sajuResult,
    advancedContext,
    question: order.question,
    loveStatus: order.love_status,
    loveDuration: order.love_duration,
  });

  // 8. LLM 호출 (1회 재시도)
  let llmResponse;
  const model = process.env.ANTHROPIC_MODEL || undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      llmResponse = await callAnthropic(apiKey, system, user, { model });
      break;
    } catch (e) {
      if (attempt === 0) {
        console.warn("[generate-ai] LLM call failed, retrying...", e);
        await new Promise((r) => setTimeout(r, 2000));
      } else {
        console.error("[generate-ai] LLM call failed after retry", e);
        // sentinel 삭제하여 재시도 가능하게
        await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
        return NextResponse.json(
          { error: "AI generation failed" },
          { status: 503 },
        );
      }
    }
  }

  if (!llmResponse) {
    await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 503 },
    );
  }

  // max_tokens 초과 경고
  if (llmResponse.stopReason === "max_tokens") {
    console.warn(
      `[generate-ai] Response truncated (max_tokens). Tokens: ${llmResponse.outputTokens}`,
    );
  }

  // 9. JSON 파싱
  let aiTexts;
  try {
    aiTexts = parseAiTextResponse(llmResponse.content);
  } catch (e) {
    console.error("[generate-ai] Failed to parse AI response:", e);
    await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
    return NextResponse.json(
      { error: "AI response parsing failed" },
      { status: 502 },
    );
  }

  // 최소 필드 수 체크
  const validKeys = AI_TEXT_KEYS.filter((k) => aiTexts[k] && aiTexts[k]!.length > 50);
  if (validKeys.length < 8) {
    console.error(
      `[generate-ai] Only ${validKeys.length}/14 valid fields. Keys: ${validKeys.join(", ")}`,
    );
    await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
    return NextResponse.json(
      { error: "AI generated insufficient content" },
      { status: 502 },
    );
  }

  // 10. D1에 저장 (sentinel을 실제 데이터로 교체)
  const aiJsonStr = JSON.stringify(aiTexts);
  try {
    await db
      .prepare(
        `UPDATE ai_texts SET ai_json = ?, model = ?, input_tokens = ?, output_tokens = ?
         WHERE order_id = ? AND ai_json = '{"__pending":true}'`,
      )
      .bind(
        aiJsonStr,
        llmResponse.model,
        llmResponse.inputTokens,
        llmResponse.outputTokens,
        orderId,
      )
      .run();
  } catch (e) {
    // 저장 실패 — sentinel 삭제하여 다음 요청에서 재생성 가능하게
    console.error("[generate-ai] Failed to save to D1:", e);
    await db.prepare("DELETE FROM ai_texts WHERE order_id = ? AND ai_json = '{\"__pending\":true}'").bind(orderId).run().catch(() => {});
  }

  return NextResponse.json(aiTexts);
}
