import { NextResponse } from "next/server";
import { calculateSaju, createChart, calculateNatal } from "@/lib/saju/saju-engine";
import { generateAdvancedSajuContext } from "@/lib/saju/advanced-analysis";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { year, month, day, hour, minute, gender, mode } = body as {
      year: number; month: number; day: number;
      hour?: number; minute?: number; gender?: string; mode?: string;
    };

    if (!year || !month || !day) {
      return NextResponse.json({ error: "year, month, day는 필수입니다" }, { status: 400 });
    }

    const h = hour ?? 12;
    const m = minute ?? 0;
    const g = (gender ?? "male") as "male" | "female";
    const isMale = g === "male";

    // 사주팔자
    const saju = calculateSaju({ year, month, day, hour: h, minute: m, gender: g });

    // Map → Object 변환 (JSON 직렬화)
    const relPairs: Record<string, { stem: unknown[]; branch: unknown[] }> = {};
    saju.relations.pairs.forEach((val, key) => {
      relPairs[key] = val;
    });

    const result: Record<string, unknown> = {
      saju: {
        ...saju,
        relations: {
          ...saju.relations,
          pairs: relPairs,
        },
      },
    };

    // 자미두수
    if (mode === "all" || mode === "ziwei") {
      try {
        const ziwei = await createChart(year, month, day, h, m, isMale);
        result.ziwei = ziwei;
      } catch (e) {
        result.ziweiError = e instanceof Error ? e.message : "자미두수 계산 실패";
      }
    }

    // 서양 점성술
    if (mode === "all" || mode === "natal") {
      try {
        const natal = await calculateNatal({ year, month, day, hour: h, minute: m, gender: g });
        result.natal = natal;
      } catch (e) {
        result.natalError = e instanceof Error ? e.message : "서양 점성술 계산 실패";
      }
    }

    // 통합 분석 컨텍스트
    if (mode === "all" || mode === "advanced") {
      try {
        const context = await generateAdvancedSajuContext(year, month, day, h, g);
        result.advancedContext = context;
      } catch (e) {
        result.advancedError = e instanceof Error ? e.message : "통합 분석 실패";
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[saju API]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "사주 계산 중 오류 발생" },
      { status: 500 },
    );
  }
}
