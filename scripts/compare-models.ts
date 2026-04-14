/**
 * Haiku vs Sonnet 비교 테스트
 * 동일 사주 입력으로 두 모델의 출력 품질을 비교한다.
 *
 * Usage: bun scripts/compare-models.ts
 */
import { calculateSaju } from '../src/lib/saju/saju-engine';
import { toOhaengDisplayData } from '../src/lib/saju/resultAdapter';
import { generateAdvancedSajuContextFromResult } from '../src/lib/saju/advanced-analysis';
import { callAnthropic } from '../src/lib/llm/anthropic';
import { buildPaidAnalysisPrompt, parseAiTextResponse } from '../src/lib/llm/promptBuilder';
import { AI_TEXT_KEYS } from '../src/lib/llm/types';

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY not set. Add it to .env.local');
  process.exit(1);
}

// 테스트 입력: 1987.02.05 묘시 남성
const TEST_INPUT = {
  name: '이선',
  gender: 'male' as const,
  year: 1987,
  month: 2,
  day: 5,
  hour: 6, // 묘시
  question: '올해 이직을 고려하고 있는데 좋은 시기일까요?',
  loveStatus: '연애중',
  loveDuration: '3~5년',
};

async function runTest(model: string, label: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔄 ${label} (${model}) 테스트 시작...`);
  console.log(`${'='.repeat(60)}`);

  const sajuResult = calculateSaju({
    year: TEST_INPUT.year,
    month: TEST_INPUT.month,
    day: TEST_INPUT.day,
    hour: TEST_INPUT.hour,
    minute: 0,
    gender: TEST_INPUT.gender,
    unknownTime: false,
  });

  const advancedContext = await generateAdvancedSajuContextFromResult(
    sajuResult,
    TEST_INPUT.year,
    TEST_INPUT.month,
    TEST_INPUT.day,
    TEST_INPUT.hour,
    TEST_INPUT.gender,
  );

  const { system, user } = buildPaidAnalysisPrompt({
    name: TEST_INPUT.name,
    gender: TEST_INPUT.gender,
    sajuResult,
    advancedContext,
    question: TEST_INPUT.question,
    loveStatus: TEST_INPUT.loveStatus,
    loveDuration: TEST_INPUT.loveDuration,
  });

  const start = Date.now();
  const response = await callAnthropic(API_KEY!, system, user, {
    model,
    maxTokens: 16000,
    temperature: 0.7,
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`⏱️  응답 시간: ${elapsed}초`);
  console.log(`📊 토큰: 입력 ${response.inputTokens} / 출력 ${response.outputTokens} (총 ${response.inputTokens + response.outputTokens})`);
  console.log(`🛑 중단 이유: ${response.stopReason}`);

  // 비용 계산
  let cost: number;
  if (model.includes('haiku')) {
    cost = (response.inputTokens * 0.80 + response.outputTokens * 4.0) / 1_000_000;
  } else {
    cost = (response.inputTokens * 3.0 + response.outputTokens * 15.0) / 1_000_000;
  }
  console.log(`💰 예상 비용: $${cost.toFixed(4)}`);

  // JSON 파싱
  let parsed;
  try {
    parsed = parseAiTextResponse(response.content);
  } catch (e) {
    console.error(`❌ JSON 파싱 실패:`, e);
    console.log(`\n--- Raw response (처음 500자) ---`);
    console.log(response.content.slice(0, 500));
    return null;
  }

  // 필드별 분석
  console.log(`\n📋 필드별 결과:`);
  let totalChars = 0;
  let validCount = 0;
  const fieldStats: { key: string; chars: number; valid: boolean }[] = [];

  for (const key of AI_TEXT_KEYS) {
    const text = parsed[key];
    const chars = text?.length || 0;
    const valid = chars >= 200; // 최소 200자는 되어야 의미 있음
    if (valid) validCount++;
    totalChars += chars;
    fieldStats.push({ key, chars, valid });

    const status = !text ? '❌ 없음' : chars < 200 ? `⚠️  ${chars}자 (너무 짧음)` : `✅ ${chars}자`;
    console.log(`  ${key.padEnd(22)} ${status}`);
  }

  console.log(`\n📈 요약: ${validCount}/${AI_TEXT_KEYS.length} 유효 필드, 총 ${totalChars}자`);

  // 샘플 텍스트 출력 (personality, questionAnswer)
  console.log(`\n--- personality 샘플 (처음 300자) ---`);
  console.log(parsed.personality?.slice(0, 300) || '(없음)');

  console.log(`\n--- questionAnswer 샘플 (처음 300자) ---`);
  console.log(parsed.questionAnswer?.slice(0, 300) || '(없음)');

  // 품질 체크
  console.log(`\n🔍 품질 체크:`);
  const personalityStartsWithName = parsed.personality?.startsWith(`${TEST_INPUT.name}님`);
  console.log(`  "${TEST_INPUT.name}님"으로 시작: ${personalityStartsWithName ? '✅' : '❌'}`);

  const hasHanja = /[\u4E00-\u9FFF]/.test(parsed.personality || '');
  console.log(`  한자 포함 여부: ${hasHanja ? '✅' : '⚠️  없음'}`);

  const mentionsYongshin = (parsed.yongshinAnalysis || '').includes('용신');
  console.log(`  용신 언급 여부: ${mentionsYongshin ? '✅' : '❌'}`);

  const answersQuestion = (parsed.questionAnswer || '').includes('이직');
  console.log(`  질문(이직) 답변 여부: ${answersQuestion ? '✅' : '❌'}`);

  const hasMarkdown = /[#*\-]/.test(parsed.personality || '');
  console.log(`  마크다운 사용 여부: ${hasMarkdown ? '⚠️  마크다운 포함' : '✅ 순수 텍스트'}`);

  return {
    model,
    label,
    elapsed: parseFloat(elapsed),
    inputTokens: response.inputTokens,
    outputTokens: response.outputTokens,
    cost,
    validCount,
    totalChars,
    stopReason: response.stopReason,
    qualityChecks: {
      startsWithName: personalityStartsWithName,
      hasHanja,
      mentionsYongshin,
      answersQuestion,
      noMarkdown: !hasMarkdown,
    },
  };
}

async function main() {
  console.log('🧪 Haiku vs Sonnet 사주 분석 텍스트 비교 테스트');
  console.log(`입력: ${TEST_INPUT.name}, ${TEST_INPUT.year}.${TEST_INPUT.month}.${TEST_INPUT.day}, ${TEST_INPUT.gender}`);
  console.log(`질문: ${TEST_INPUT.question}`);

  const sonnet = await runTest('claude-sonnet-4-20250514', 'Sonnet');
  const haiku = await runTest('claude-haiku-4-5-20251001', 'Haiku');

  // 최종 비교
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 최종 비교');
  console.log(`${'='.repeat(60)}`);

  if (sonnet && haiku) {
    console.log(`\n${'항목'.padEnd(20)} ${'Sonnet'.padEnd(15)} ${'Haiku'.padEnd(15)}`);
    console.log('-'.repeat(50));
    console.log(`${'응답 시간'.padEnd(18)} ${(sonnet.elapsed + '초').padEnd(15)} ${(haiku.elapsed + '초').padEnd(15)}`);
    console.log(`${'출력 토큰'.padEnd(18)} ${String(sonnet.outputTokens).padEnd(15)} ${String(haiku.outputTokens).padEnd(15)}`);
    console.log(`${'비용'.padEnd(20)} ${'$' + sonnet.cost.toFixed(4).padEnd(14)} ${'$' + haiku.cost.toFixed(4).padEnd(14)}`);
    console.log(`${'유효 필드'.padEnd(18)} ${(sonnet.validCount + '/14').padEnd(15)} ${(haiku.validCount + '/14').padEnd(15)}`);
    console.log(`${'총 글자수'.padEnd(18)} ${(sonnet.totalChars + '자').padEnd(15)} ${(haiku.totalChars + '자').padEnd(15)}`);
    console.log(`${'중단 이유'.padEnd(18)} ${sonnet.stopReason.padEnd(15)} ${haiku.stopReason.padEnd(15)}`);

    const sQ = sonnet.qualityChecks;
    const hQ = haiku.qualityChecks;
    console.log(`\n${'품질'.padEnd(20)} ${'Sonnet'.padEnd(15)} ${'Haiku'.padEnd(15)}`);
    console.log('-'.repeat(50));
    console.log(`${'이름 호칭'.padEnd(18)} ${(sQ.startsWithName ? '✅' : '❌').padEnd(15)} ${(hQ.startsWithName ? '✅' : '❌').padEnd(15)}`);
    console.log(`${'한자 사용'.padEnd(18)} ${(sQ.hasHanja ? '✅' : '❌').padEnd(15)} ${(hQ.hasHanja ? '✅' : '❌').padEnd(15)}`);
    console.log(`${'용신 언급'.padEnd(18)} ${(sQ.mentionsYongshin ? '✅' : '❌').padEnd(15)} ${(hQ.mentionsYongshin ? '✅' : '❌').padEnd(15)}`);
    console.log(`${'질문 답변'.padEnd(18)} ${(sQ.answersQuestion ? '✅' : '❌').padEnd(15)} ${(hQ.answersQuestion ? '✅' : '❌').padEnd(15)}`);
    console.log(`${'순수 텍스트'.padEnd(16)} ${(sQ.noMarkdown ? '✅' : '⚠️').padEnd(15)} ${(hQ.noMarkdown ? '✅' : '⚠️').padEnd(15)}`);
  }
}

main().catch(console.error);
