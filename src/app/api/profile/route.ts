import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDB } from "@/lib/db";
import { calculateSaju } from "@/lib/saju/saju-engine";
import { toOhaengDisplayData } from "@/lib/saju/resultAdapter";

const TIME_TO_HOUR: Record<string, { hour: number; minute: number }> = {
  joja: { hour: 0, minute: 30 },
  chuk: { hour: 2, minute: 30 },
  in: { hour: 4, minute: 30 },
  myo: { hour: 6, minute: 30 },
  jin: { hour: 8, minute: 30 },
  sa: { hour: 10, minute: 30 },
  oh: { hour: 12, minute: 30 },
  mi: { hour: 14, minute: 30 },
  shin: { hour: 16, minute: 30 },
  yu: { hour: 18, minute: 30 },
  sul: { hour: 20, minute: 30 },
  hae: { hour: 22, minute: 30 },
  yaja: { hour: 23, minute: 30 },
};

function computeSajuBadge(birthdate: string, birthtime: string, gender: string): string | null {
  try {
    const [year, month, day] = birthdate.split(".").map(Number);
    const time = TIME_TO_HOUR[birthtime] ?? { hour: 12, minute: 0 };
    const result = calculateSaju({
      year, month, day,
      hour: time.hour,
      minute: time.minute,
      gender: gender === "남성" ? "male" : "female",
      unknownTime: birthtime === "unknown",
    });
    const ohaeng = toOhaengDisplayData(result);
    // 예: "을목 신강"
    const element = ELEMENT_HANJA_TO_KR[result.pillars[1].pillar.stemElement] ?? "";
    return `${ohaeng.strength.ilgan}${element} ${ohaeng.strength.level}`;
  } catch {
    return null;
  }
}

const ELEMENT_HANJA_TO_KR: Record<string, string> = {
  wood: "목", fire: "화", earth: "토", metal: "금", water: "수",
};

// GET /api/profile — fetch current user's saju profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDB();
  const row = await db
    .prepare(
      `SELECT email, name, display_name, birthdate, birthtime, gender, calendar_type, image, saju_badge
       FROM users WHERE email = ?`
    )
    .bind(session.user.email)
    .first();

  if (!row) {
    return NextResponse.json({
      email: session.user.email,
      name: session.user.name,
      displayName: null,
      birthdate: null,
      birthtime: null,
      gender: null,
      calendarType: "solar",
      image: session.user.image,
      sajuBadge: null,
    });
  }

  return NextResponse.json({
    email: row.email,
    name: row.name,
    displayName: row.display_name,
    birthdate: row.birthdate,
    birthtime: row.birthtime,
    gender: row.gender,
    calendarType: row.calendar_type ?? "solar",
    image: row.image,
    sajuBadge: row.saju_badge,
  });
}

// PUT /api/profile — update saju profile
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    displayName?: string;
    birthdate?: string;
    birthtime?: string;
    gender?: string;
    calendarType?: string;
  };

  const { displayName, birthdate, birthtime, gender, calendarType } = body;

  // Compute saju badge if birth data is provided
  let sajuBadge: string | null = null;
  if (birthdate && birthtime && gender) {
    sajuBadge = computeSajuBadge(birthdate, birthtime, gender);
  }

  const db = await getDB();

  await db
    .prepare(
      `INSERT INTO users (id, email, name, image, provider, display_name, birthdate, birthtime, gender, calendar_type, saju_badge)
       VALUES (?, ?, ?, ?, 'google', ?, ?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         display_name = COALESCE(excluded.display_name, users.display_name),
         birthdate = COALESCE(excluded.birthdate, users.birthdate),
         birthtime = COALESCE(excluded.birthtime, users.birthtime),
         gender = COALESCE(excluded.gender, users.gender),
         calendar_type = COALESCE(excluded.calendar_type, users.calendar_type),
         saju_badge = COALESCE(excluded.saju_badge, users.saju_badge)`
    )
    .bind(
      session.user.email,
      session.user.email,
      session.user.name || null,
      session.user.image || null,
      displayName || null,
      birthdate || null,
      birthtime || null,
      gender || null,
      calendarType || "solar",
      sajuBadge
    )
    .run();

  return NextResponse.json({ ok: true, sajuBadge });
}
