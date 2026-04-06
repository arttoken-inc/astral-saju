import type { ManseryeokResult } from "./manseryeok";

/**
 * 유저별 만세력 결과 저장/조회
 * Cloudflare KV를 사용하여 유저별로 저장
 * Key: `saju:{userId}`
 *
 * KV namespace는 호출 시 명시적으로 전달해야 함
 * (Cloudflare Workers 환경에서 getRequestContext().env.SAJU_KV)
 */

const KV_PREFIX = "saju:";

export async function saveManseryeokResult(
  kv: KVNamespace,
  userId: string,
  result: ManseryeokResult,
): Promise<void> {
  await kv.put(`${KV_PREFIX}${userId}`, JSON.stringify(result));
}

export async function getManseryeokResult(
  kv: KVNamespace,
  userId: string,
): Promise<ManseryeokResult | null> {
  const data = await kv.get(`${KV_PREFIX}${userId}`);
  return data ? (JSON.parse(data) as ManseryeokResult) : null;
}

export async function deleteManseryeokResult(
  kv: KVNamespace,
  userId: string,
): Promise<void> {
  await kv.delete(`${KV_PREFIX}${userId}`);
}
