import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keys } = (await req.json()) as { keys: string[] };

  if (!keys || keys.length === 0) {
    return NextResponse.json({ error: "No keys provided" }, { status: 400 });
  }

  const r2 = await getR2();
  await r2.delete(keys);

  return NextResponse.json({ deleted: keys });
}
