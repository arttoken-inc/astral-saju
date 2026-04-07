import { NextResponse } from "next/server";
import { calculateSaju, type SajuResult } from "@/lib/saju/saju-engine";
import {
  toSajuDisplayData,
  toOhaengDisplayData,
  toDaeunDisplayData,
  toImageVars,
} from "@/lib/saju/resultAdapter";
import { resolveAllDynamicImages } from "@/lib/dynamicImage";

// 시간 값 → 시(hour) 변환
const TIME_TO_HOUR: Record<string, number> = {
  joja: 0, chuk: 2, in: 4, myo: 6, jin: 8, sa: 10,
  oh: 12, mi: 14, shin: 16, yu: 18, sul: 20, hae: 22, yaja: 23,
};

interface AnalyzeRequest {
  serviceId: string;
  name: string;
  birthdate: string; // "YYYY.MM.DD"
  birthtime: string; // time option value
  gender: string;    // "남성" | "여성"
  calendarType?: "solar" | "lunar";
  // dynamicImages rules from service config (passed from client)
  dynamicImages?: Record<string, {
    pattern: string;
    variables: Record<string, { source: string; map?: Record<string, string> }>;
    fallback?: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const { serviceId, name, birthdate, birthtime, gender, calendarType, dynamicImages } = body;

    if (!name || !birthdate || !gender) {
      return NextResponse.json(
        { error: "name, birthdate, gender는 필수입니다" },
        { status: 400 },
      );
    }

    // 생년월일 파싱
    const parts = birthdate.replace(/[.\-\/]/g, ".").split(".");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return NextResponse.json(
        { error: "생년월일 형식이 올바르지 않습니다" },
        { status: 400 },
      );
    }

    // 시간 변환
    const hour = TIME_TO_HOUR[birthtime] ?? 12;
    const unknownTime = birthtime === "unknown" || !birthtime;
    const g = gender === "여성" ? "female" : "male";

    // 사주 계산
    const sajuResult = calculateSaju({
      year,
      month,
      day,
      hour,
      minute: 0,
      gender: g,
      isLunar: calendarType === "lunar",
      unknownTime,
    });

    // 디스플레이 데이터 변환
    const sajuDisplay = toSajuDisplayData(sajuResult, name);
    const ohaengDisplay = toOhaengDisplayData(sajuResult);
    const daeunDisplay = toDaeunDisplayData(sajuResult);
    const imageVars = toImageVars(sajuResult, gender);

    // 동적 이미지 해석
    const resolvedImages = dynamicImages
      ? resolveAllDynamicImages(dynamicImages, imageVars)
      : {};

    // 위기 리스트 (사주 기반 간단 생성)
    const crisisList = generateCrisisList(sajuResult);

    return NextResponse.json({
      sajuDisplay,
      ohaengDisplay,
      daeunDisplay,
      imageVars,
      resolvedImages,
      crisisList,
    });
  } catch (e) {
    console.error("[saju/analyze API]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "사주 분석 중 오류 발생" },
      { status: 500 },
    );
  }
}

/** 사주 결과를 바탕으로 위기 리스트 생성 */
function generateCrisisList(result: SajuResult): string[] {
  const items: string[] = [];

  // 충(冲) 관계 기반 위기
  result.relations.pairs.forEach((pair) => {
    for (const rel of pair.branch) {
      if (rel.type.includes("충")) {
        items.push(`운세의 큰 변동이 예상되는 시기 (${rel.detail || "지지충"})`);
      }
    }
    for (const rel of pair.stem) {
      if (rel.type.includes("충")) {
        items.push(`예상치 못한 갈등 상황 (${rel.detail || "천간충"})`);
      }
    }
  });

  // 특수살 기반
  if (result.specialSals.baekho) {
    items.push("건강 관련 주의가 필요한 시기");
  }
  if (result.specialSals.goegang) {
    items.push("대인관계에서의 마찰 가능성");
  }
  if (result.specialSals.yangin.length > 0) {
    items.push("급격한 변화에 대한 대비 필요");
  }

  // 기본 항목 보충
  if (items.length < 3) {
    const defaults = [
      "예기치 못한 재정적 변동",
      "중요한 인간관계의 변화",
      "건강 관리에 신경 써야 할 시기",
    ];
    for (const d of defaults) {
      if (items.length >= 3) break;
      if (!items.includes(d)) items.push(d);
    }
  }

  // 블러 처리용 추가 항목
  items.push("더 많은 위기를 확인하고 싶으면 복채가 필요해요.");
  items.push("확인하기 위해 복채가 필요한 위기에요.");

  return items;
}
