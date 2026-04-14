export interface LlmResponse {
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string;
}

/** chapters.json의 모든 aiKey에 대응하는 출력 스키마 */
export interface AiTextOutput {
  personality: string;         // ch2 성격
  personalityDetail: string;   // ch2 일주 특성 상세
  yongshinAnalysis: string;    // ch2 용신/희신/기신
  tenGods: string;             // ch3 십성
  majorCycles: string;         // ch4 십이운성
  risk: string;                // ch5 신살
  relationship: string;        // ch6 귀인/대인관계
  wealth: string;              // ch7 재물운
  love: string;                // ch8 연애&결혼운
  career: string;              // ch9 직업운
  health: string;              // ch10 건강운
  majorCyclesDetail: string;   // ch11 대운 상세
  yearlyFortune: string;       // ch12 향후 5년 연운
  questionAnswer: string;      // ch13 질문 답변
}

export const AI_TEXT_KEYS: (keyof AiTextOutput)[] = [
  'personality', 'personalityDetail', 'yongshinAnalysis', 'tenGods',
  'majorCycles', 'risk', 'relationship', 'wealth', 'love', 'career',
  'health', 'majorCyclesDetail', 'yearlyFortune', 'questionAnswer',
];
