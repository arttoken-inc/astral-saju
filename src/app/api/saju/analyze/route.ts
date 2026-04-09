import { NextResponse } from "next/server";
import { calculateSaju, type SajuResult } from "@/lib/saju/saju-engine";
import {
  toSajuDisplayData,
  toOhaengDisplayData,
  toDaeunDisplayData,
  toImageVars,
  toDestinyPartnerData,
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

    // 운명의 짝 데이터
    const destinyPartner = toDestinyPartnerData(sajuResult, gender);

    // 위기 리스트 (사주 기반 간단 생성)
    const crisisList = generateCrisisList(sajuResult, ohaengDisplay.strength.level);

    return NextResponse.json({
      sajuDisplay,
      ohaengDisplay,
      daeunDisplay,
      destinyPartner,
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

/** 사주 결과를 바탕으로 위기 리스트 생성 (십신 분포 기반) */
function generateCrisisList(result: SajuResult, strengthLevel: string): string[] {
  const items: string[] = [];

  // 십신 분포 카운트 (천간 + 지지)
  const sipsinCount: Record<string, number> = {};
  for (const p of result.pillars) {
    if (p.stemSipsin && p.stemSipsin !== "本元") {
      sipsinCount[p.stemSipsin] = (sipsinCount[p.stemSipsin] || 0) + 1;
    }
    if (p.branchSipsin) {
      sipsinCount[p.branchSipsin] = (sipsinCount[p.branchSipsin] || 0) + 1;
    }
  }

  const isWeak = ["신약", "태약", "극약"].includes(strengthLevel);

  // 재성 (정재 + 편재) 개수
  const jaeCount = (sipsinCount["正財"] || 0) + (sipsinCount["偏財"] || 0);
  // 관성 (정관 + 편관) 개수
  const gwanCount = (sipsinCount["正官"] || 0) + (sipsinCount["偏官"] || 0);
  // 식상 (식신 + 상관) 개수
  const sikCount = (sipsinCount["食神"] || 0) + (sipsinCount["傷官"] || 0);
  // 인성 (정인 + 편인) 개수
  const inCount = (sipsinCount["正印"] || 0) + (sipsinCount["偏印"] || 0);
  // 비겁 (비견 + 겁재) 개수
  const biCount = (sipsinCount["比肩"] || 0) + (sipsinCount["劫財"] || 0);

  // 재성 과다 → 이성 관계 문제
  if (jaeCount >= 3) {
    items.push("복잡한 이성 관계 문제");
  } else if (jaeCount >= 2) {
    items.push("재물 관련 예기치 못한 손실");
  }

  // 식상 + 신약 → 노력 대비 성과 부족
  if (sikCount >= 1 && isWeak) {
    items.push("노력해도 성과가 없음");
  } else if (sikCount >= 2) {
    items.push("말이나 행동으로 인한 구설수");
  }

  // 관성 + 신약 → 공개적 망신/압박
  if (gwanCount >= 1 && isWeak) {
    items.push("공개적인 실수로 인한 망신");
  } else if (gwanCount >= 2) {
    items.push("직장이나 조직에서의 갈등");
  }

  // 인성 과다 → 우유부단/의존
  if (inCount >= 3) {
    items.push("결정 장애로 인한 기회 상실");
  }

  // 비겁 과다 → 경쟁/배신
  if (biCount >= 3) {
    items.push("가까운 사람과의 금전 분쟁");
  }

  // 충(冲) 관계 기반
  result.relations.pairs.forEach((pair) => {
    for (const rel of pair.branch) {
      if (rel.type.includes("충") && items.length < 3) {
        items.push("운세의 큰 변동이 예상되는 시기");
      }
    }
  });

  // 특수살 기반
  if (result.specialSals.baekho && items.length < 3) {
    items.push("건강 관련 주의가 필요한 시기");
  }
  if (result.specialSals.yangin.length > 0 && items.length < 3) {
    items.push("급격한 변화에 대한 대비 필요");
  }

  // 최소 3개 보장
  const fallbacks = [
    "예상치 못한 환경 변화",
    "중요한 인간관계의 변화",
    "건강 관리에 신경 써야 할 시기",
  ];
  for (const f of fallbacks) {
    if (items.length >= 3) break;
    if (!items.includes(f)) items.push(f);
  }

  // 최대 3개 + 블러 처리용 항목
  const top3 = items.slice(0, 3);
  top3.push("더 많은 위기를 확인하고 싶으면 복채가 필요해요.");
  top3.push("확인하기 위해 복채가 필요한 위기에요.");

  return top3;
}
