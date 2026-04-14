import type { LlmResponse } from './types';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const API_URL = 'https://api.anthropic.com/v1/messages';

export async function callAnthropic(
  apiKey: string,
  system: string,
  user: string,
  options?: { model?: string; maxTokens?: number; temperature?: number },
): Promise<LlmResponse> {
  const model = options?.model || DEFAULT_MODEL;
  const maxTokens = options?.maxTokens || 16000;
  const temperature = options?.temperature ?? 0.7;

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Anthropic API error ${res.status}: ${errorBody}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
    model: string;
    usage: { input_tokens: number; output_tokens: number };
    stop_reason: string;
  };

  const text = data.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('');

  return {
    content: text,
    model: data.model,
    inputTokens: data.usage.input_tokens,
    outputTokens: data.usage.output_tokens,
    stopReason: data.stop_reason,
  };
}
