/**
 * SajuResult (계산 엔진 출력) → 디스플레이 데이터 변환
 * ServiceResultPage의 SajuTable, DaeunTable, OhaengSection에서 사용
 */

import type { SajuResult, Element } from "./saju-engine";
import type {
  SajuDisplayData,
  OhaengDisplayData,
  OhaengRatio,
  DaeunDisplayData,
  DestinyPartnerDisplayData,
} from "@/lib/sajuDisplayTypes";

// ── 한자 → 한글 매핑 ──

const SIPSIN_HANJA: Record<string, string> = {
  비견: "比肩", 겁재: "劫財", 식신: "食神", 상관: "傷官",
  편재: "偏財", 정재: "正財", 편관: "偏官", 정관: "正官",
  편인: "偏印", 정인: "正印", 일간: "日干",
};

const SIPSIN_REVERSE: Record<string, string> = {};
for (const [hangul, hanja] of Object.entries(SIPSIN_HANJA)) {
  SIPSIN_REVERSE[hanja] = hangul;
  SIPSIN_REVERSE[hangul] = hangul;
}
// 엔진에서 일간을 "本元"으로 보내는 경우 처리
SIPSIN_REVERSE["本元"] = "일간";

function sipsinItem(name: string) {
  const hangul = SIPSIN_REVERSE[name] || name;
  const hanja = SIPSIN_HANJA[hangul] || name;
  return { hanja, hangul };
}

// ── 12운성 한자→한글 역매핑 ──
const UNSEONG_REVERSE: Record<string, string> = {
  "長生": "장생", "沐浴": "목욕", "冠帶": "관대", "建祿": "건록",
  "帝旺": "제왕", "衰": "쇠", "病": "병", "死": "사",
  "墓": "묘", "絶": "절", "胎": "태", "養": "양",
};

// ── 12신살 한글→한자 매핑 ──
const SPIRIT_HANJA: Record<string, string> = {
  "겁살": "劫殺", "재살": "災殺", "천살": "天殺", "지살": "地殺",
  "연살": "年殺", "월살": "月殺", "망신살": "亡身殺", "장성": "將星殺",
  "반안": "攀鞍殺", "역마": "驛馬殺", "육해": "六害殺", "화개": "華蓋殺",
};

// ── 천을귀인(天乙貴人) 테이블 ──
// 일간 기준, 해당 지지가 있으면 귀인
const CHEONUL_GUIIN: Record<string, string[]> = {
  "甲": ["丑", "未"], "戊": ["丑", "未"],
  "乙": ["子", "申"], "己": ["子", "申"],
  "丙": ["亥", "酉"], "丁": ["亥", "酉"],
  "庚": ["寅", "午"], "辛": ["寅", "午"],
  "壬": ["巳", "卯"], "癸": ["巳", "卯"],
};

// ── 오행 분포 관련 ──

const ELEMENT_KR: Record<Element, string> = {
  wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
};

const ELEMENT_HANJA: Record<Element, string> = {
  wood: "木", fire: "火", earth: "土", metal: "金", water: "水",
};

const ELEMENT_COLOR: Record<Element, string> = {
  wood: "rgb(34, 144, 150)",
  fire: "rgb(204, 58, 58)",
  earth: "rgb(210, 174, 44)",
  metal: "rgb(117, 117, 117)",
  water: "rgb(57, 57, 57)",
};

const ELEMENT_ORDER: Element[] = ["wood", "fire", "earth", "metal", "water"];

/** 퍼센트 기준 오행 상태 판정 (청월당 기준) */
function getOhaengStatus(pct: number): string {
  if (pct === 0) return "결핍";
  if (pct < 10) return "부족";
  if (pct < 20) return "적정";
  if (pct < 35) return "발달";
  return "과다";
}

// ── 110점 오행 점수 알고리즘 (청월당 역분석) ──

/** 천간 → 오행 */
const STEM_TO_ELEMENT: Record<string, Element> = {
  "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth",
  "己": "earth", "庚": "metal", "辛": "metal", "壬": "water", "癸": "water",
};

/** 지지 → 본기 오행 */
const BRANCH_MAIN_ELEMENT: Record<string, Element> = {
  "子": "water", "丑": "earth", "寅": "wood", "卯": "wood",
  "辰": "earth", "巳": "fire", "午": "fire", "未": "earth",
  "申": "metal", "酉": "metal", "戌": "earth", "亥": "water",
};

/** 사고지 방합: [방합 오행, 사왕 지지] */
const SAGOJI_BANGHAP: Record<string, [Element, string]> = {
  "丑": ["water", "子"], "辰": ["wood", "卯"],
  "未": ["fire", "午"], "戌": ["metal", "酉"],
};

/** 음사고지 월지 → 계절 오행 */
const SEASONAL_SAGOJI_ELEMENT: Record<string, Element> = {
  "丑": "water", // 겨울→봄 전환기, 수 잔여
  "未": "fire",  // 여름→가을 전환기, 화 잔여
};

/** 절기 기준일 (양력): 월지 → [양력월, 양력일] */
const JEOLGI_DATES: Record<string, [number, number]> = {
  "寅": [2, 4], "卯": [3, 6], "辰": [4, 5], "巳": [5, 6],
  "午": [6, 6], "未": [7, 7], "申": [8, 7], "酉": [9, 8],
  "戌": [10, 8], "亥": [11, 7], "子": [12, 7], "丑": [1, 6],
};

/**
 * 양사고지(辰/戌) 월지 5-phase 배분 (30점)
 * 이전계절 → 토(정기) → 다음계절 순으로 전환
 */
const SAGOJI_PHASE_DIST: Record<string, Partial<Record<Element, number>>[]> = {
  "辰": [ // 이전=wood(春), 정기=earth, 다음=fire(夏)
    { wood: 20, earth: 10 },
    { wood: 15, earth: 15 },
    { wood: 10, fire: 10, earth: 10 },
    { fire: 15, earth: 15 },
    { fire: 20, earth: 10 },
  ],
  "戌": [ // 이전=metal(秋), 정기=earth, 다음=water(冬)
    { metal: 20, earth: 10 },
    { metal: 15, earth: 15 },
    { metal: 10, water: 10, earth: 10 },
    { water: 15, earth: 15 },
    { water: 20, earth: 10 },
  ],
};

/**
 * 양생지(寅/申) 월지 5-phase 배분 (30점)
 * 이전계절 → 정기 순으로 전환 (2원소)
 */
const YANGSAENG_PHASE_DIST: Record<string, Partial<Record<Element, number>>[]> = {
  "寅": [ // 이전=water(冬), 정기=wood(春)
    { water: 30 },
    { water: 20, wood: 10 },
    { water: 15, wood: 15 },
    { water: 10, wood: 20 },
    { wood: 30 },
  ],
  "申": [ // 이전=fire(夏), 정기=metal(秋)
    { fire: 30 },
    { fire: 20, metal: 10 },
    { fire: 15, metal: 15 },
    { fire: 10, metal: 20 },
    { metal: 30 },
  ],
};

/** 절기월 내 일수 계산 (1~30) */
function getDayInMonth(year: number, month: number, day: number, monthBranch: string): number {
  const jd = JEOLGI_DATES[monthBranch];
  if (!jd) return 15; // fallback: 중간값
  const [jm, jday] = jd;
  const jeolgiStart = new Date(year, jm - 1, jday);
  // 丑월(1/6): 12월 생은 전년도 처리
  if (monthBranch === "丑" && month >= 12) {
    jeolgiStart.setFullYear(year);
  }
  const birth = new Date(year, month - 1, day);
  const diff = Math.round((birth.getTime() - jeolgiStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(30, diff));
}

/** 일수 → 5-phase 인덱스 (0~4) */
function getPhase(dayInMonth: number): number {
  return Math.min(4, Math.floor((dayInMonth - 1) / 6));
}

/**
 * 110점 오행 점수 계산 (청월당 알고리즘 v3)
 *
 * 방합: 연지/시지에만 적용, 사왕이 월지일 때만 발동 (일지 무관)
 * 월지: 5-phase 월률분야 기반 배분 (양사고지/양생지)
 */
function computeOhaeng110(
  pillars: SajuResult["pillars"],
  input?: { year: number; month: number; day: number },
): Record<Element, number> {
  // pillars 순서: [시주(0), 일주(1), 월주(2), 연주(3)]
  const stems = pillars.map(p => p.pillar.stem);
  const branches = pillars.map(p => p.pillar.branch);
  const [tg, dg, mg, yg] = branches; // 시지, 일지, 월지, 연지

  const scores: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  // 1. 천간: 각 10점
  for (const stem of stems) {
    scores[STEM_TO_ELEMENT[stem]] += 10;
  }

  // 2. 연지: 10점 (방합: 사왕==월지일 때만)
  let ygElement = BRANCH_MAIN_ELEMENT[yg];
  if (yg in SAGOJI_BANGHAP) {
    const [bElement, sawang] = SAGOJI_BANGHAP[yg];
    if (sawang === mg) ygElement = bElement;
  }
  scores[ygElement] += 10;

  // 3. 월지: 30점 (유형별 규칙)
  if (mg in SAGOJI_PHASE_DIST) {
    // 양사고지 (辰/戌): 5-phase 배분
    const dim = input ? getDayInMonth(input.year, input.month, input.day, mg) : 15;
    const phase = getPhase(dim);
    const dist = SAGOJI_PHASE_DIST[mg][phase];
    for (const [el, pts] of Object.entries(dist)) {
      scores[el as Element] += pts;
    }
  } else if (mg in YANGSAENG_PHASE_DIST) {
    // 양생지 (寅/申): 5-phase 배분
    const dim = input ? getDayInMonth(input.year, input.month, input.day, mg) : 15;
    const phase = getPhase(dim);
    const dist = YANGSAENG_PHASE_DIST[mg][phase];
    for (const [el, pts] of Object.entries(dist)) {
      scores[el as Element] += pts;
    }
  } else if (mg in SEASONAL_SAGOJI_ELEMENT) {
    // 음사고지 (丑/未): 계절 오행
    scores[SEASONAL_SAGOJI_ELEMENT[mg]] += 30;
  } else {
    // 사왕지(子卯午酉) + 음생지(巳亥): 본기 오행
    scores[BRANCH_MAIN_ELEMENT[mg]] += 30;
  }

  // 4. 일지: 15점, 본기 오행 (방합 미적용)
  scores[BRANCH_MAIN_ELEMENT[dg]] += 15;

  // 5. 시지: 15점 (방합: 사왕==월지일 때만)
  let tgElement = BRANCH_MAIN_ELEMENT[tg];
  if (tg in SAGOJI_BANGHAP) {
    const [bElement, sawang] = SAGOJI_BANGHAP[tg];
    if (sawang === mg) tgElement = bElement;
  }
  scores[tgElement] += 15;

  return scores;
}

// ── 일간 한글 ──
const STEM_HANGUL = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const STEM_HANJA = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

function stemToHangul(hanja: string): string {
  const idx = STEM_HANJA.indexOf(hanja);
  return idx >= 0 ? STEM_HANGUL[idx] : hanja;
}

// ── 메인 변환 함수들 ──

export function toSajuDisplayData(
  result: SajuResult,
  name: string,
): SajuDisplayData {
  const pillars = result.pillars;
  // 순서: 시주, 일주, 월주, 연주
  const cheongan = pillars.map((p) => p.pillar.stem);
  const jiji = pillars.map((p) => p.pillar.branch);
  const sipseongTop = pillars.map((p) => sipsinItem(p.stemSipsin));
  const sipseongBottom = pillars.map((p) => sipsinItem(p.branchSipsin));
  const sibiUnseong = pillars.map((p) => {
    const hanja = p.unseong;
    const hangul = UNSEONG_REVERSE[hanja] || hanja;
    return { hanja, hangul };
  });
  const sinsal = pillars.map((p) => {
    const hangul = p.spirit;
    const hanja = SPIRIT_HANJA[hangul] || hangul;
    return { hanja, hangul };
  });
  // 천을귀인 계산 (일간 기준)
  const dayStm = pillars[1].pillar.stem; // 일간 한자
  const guiinBranches = CHEONUL_GUIIN[dayStm] || [];
  const guin = pillars.map((p) => {
    const branch = p.pillar.branch;
    return guiinBranches.includes(branch) ? `天乙貴人` : "(없음)";
  });

  // 일간 기준으로 생년월일 텍스트 구성
  const { year, month, day } = result.input;
  const birthDate = `${year}년 ${month}월 ${day}일`;
  const hourBranch = jiji[0]; // 시주 지지

  // 이름에서 성 제외
  const nameShort = name.length > 1 ? name.slice(1) : name;

  return {
    name,
    nameShort,
    birthDate,
    birthTime: hourBranch,
    cheongan,
    jiji,
    sipseongTop,
    sipseongBottom,
    sibiUnseong,
    sinsal,
    guin,
  };
}

export function toOhaengDisplayData(result: SajuResult): OhaengDisplayData {
  // 110점 알고리즘으로 오행 점수 계산
  const rawScores = computeOhaeng110(result.pillars, result.input);

  // distribution은 단순 카운트 (오행분포 개수 표시용)
  const distribution = ELEMENT_ORDER.map((e) => result.ohang[e] || 0);

  // ratio는 퍼센트 (score/110*100, 소수점 1자리)
  const ratio: OhaengRatio[] = ELEMENT_ORDER.map((e) => {
    const pct = Math.round((rawScores[e] / 110) * 1000) / 10;
    return {
      name: ELEMENT_KR[e],
      hanja: ELEMENT_HANJA[e],
      value: pct,
      status: getOhaengStatus(pct),
      color: ELEMENT_COLOR[e],
    };
  });

  // 일간 정보
  const dayPillar = result.pillars[1]; // 일주
  const ilganHanja = dayPillar.pillar.stem;
  const ilganHangul = stemToHangul(ilganHanja);
  const dayElement = dayPillar.pillar.stemElement;

  // 신강/신약 판별 (비겁+인성 점수 기반, 110점 시스템)
  const helpingElement = dayElement; // 비겁
  const generatingElement = getGeneratingElement(dayElement); // 인성
  const myScore = (rawScores[helpingElement] || 0) + (rawScores[generatingElement] || 0);

  let level: string;
  if (myScore >= 80) level = "극왕";
  else if (myScore >= 70) level = "태강";
  else if (myScore >= 65) level = "신강";
  else if (myScore >= 50) level = "중화";
  else if (myScore >= 45) level = "신약";
  else if (myScore >= 25) level = "태약";
  else level = "극약";

  // 용신/희신/기신 판별
  const isStrong = myScore >= 50; // 중화 이상 (중화/신강/태강/극왕)
  const yongshin = isStrong
    ? getControllingElement(dayElement)
    : getGeneratingElement(dayElement);
  const heeshin = isStrong
    ? getGeneratedElement(dayElement)
    : dayElement;
  const gishin = isStrong
    ? getGeneratingElement(dayElement)
    : getControllingElement(dayElement);

  return {
    distribution,
    ratio,
    yongshin: { name: ELEMENT_KR[yongshin], img: ELEMENT_KR[yongshin] },
    heeshin: { name: ELEMENT_KR[heeshin], img: ELEMENT_KR[heeshin] },
    gishin: { name: ELEMENT_KR[gishin], img: ELEMENT_KR[gishin] },
    strength: { ilgan: ilganHangul, level },
  };
}

// 오행 상생 관계
function getGeneratingElement(e: Element): Element {
  const map: Record<Element, Element> = {
    wood: "water", fire: "wood", earth: "fire", metal: "earth", water: "metal",
  };
  return map[e];
}

function getGeneratedElement(e: Element): Element {
  const map: Record<Element, Element> = {
    wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood",
  };
  return map[e];
}

function getControllingElement(e: Element): Element {
  const map: Record<Element, Element> = {
    wood: "metal", fire: "water", earth: "wood", metal: "fire", water: "earth",
  };
  return map[e];
}

export function toDaeunDisplayData(result: SajuResult): DaeunDisplayData {
  const daewoon = result.daewoon;
  if (daewoon.length === 0) {
    return { years: [], ages: [], startAge: 0, cycle: 10 };
  }

  // 최대 7개 표시
  const items = daewoon.slice(0, 7);
  const startAge = items[0].age;
  const years = items.map((d) => d.startDate.getFullYear());
  const ages = items.map((d) => d.age);
  const cycle = items.length > 1 ? items[1].age - items[0].age : 10;

  return { years, ages, startAge, cycle };
}

/** 동적 이미지 변수용 사주 요약 */
export interface SajuImageVars {
  gender: string;       // "남성" | "여성"
  ilgan: string;        // 일간 한글 (갑, 을, ...)
  strength: string;     // "신강" | "신약"
  dominantElement: string; // 가장 강한 오행 한글
}

export function toImageVars(
  result: SajuResult,
  inputGender: string,
): SajuImageVars {
  const ohaeng = toOhaengDisplayData(result);
  const scores = computeOhaeng110(result.pillars, result.input);
  const maxElement = ELEMENT_ORDER.reduce((a, b) =>
    (scores[a] || 0) >= (scores[b] || 0) ? a : b
  );

  return {
    gender: inputGender,
    ilgan: ohaeng.strength.ilgan,
    strength: ohaeng.strength.level,
    dominantElement: ELEMENT_KR[maxElement],
  };
}
