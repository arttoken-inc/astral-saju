import type {
  FourPillarsDetail,
  BirthInfo,
  FiveElement,
  HeavenlyStem,
  EarthlyBranch,
  YinYang,
  Pillar,
} from 'manseryeok';

// manseryeok 타입 재 export
export type {
  FourPillarsDetail,
  BirthInfo,
  FiveElement,
  HeavenlyStem,
  EarthlyBranch,
  YinYang,
  Pillar,
};

// ─── 성별 ───

export type Gender = 'male' | 'female';

// ─── 고민 카테고리 ───

export type ConcernType =
  | 'love'
  | 'career'
  | 'wealth'
  | 'health'
  | 'relationship'
  | 'other';

export const CONCERN_LABELS: Record<ConcernType, string> = {
  love: '연애/결혼',
  career: '직업/진로',
  wealth: '재물/금전',
  health: '건강',
  relationship: '대인관계',
  other: '기타',
};

// ─── 오행 분포 ───

export interface FiveElementDistribution {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export const ELEMENT_LABELS: Record<keyof FiveElementDistribution, string> = {
  wood: '목(木)',
  fire: '화(火)',
  earth: '토(土)',
  metal: '금(金)',
  water: '수(水)',
};

// ─── AI 분석 결과 타입 ───

export interface MonthlyFortune {
  month: number;
  fortune: string;
}

export interface LuckyElements {
  color: string;
  direction: string;
  number: string;
}

export interface SajuAnalysis {
  personality: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
  yearlyFortune: string;
  monthlyFortune: MonthlyFortune[];
  luckyElements: LuckyElements;
  summary: string;
  tenGods?: string;
  majorCycles?: string;
  relationship?: string;
  actionAdvice?: string;
}

export interface CompatibilityAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}
