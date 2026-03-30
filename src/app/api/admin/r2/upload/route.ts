import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const prefix = (formData.get("prefix") as string) ?? "";
  const files = formData.getAll("files") as File[];

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const r2 = await getR2();
  const uploaded: string[] = [];

  for (const file of files) {
    const key = prefix + file.name;
    const buffer = await file.arrayBuffer();
    await r2.put(key, buffer, {
      httpMetadata: { contentType: file.type },
    });
    uploaded.push(key);
  }

  return NextResponse.json({ uploaded });
}
