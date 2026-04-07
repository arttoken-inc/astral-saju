import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";
import type { ServiceConfig, ServiceScript } from "@/lib/serviceConfig";

function serviceKey(serviceId: string) {
  return `config/services/${serviceId}/service.json`;
}

function scriptKey(serviceId: string) {
  return `config/services/${serviceId}/script.json`;
}

async function loadBundledService(serviceId: string): Promise<ServiceConfig | null> {
  try {
    const mod = await import(`@/data/services/${serviceId}/service.json`);
    return (mod.default ?? mod) as ServiceConfig;
  } catch {
    return null;
  }
}

async function loadBundledScript(serviceId: string): Promise<ServiceScript | null> {
  try {
    const mod = await import(`@/data/services/${serviceId}/script.json`);
    return (mod.default ?? mod) as ServiceScript;
  } catch {
    return null;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  // Try R2 first
  let service: ServiceConfig | null = null;
  let script: ServiceScript | null = null;
  let source: "r2" | "bundled" = "bundled";

  try {
    const r2 = await getR2();
    const [svcObj, scrObj] = await Promise.all([
      r2.get(serviceKey(serviceId)),
      r2.get(scriptKey(serviceId)),
    ]);
    if (svcObj) {
      service = (await svcObj.json()) as ServiceConfig;
      source = "r2";
    }
    if (scrObj) {
      script = (await scrObj.json()) as ServiceScript;
    }
  } catch {
    // R2 not available
  }

  // Fallback to bundled
  if (!service) {
    service = await loadBundledService(serviceId);
  }
  if (!script) {
    script = await loadBundledScript(serviceId);
  }

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  return NextResponse.json({
    source,
    service,
    script: script || null,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;
  const body = (await req.json()) as {
    service?: ServiceConfig;
    script?: ServiceScript;
  };

  try {
    const r2 = await getR2();
    const tasks: Promise<unknown>[] = [];

    if (body.service) {
      tasks.push(
        r2.put(serviceKey(serviceId), JSON.stringify(body.service, null, 2), {
          httpMetadata: { contentType: "application/json" },
        }),
      );
    }

    if (body.script) {
      tasks.push(
        r2.put(scriptKey(serviceId), JSON.stringify(body.script, null, 2), {
          httpMetadata: { contentType: "application/json" },
        }),
      );
    }

    await Promise.all(tasks);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

/** Delete a service */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId } = await params;

  try {
    const r2 = await getR2();
    await Promise.all([
      r2.delete(serviceKey(serviceId)),
      r2.delete(scriptKey(serviceId)),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
