import {
  calculateFourPillars,
  HEAVENLY_STEMS_HANJA,
  EARTHLY_BRANCHES_HANJA,
  type BirthInfo,
  type FourPillarsDetail,
  type FiveElement,
  type YinYang,
} from "manseryeok";

/**
 * 유저 입력의 시간 값 → 시(hour) 매핑
 * 각 시진의 중간 시각을 사용
 */
const TIME_TO_HOUR: Record<string, { hour: number; minute: number }> = {
  joja: { hour: 0, minute: 30 },    // 조자 00:00~01:29
  chuk: { hour: 2, minute: 30 },    // 축 01:30~03:29
  in: { hour: 4, minute: 30 },      // 인 03:30~05:29
  myo: { hour: 6, minute: 30 },     // 묘 05:30~07:29
  jin: { hour: 8, minute: 30 },     // 진 07:30~09:29
  sa: { hour: 10, minute: 30 },     // 사 09:30~11:29
  oh: { hour: 12, minute: 30 },     // 오 11:30~13:29
  mi: { hour: 14, minute: 30 },     // 미 13:30~15:29
  shin: { hour: 16, minute: 30 },   // 신 15:30~17:29
  yu: { hour: 18, minute: 30 },     // 유 17:30~19:29
  sul: { hour: 20, minute: 30 },    // 술 19:30~21:29
  hae: { hour: 22, minute: 30 },    // 해 21:30~23:29
  yaja: { hour: 23, minute: 30 },   // 야자 23:30~23:59
};

/** 만세력 계산 결과 (내부 저장용) */
export interface ManseryeokResult {
  // 입력 정보
  input: {
    name: string;
    gender: string;
    birthdate: string;       // "YYYY.MM.DD"
    birthtime: string;       // time key (e.g. "oh", "in")
    calendarType: "solar" | "lunar";
  };
  // 사주 팔자 (한자)
  fourPillars: {
    year: { stem: string; branch: string };   // 천간/지지 한자
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  // 사주 팔자 (한글)
  fourPillarsKorean: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  // 오행
  elements: {
    year: { stem: FiveElement; branch: FiveElement };
    month: { stem: FiveElement; branch: FiveElement };
    day: { stem: FiveElement; branch: FiveElement };
    hour: { stem: FiveElement; branch: FiveElement };
  };
  // 음양
  yinYang: {
    year: { stem: YinYang; branch: YinYang };
    month: { stem: YinYang; branch: YinYang };
    day: { stem: YinYang; branch: YinYang };
    hour: { stem: YinYang; branch: YinYang };
  };
  // 메타
  calculatedAt: string;  // ISO timestamp
}

/**
 * 유저 입력으로부터 만세력(사주팔자)을 계산
 */
export function calculateManseryeok(params: {
  name: string;
  gender: string;
  birthdate: string;       // "YYYY.MM.DD"
  birthtime: string;       // "oh", "in", "unknown" etc.
  calendarType: "solar" | "lunar";
}): ManseryeokResult {
  const { name, gender, birthdate, birthtime, calendarType } = params;

  const [year, month, day] = birthdate.split(".").map(Number);
  const time = TIME_TO_HOUR[birthtime] ?? { hour: 12, minute: 0 };

  const birthInfo: BirthInfo = {
    year,
    month,
    day,
    hour: time.hour,
    minute: time.minute,
    isLunar: calendarType === "lunar",
  };

  const result: FourPillarsDetail = calculateFourPillars(birthInfo);
  const hanjaObj = result.toHanjaObject();
  const koreanObj = result.toObject();

  return {
    input: { name, gender, birthdate, birthtime, calendarType },
    fourPillars: {
      year: { stem: hanjaObj.year.hanja[0], branch: hanjaObj.year.hanja[1] },
      month: { stem: hanjaObj.month.hanja[0], branch: hanjaObj.month.hanja[1] },
      day: { stem: hanjaObj.day.hanja[0], branch: hanjaObj.day.hanja[1] },
      hour: { stem: hanjaObj.hour.hanja[0], branch: hanjaObj.hour.hanja[1] },
    },
    fourPillarsKorean: koreanObj,
    elements: {
      year: result.yearElement,
      month: result.monthElement,
      day: result.dayElement,
      hour: result.hourElement,
    },
    yinYang: {
      year: result.yearYinYang,
      month: result.monthYinYang,
      day: result.dayYinYang,
      hour: result.hourYinYang,
    },
    calculatedAt: new Date().toISOString(),
  };
}

/** 오행별 천간/지지 개수 집계 */
export function countElements(result: ManseryeokResult): Record<FiveElement, number> {
  const counts: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const pillar of ["year", "month", "day", "hour"] as const) {
    counts[result.elements[pillar].stem]++;
    counts[result.elements[pillar].branch]++;
  }
  return counts as Record<FiveElement, number>;
}
