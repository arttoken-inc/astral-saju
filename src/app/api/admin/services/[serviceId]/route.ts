import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";

function getConfigKey(serviceId: string) {
  return `config/services/${serviceId}.json`;
}

async function loadBundledConfig(serviceId: string) {
  try {
    const mod = await import(`@/data/services/${serviceId}.json`);
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  // Try R2 first
  try {
    const r2 = await getR2();
    const obj = await r2.get(getConfigKey(serviceId));
    if (obj) {
      const data = await obj.json();
      return NextResponse.json({ source: "r2", data });
    }
  } catch {
    // R2 not available (local dev without wrangler), fall through
  }

  // Fallback to bundled JSON
  const data = await loadBundledConfig(serviceId);
  if (!data) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({ source: "bundled", data });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;
  const data = await req.json();

  try {
    const r2 = await getR2();
    await r2.put(getConfigKey(serviceId), JSON.stringify(data, null, 2), {
      httpMetadata: { contentType: "application/json" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
