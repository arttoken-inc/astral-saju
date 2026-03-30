import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/r2";

const SERVICES = [
  { id: "bluemoonladysaju", name: "청월아씨 정통사주" },
];

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ services: SERVICES });
}
