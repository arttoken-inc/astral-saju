/**
 * 템플릿 문자열에서 {name}, {characterName} 등의 변수를 치환합니다.
 */
export function replaceTemplate(
  text: string,
  vars: Record<string, string>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}
