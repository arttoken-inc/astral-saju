import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prefix = req.nextUrl.searchParams.get("prefix") ?? "";
  const cursor = req.nextUrl.searchParams.get("cursor") ?? undefined;

  const r2 = await getR2();
  const result = await r2.list({ prefix, delimiter: "/", cursor, limit: 1000 });

  const folders = (result.delimitedPrefixes ?? []).map((p: string) => ({
    name: p.replace(prefix, "").replace(/\/$/, ""),
    prefix: p,
  }));

  const files = result.objects.map((obj) => ({
    key: obj.key,
    name: obj.key.replace(prefix, ""),
    size: obj.size,
    uploaded: obj.uploaded.toISOString(),
    contentType: obj.httpMetadata?.contentType ?? "",
  }));

  return NextResponse.json({
    folders,
    files,
    truncated: result.truncated,
    cursor: result.truncated ? result.cursor : undefined,
  });
}
