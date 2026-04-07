import { NextRequest, NextResponse } from "next/server";
import { getR2, requireAdmin } from "@/lib/r2";
import fs from "fs";
import path from "path";

interface ServiceListItem {
  id: string;
  name: string;
  source: "r2" | "bundled";
}

// Bundled services directory
const BUNDLED_DIR = path.join(process.cwd(), "src/data/services");

/** Scan R2 for services (look for config/services/{id}/service.json) */
async function listR2Services(): Promise<ServiceListItem[]> {
  try {
    const r2 = await getR2();
    const listed = await r2.list({ prefix: "config/services/", delimiter: "/" });
    const items: ServiceListItem[] = [];

    for (const prefix of listed.delimitedPrefixes || []) {
      // prefix = "config/services/bluemoonladysaju/"
      const id = prefix.replace("config/services/", "").replace(/\/$/, "");
      if (!id) continue;

      // Try to read meta.serviceTitle from service.json
      const obj = await r2.get(`config/services/${id}/service.json`);
      let name = id;
      if (obj) {
        try {
          const data = (await obj.json()) as { meta?: { serviceTitle?: string } };
          name = data?.meta?.serviceTitle || id;
        } catch { /* use id as name */ }
      }
      items.push({ id, name, source: "r2" });
    }
    return items;
  } catch {
    return [];
  }
}

/** Scan bundled services directory */
function listBundledServices(): ServiceListItem[] {
  try {
    const dirs = fs.readdirSync(BUNDLED_DIR, { withFileTypes: true });
    return dirs
      .filter((d) => d.isDirectory())
      .filter((d) => {
        // Must have service.json
        return fs.existsSync(path.join(BUNDLED_DIR, d.name, "service.json"));
      })
      .map((d) => {
        let name = d.name;
        try {
          const svc = JSON.parse(
            fs.readFileSync(path.join(BUNDLED_DIR, d.name, "service.json"), "utf-8"),
          );
          name = svc?.meta?.serviceTitle || d.name;
        } catch { /* use dir name */ }
        return { id: d.name, name, source: "bundled" as const };
      });
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const r2Services = await listR2Services();
  const bundledServices = listBundledServices();

  // Merge: R2 takes priority over bundled
  const r2Ids = new Set(r2Services.map((s) => s.id));
  const merged = [
    ...r2Services,
    ...bundledServices.filter((s) => !r2Ids.has(s.id)),
  ];

  return NextResponse.json({ services: merged });
}

/** Create a new service (POST) */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId, serviceTitle } = (await req.json()) as {
    serviceId: string;
    serviceTitle: string;
  };

  if (!serviceId || !serviceTitle) {
    return NextResponse.json(
      { error: "serviceId와 serviceTitle은 필수입니다" },
      { status: 400 },
    );
  }

  // Validate serviceId format (alphanumeric + hyphens only)
  if (!/^[a-z0-9-]+$/.test(serviceId)) {
    return NextResponse.json(
      { error: "serviceId는 영문 소문자, 숫자, 하이픈만 사용 가능합니다" },
      { status: 400 },
    );
  }

  // Check if already exists
  try {
    const r2 = await getR2();
    const existing = await r2.get(`config/services/${serviceId}/service.json`);
    if (existing) {
      return NextResponse.json(
        { error: "이미 존재하는 서비스 ID입니다" },
        { status: 409 },
      );
    }
  } catch { /* R2 unavailable, skip check */ }

  // Create default service.json and script.json
  const defaultService = {
    meta: {
      serviceId,
      version: "1.0",
      serviceTitle,
      pageTitle: serviceTitle,
      price: 9900,
      description: "",
      thumbnails: {
        banner: "thumbnails/banner.png",
        card: "thumbnails/card.png",
        rankBadge: "thumbnails/rank_badge.png",
      },
    },
    character: {
      id: "default",
      name: "사주 선생",
      displayName: "사주 선생님",
      avatar: "",
      tone: "",
    },
    theme: {
      primary: "#C8A96E",
      cardBorder: "rgba(200,169,110,0.3)",
      cardBg: "rgba(26,26,26,0.9)",
      cardAccent: "#C8A96E",
      resultBg: "#111111",
    },
    prompts: {
      preview: { system: "", user: "" },
      fullAnalysis: { system: "", user: "", outputSchema: {} },
    },
    dynamicImages: {},
    steps: [
      {
        id: "home",
        type: "hero",
        bgType: "image",
        bgSrc: "",
        next: "intro",
      },
    ],
    resultPage: {
      sections: [],
      paymentBar: {
        triggerAfter: "payment-gate",
        countdown: { h: 0, m: 30, s: 0 },
      },
    },
    decorations: {
      leftCloud: "",
      rightCloud: "",
      fiveCircle: "",
      fiveCircleLegend: "",
      strengthDiagram: "",
    },
    timeOptions: [
      { value: "joja", label: "자시 (23:00~01:00)" },
      { value: "chuk", label: "축시 (01:00~03:00)" },
      { value: "in", label: "인시 (03:00~05:00)" },
      { value: "myo", label: "묘시 (05:00~07:00)" },
      { value: "jin", label: "진시 (07:00~09:00)" },
      { value: "sa", label: "사시 (09:00~11:00)" },
      { value: "oh", label: "오시 (11:00~13:00)" },
      { value: "mi", label: "미시 (13:00~15:00)" },
      { value: "shin", label: "신시 (15:00~17:00)" },
      { value: "yu", label: "유시 (17:00~19:00)" },
      { value: "sul", label: "술시 (19:00~21:00)" },
      { value: "hae", label: "해시 (21:00~23:00)" },
      { value: "unknown", label: "모름" },
    ],
  };

  const defaultScript = {
    character: {
      id: "default",
      name: "사주 선생",
      displayName: "사주 선생님",
    },
    steps: {
      home: { cta: "시작하기" },
    },
    fields: {},
    result: {},
    titles: {},
    payment: {
      discountLabel: "지금 바로 확인하기",
      button: "풀 분석 보기",
    },
  };

  try {
    const r2 = await getR2();
    await Promise.all([
      r2.put(
        `config/services/${serviceId}/service.json`,
        JSON.stringify(defaultService, null, 2),
        { httpMetadata: { contentType: "application/json" } },
      ),
      r2.put(
        `config/services/${serviceId}/script.json`,
        JSON.stringify(defaultScript, null, 2),
        { httpMetadata: { contentType: "application/json" } },
      ),
    ]);
    return NextResponse.json({ ok: true, serviceId });
  } catch {
    return NextResponse.json({ error: "서비스 생성 실패" }, { status: 500 });
  }
}
