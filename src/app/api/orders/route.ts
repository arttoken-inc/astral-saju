import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDB } from "@/lib/db";

// GET /api/orders — list current user's orders
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDB();
  const { results } = await db
    .prepare(
      `SELECT o.*, sr.result_json
       FROM orders o
       LEFT JOIN saju_results sr ON sr.order_id = o.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`
    )
    .bind(session.user.email)
    .all();

  return NextResponse.json({ orders: results });
}

// POST /api/orders — create a new order
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    serviceId?: string;
    serviceName?: string;
    name?: string;
    birthdate?: string;
    birthtime?: string;
    gender?: string;
    question?: string;
    questionCount?: number;
  };
  const { serviceId, serviceName, name, birthdate, birthtime, gender, question, questionCount } = body;

  if (!serviceId || !name || !birthdate || !birthtime || !gender) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = await getDB();
  const id = `${serviceId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Upsert user
  await db
    .prepare(
      `INSERT INTO users (id, email, name, image, provider)
       VALUES (?, ?, ?, ?, 'google')
       ON CONFLICT(email) DO UPDATE SET name = excluded.name, image = excluded.image`
    )
    .bind(
      session.user.email,
      session.user.email,
      session.user.name || null,
      session.user.image || null
    )
    .run();

  // Create order
  await db
    .prepare(
      `INSERT INTO orders (id, user_id, service_id, service_name, name, birthdate, birthtime, gender, question, question_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      session.user.email,
      serviceId,
      serviceName || serviceId,
      name,
      birthdate,
      birthtime,
      gender,
      question || null,
      questionCount || 0
    )
    .run();

  return NextResponse.json({ id }, { status: 201 });
}
