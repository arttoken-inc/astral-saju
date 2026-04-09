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

/**
 * 월지 30점 오행 배분 테이블 (청월당 역분석)
 *
 * - 사왕지(子卯午酉) / 음생지(巳亥): 본기 오행
 * - 양생지(寅申): 이전 계절 오행 (寅→water, 申→fire)
 * - 음사고지(丑未): 계절 잔여 오행 (丑→water, 未→fire)
 * - 양사고지(辰戌): 본기 오행 (earth) — 더 정밀한 데이터 확보 시 phase 기반으로 개선 가능
 */
const MONTH_BRANCH_ELEMENT: Record<string, Element> = {
  "子": "water", "丑": "water", "寅": "water", "卯": "wood",
  "辰": "earth", "巳": "fire",  "午": "fire",  "未": "fire",
  "申": "fire",  "酉": "metal", "戌": "earth", "亥": "water",
};

/**
 * 월지 지장간 테이블 (투출 판정용)
 * 월간이 월지의 지장간에 포함되어 있으면, 월간의 10점이
 * 월간 고유 오행이 아닌 월지의 30점 오행으로 이동 (투출 효과)
 */
const MONTH_HIDDEN_STEMS: Record<string, string[]> = {
  "子": ["壬", "癸"], "丑": ["癸", "辛", "己"], "寅": ["戊", "丙", "甲"],
  "卯": ["甲", "乙"], "辰": ["乙", "癸", "戊"], "巳": ["戊", "庚", "丙"],
  "午": ["丙", "己", "丁"], "未": ["丁", "乙", "己"], "申": ["戊", "壬", "庚"],
  "酉": ["庚", "辛"], "戌": ["辛", "丁", "戊"], "亥": ["戊", "甲", "壬"],
};

/**
 * 110점 오행 점수 계산 (청월당 역분석 v4)
 *
 * 배점: 천간 4×10(40) + 연지10 + 월지30 + 일지15 + 시지15 = 110
 *
 * 투출(透出) 규칙: 월간이 월지의 지장간에 포함되어 있으면,
 * 월간의 10점이 고유 오행 대신 월지의 30점 오행으로 이동.
 */
function computeOhaeng110(
  pillars: SajuResult["pillars"],
): Record<Element, number> {
  // pillars 순서: [시주(0), 일주(1), 월주(2), 연주(3)]
  const stems = pillars.map(p => p.pillar.stem);
  const branches = pillars.map(p => p.pillar.branch);
  const [tg, dg, mg, yg] = branches; // 시지, 일지, 월지, 연지

  const scores: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  // 월지의 30점 오행
  const monthElement = MONTH_BRANCH_ELEMENT[mg] ?? BRANCH_MAIN_ELEMENT[mg];

  // 1. 천간: 각 10점 (투출 적용)
  const monthStem = stems[2]; // 월간
  const monthHiddenStems = MONTH_HIDDEN_STEMS[mg] ?? [];
  const isTuchul = monthHiddenStems.includes(monthStem);

  for (let i = 0; i < stems.length; i++) {
    if (i === 2 && isTuchul) {
      // 월간이 투출 → 월지의 오행으로 이동
      scores[monthElement] += 10;
    } else {
      scores[STEM_TO_ELEMENT[stems[i]]] += 10;
    }
  }

  // 2. 연지: 10점, 본기 오행
  scores[BRANCH_MAIN_ELEMENT[yg]] += 10;

  // 3. 월지: 30점
  scores[monthElement] += 30;

  // 4. 일지: 15점, 본기 오행
  scores[BRANCH_MAIN_ELEMENT[dg]] += 15;

  // 5. 시지: 15점, 본기 오행
  scores[BRANCH_MAIN_ELEMENT[tg]] += 15;

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
  const rawScores = computeOhaeng110(result.pillars);

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

  // 용신/희신/기신 판별 — 조후용신 우선, 억부용신 보조
  const birthMonth = result.input.month;
  const johuYongshin = getJohuYongshin(dayElement, birthMonth);
  const yongshin = johuYongshin ?? (
    myScore >= 40
      ? getControllingElement(dayElement)
      : getGeneratingElement(dayElement)
  );
  const heeshin = getGeneratingElement(yongshin); // 용신을 생하는 오행
  const gishin = getControllingElement(yongshin); // 용신을 극하는 오행

  return {
    distribution,
    ratio,
    yongshin: { name: ELEMENT_KR[yongshin], img: ELEMENT_KR[yongshin] },
    heeshin: { name: ELEMENT_KR[heeshin], img: ELEMENT_KR[heeshin] },
    gishin: { name: ELEMENT_KR[gishin], img: ELEMENT_KR[gishin] },
    strength: { ilgan: ilganHangul, level },
    myElementIndex: ELEMENT_ORDER.indexOf(dayElement),
  };
}

/**
 * 조후용신 테이블
 * 일간 오행 + 출생 월(양력) → 용신 오행
 * 계절의 한열조습을 보완하는 전통 사주명리학 기반
 */
function getJohuYongshin(dayElement: Element, month: number): Element | null {
  // 계절: 봄(2-4), 여름(5-7), 가을(8-10), 겨울(11-1)
  const table: Record<Element, Record<string, Element>> = {
    wood: { spring: "fire", summer: "water", autumn: "fire", winter: "fire" },
    fire: { spring: "wood", summer: "water", autumn: "wood", winter: "wood" },
    earth: { spring: "fire", summer: "metal", autumn: "fire", winter: "fire" },
    metal: { spring: "fire", summer: "water", autumn: "water", winter: "fire" },
    water: { spring: "fire", summer: "metal", autumn: "metal", winter: "fire" },
  };
  let season: string;
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "autumn";
  else season = "winter";

  return table[dayElement]?.[season] ?? null;
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

/** 운명의 짝 데이터 생성 (일간 오행 + 신강/신약 기반 결정론적 매핑) */
export function toDestinyPartnerData(
  result: SajuResult,
  inputGender: string,
): DestinyPartnerDisplayData {
  const dayElement = result.pillars[1].pillar.stemElement;
  const ohaeng = toOhaengDisplayData(result);
  const isStrong = ["신강", "태강", "극왕"].includes(ohaeng.strength.level);
  // 상대방 성별은 반대
  const partnerGender = inputGender === "남성" || inputGender === "male" ? "female" : "male";

  const JOBS: Record<Element, string[]> = {
    wood: ["교육·연구", "기획·컨설팅"],
    fire: ["예술·엔터", "마케팅·홍보"],
    earth: ["금융·부동산", "의료·복지"],
    metal: ["데이터·연구", "법률·공공"],
    water: ["IT·개발", "무역·유통"],
  };

  const HEIGHTS: Record<string, string[]> = {
    female: ["157cm", "160cm", "162cm", "165cm", "168cm"],
    male: ["172cm", "175cm", "178cm", "180cm", "183cm"],
  };

  const FACE: Record<Element, string[]> = {
    wood: ["큰 눈", "긴 얼굴형"],
    fire: ["밝은인상", "또렷한콧대"],
    earth: ["둥근얼굴", "따뜻한눈빛"],
    metal: ["또렷한콧대", "깔끔한헤어"],
    water: ["차분한인상", "매끈한피부"],
  };

  const PERSONALITY: Record<Element, string[]> = {
    wood: ["리더십강함", "진취적"],
    fire: ["열정적", "사교적"],
    earth: ["안정지향", "성실함"],
    metal: ["정리정돈잘함", "분석적"],
    water: ["유연한사고", "직관적"],
  };

  const TRAITS: Record<Element, string[]> = {
    wood: ["추진력", "자기계발"],
    fire: ["감성적매력", "에너지넘침"],
    earth: ["든든한지원자", "가정적"],
    metal: ["논리적인매력", "루틴중시"],
    water: ["창의적", "배려심깊음"],
  };

  // 상대방 오행: 신강이면 나를 극하는 오행, 신약이면 일간 자체 오행
  const partnerElement = isStrong
    ? getControllingElement(dayElement)
    : dayElement;

  const heightIdx = ELEMENT_ORDER.indexOf(dayElement) % 5;
  const job = JOBS[partnerElement][0];
  const height = HEIGHTS[partnerGender][heightIdx];
  const appearance = [height, FACE[partnerElement][0], FACE[partnerElement][1]];
  const personality = PERSONALITY[partnerElement];
  const traits = TRAITS[partnerElement];

  return { job, appearance, personality, traits };
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
  const scores = computeOhaeng110(result.pillars);
  const maxElement = ELEMENT_ORDER.reduce((a, b) =>
    (scores[a] || 0) >= (scores[b] || 0) ? a : b
  );

  // 성별 정규화 (영어 → 한국어)
  const genderNorm = inputGender === "male" ? "남성"
    : inputGender === "female" ? "여성"
    : inputGender;

  // CDN 이미지는 신강/신약 2종류만 존재
  const level = ohaeng.strength.level;
  const strengthSimple = ["신강", "태강", "극왕"].includes(level) ? "신강" : "신약";

  return {
    gender: genderNorm,
    ilgan: ohaeng.strength.ilgan,
    strength: strengthSimple,
    dominantElement: ELEMENT_KR[maxElement],
  };
}
