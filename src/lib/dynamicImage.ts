/**
 * 동적 이미지 경로 해석
 * service.json의 dynamicImages 규칙에 따라 사주 계산 결과로 이미지 경로를 생성
 */

import type { DynamicImageRule } from "@/lib/serviceConfig";
import type { SajuImageVars } from "@/lib/saju/resultAdapter";

/**
 * dynamicImages 규칙의 패턴 변수를 실제 값으로 치환하여 이미지 경로를 생성합니다.
 *
 * @param rule - dynamicImages의 규칙 (pattern, variables, fallback)
 * @param vars - 사주 계산 결과에서 추출한 변수 맵 (SajuImageVars)
 * @returns 치환된 이미지 경로 (치환 실패 시 fallback)
 */
export function resolveDynamicImage(
  rule: DynamicImageRule,
  vars: SajuImageVars,
): string {
  let path = rule.pattern;

  for (const [varName, varDef] of Object.entries(rule.variables)) {
    // varName을 vars 키로 사용 (SajuImageVars의 필드명과 일치)
    let value = (vars as unknown as Record<string, string>)[varName] ?? "";

    // map이 있으면 값 변환 (예: "남성" → "FEMALE")
    if (varDef.map && value in varDef.map) {
      value = varDef.map[value];
    }

    // URL 인코딩 (한글 파일명)
    const encoded = encodeURIComponent(value);
    path = path.replace(`{${varName}}`, encoded);
  }

  // 치환되지 않은 변수가 남아있으면 fallback
  if (path.includes("{")) {
    return rule.fallback || path;
  }

  return path;
}

/**
 * 서비스의 모든 동적 이미지를 한번에 해석합니다.
 */
export function resolveAllDynamicImages(
  rules: Record<string, DynamicImageRule>,
  vars: SajuImageVars,
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, rule] of Object.entries(rules)) {
    resolved[key] = resolveDynamicImage(rule, vars);
  }
  return resolved;
}
