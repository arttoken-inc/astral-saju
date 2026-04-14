/**
 * LLM 프롬프트 빌더 — 유료 결과 웹툰용 14개 aiKey 텍스트 생성
 *
 * chapters.json의 aiKey 구조에 맞는 출력 스키마를 사용한다.
 * SajuResult로부터 직접 데이터를 추출하여 프롬프트를 구성한다.
 */
import type { SajuResult } from '@/lib/saju/saju-engine';
import { toOhaengDisplayData } from '@/lib/saju/resultAdapter';
import type { AiTextOutput } from './types';
import { AI_TEXT_KEYS } from './types';

const ELEMENT_KR: Record<string, string> = {
  wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)',
};

interface PromptParams {
  name: string;
  gender: 'male' | 'female';
  sajuResult: SajuResult;
  advancedContext: string;
  question?: string | null;
  loveStatus?: string | null;
  loveDuration?: string | null;
}

export function buildPaidAnalysisPrompt(params: PromptParams): { system: string; user: string } {
  const { name, gender, sajuResult, advancedContext, question, loveStatus, loveDuration } = params;

  // pillars 순서: [시주, 일주, 월주, 연주]
  const p = sajuResult.pillars;
  const dayPillar = p[1];
  const dayStem = dayPillar.pillar.stem;
  const dayBranch = dayPillar.pillar.branch;

  // 오행 분포 (Record<Element, number>)
  const oh = sajuResult.ohang;
  const ohaeng = toOhaengDisplayData(sajuResult);

  // 가장 강한/약한 오행
  const entries = Object.entries(oh) as [string, number][];
  entries.sort((a, b) => b[1] - a[1]);
  const strongest = ELEMENT_KR[entries[0][0]];
  const weakest = ELEMENT_KR[entries[entries.length - 1][0]];
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const balanced = entries[0][1] - entries[entries.length - 1][1] <= 2;

  const currentYear = new Date().getFullYear();
  const birthYear = sajuResult.input.year;
  const age = currentYear - birthYear + 1;
  const genderLabel = gender === 'male' ? '남성' : '여성';

  // 사주팔자 문자열
  const pillarsKorean = `${p[3].pillar.stem}${p[3].pillar.branch} ${p[2].pillar.stem}${p[2].pillar.branch} ${p[1].pillar.stem}${p[1].pillar.branch} ${p[0].pillar.stem}${p[0].pillar.branch}`;

  // 십신 요약
  const sipsinSummary = p.map((pi, i) => {
    const names = ['시주', '일주', '월주', '연주'];
    return `${names[i]}: 천간 ${pi.pillar.stem}(${pi.stemSipsin}), 지지 ${pi.pillar.branch}(${pi.branchSipsin})`;
  }).join('\n');

  // 사용자 입력 이스케이프 (프롬프트 인젝션 방지)
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const safeName = esc(name);
  const safeQuestion = question ? esc(question) : null;

  // 연애 상태 맥락
  let loveContext = '';
  if (loveStatus) {
    loveContext = `\n- 연애 상태: ${loveStatus}`;
    if (loveDuration) loveContext += ` (${loveDuration})`;
  }

  // 질문 맥락
  const questionContext = safeQuestion
    ? `\n- 질문: "${safeQuestion}"`
    : '';
  const questionInstruction = safeQuestion
    ? `"questionAnswer": "${safeName}님이 "${safeQuestion}"라고 질문하셨습니다. 이 질문에 대해 사주 데이터를 근거로 구체적이고 실용적으로 답변하세요. (500-1500자)"`
    : `"questionAnswer": "${safeName}님의 사주를 종합적으로 정리하고, 앞으로의 실천 가이드와 행운을 부르는 구체적 조언을 제공하세요. (500-1500자)"`;

  const outputSchemaStr = `{
  "personality": "${safeName}님으로 시작. 일주(日柱) 이름과 특성, 사주명리학 기반 성격 분석. (500-1500자)",
  "personalityDetail": "일주의 상세 특성. 천간과 지지의 조합이 만들어내는 성격적 특징, 강점과 약점을 깊이 있게 분석. (500-1500자)",
  "yongshinAnalysis": "용신(${ohaeng.yongshin.name}), 희신(${ohaeng.heeshin.name}), 기신(${ohaeng.gishin.name})의 의미와 영향. 용신을 강화하는 구체적 방법과 기신을 피하는 실용적 조언. (500-1500자)",
  "tenGods": "십신(十神) 배치 분석. 비견/겁재/식신/상관/편재/정재/편관/정관/편인/정인 중 어떤 것이 강하고 약한지, 삶에 미치는 영향. (500-1000자)",
  "majorCycles": "십이운성 분석. 각 기둥의 운성 상태와 전반적 에너지 흐름. (500-1000자)",
  "risk": "신살(神殺) 분석. 양인살, 백호살, 괴강살, 도화살 등 특수 기운의 의미와 활용법. 위기를 기회로 바꾸는 조언. (500-1000자)",
  "relationship": "대인관계·귀인운. 직장/사회에서의 관계 패턴, 귀인운, 소인운, 가족 관계. (500-1000자)",
  "wealth": "재물운 분석. 돈 관리 성향, 투자 성향, 재물이 들어오는 시기와 방법. (500-1500자)",
  "love": "연애&결혼운 분석. 이상형, 결혼 시기, 배우자 성향, 연애 패턴.${loveStatus ? ` 현재 ${esc(loveStatus)} 상태를 고려하여 분석.` : ''} (500-1500자)",
  "career": "직업운 분석. 적성, 추천 직업/업종, 승진/이직 시기, 사업운. (500-1500자)",
  "health": "건강 분석. 오행 기반 취약 장기, 주의할 질병, 건강 관리법. (500-1000자)",
  "majorCyclesDetail": "대운(大運) 상세 분석. 과거 10년 회고, 현재 대운의 의미, 향후 10-20년 운세 방향성과 전환점. (500-1500자)",
  "yearlyFortune": "향후 5년간의 연운(年運) 분석. 각 연도별 주요 흐름과 기회/주의 시기. 삼재 해당 여부 포함. (500-1500자)",
  ${questionInstruction}
}`;

  const system = `당신은 30년 경력의 한국 전통 사주명리학 전문가 "청월"입니다.
유료 사주 서비스의 웹툰 형식 분석 텍스트를 작성합니다.

## 분석 원칙
1. 사주명리학을 주축으로, 자미두수(紫微斗數)와 서양 점성술 관점도 통합 분석하세요.
2. 사주 데이터(사주팔자, 오행, 십신, 대운)를 근거로 분석하세요. 추측 금지.
3. 긍정적인 면과 주의할 점을 균형 있게 서술하세요.
4. 추상적 표현보다 구체적이고 실용적인 조언을 제공하세요.
5. 한국어 존칭을 사용하고, 따뜻하고 격려하는 톤을 유지하세요.
6. 미신적 공포감을 주는 표현은 피하세요.
7. 반드시 "${safeName}님"으로 호칭하세요. "남성분", "여성분" 같은 표현 금지.
8. "~가능성이 높다", "~일 수 있다" 같은 불확실한 표현 금지. 단정적으로 분석하세요.

## 용신/희신/기신 정보 (반드시 활용)
- 용신(用神): ${ohaeng.yongshin.name} — 이 사주에 가장 필요한 오행
- 희신(喜神): ${ohaeng.heeshin.name} — 용신을 도와주는 오행
- 기신(忌神): ${ohaeng.gishin.name} — 이 사주에 해로운 오행
- 일간 강약: ${ohaeng.strength.ilgan} (${ohaeng.strength.level})

## 작성 형식 요구사항
- 각 필드는 순수 텍스트로 작성하세요 (마크다운 금지: ##, **, - 등 사용 금지).
- 문단 구분은 반드시 줄바꿈(\\n)으로 하세요.
- 각 필드의 최소 500자, 최대 1500자를 지켜주세요.
- "personality" 첫 문장은 반드시 "${safeName}님"으로 시작하고 일주 이름(${dayStem}${dayBranch}일주)을 명시하세요.

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트를 포함하지 마세요.

\`\`\`json
${outputSchemaStr}
\`\`\``;

  const user = `## 분석 대상 정보
- 이름: ${name}
- 성별: ${genderLabel}
- 생년월일: ${sajuResult.input.year}년 ${sajuResult.input.month}월 ${sajuResult.input.day}일
- 나이: 만 ${currentYear - birthYear}세 (한국 나이 ${age}세)${loveContext}${questionContext}

## 사주 데이터
- 사주팔자: ${pillarsKorean}
- 일간(日干): ${dayStem}
- 일주(日柱): ${dayStem}${dayBranch}

## 십신(十神) 배치
${sipsinSummary}

## 오행 분포 (총 ${total}글자)
- 목(木): ${oh.wood}개
- 화(火): ${oh.fire}개
- 토(土): ${oh.earth}개
- 금(金): ${oh.metal}개
- 수(水): ${oh.water}개
- 가장 강한 오행: ${strongest}
- 가장 약한 오행: ${weakest}
- 균형 상태: ${balanced ? '비교적 균형' : '불균형'}

## 용신/희신/기신
- 용신: ${ohaeng.yongshin.name}
- 희신: ${ohaeng.heeshin.name}
- 기신: ${ohaeng.gishin.name}

## 사주 기둥 상세
- 연주: ${p[3].pillar.stem}${p[3].pillar.branch}
- 월주: ${p[2].pillar.stem}${p[2].pillar.branch}
- 일주: ${p[1].pillar.stem}${p[1].pillar.branch}
- 시주: ${p[0].pillar.stem}${p[0].pillar.branch}

## 자미두수 · 별자리 분석 데이터 (계산 완료, 그대로 사용)
${advancedContext}

위 데이터를 바탕으로 14개 필드의 종합 사주분석을 JSON으로 작성해주세요. 제공된 데이터는 모두 계산 완료된 확정 값입니다. 추측하지 말고 데이터를 그대로 인용하여 분석하세요.`;

  return { system, user };
}

/** AI 응답에서 JSON을 추출 (코드블록 또는 순수 JSON 처리) */
export function parseAiTextResponse(response: string): Partial<AiTextOutput> {
  const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : response.trim();

  try {
    return JSON.parse(jsonStr) as Partial<AiTextOutput>;
  } catch {
    // JSON 파싱 실패 시 개별 키 추출 시도
    const validKeys = new Set<string>(AI_TEXT_KEYS);
    const result: Partial<AiTextOutput> = {};
    const keyPattern = /"(\w+)"\s*:\s*"((?:[^"\\]|\\[\s\S])*)"/g;
    let match;
    while ((match = keyPattern.exec(jsonStr)) !== null) {
      const [, key, value] = match;
      if (validKeys.has(key)) {
        (result as Record<string, string>)[key] = value.replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }
    }
    if (Object.keys(result).length === 0) {
      throw new Error('AI 응답 JSON 파싱 실패: 유효한 필드를 찾을 수 없습니다.');
    }
    return result;
  }
}
