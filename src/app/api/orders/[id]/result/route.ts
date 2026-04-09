import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDB } from "@/lib/db";

// PUT /api/orders/[id]/result — save saju analysis result
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as { resultJson?: unknown };
  const { resultJson } = body;

  if (!resultJson) {
    return NextResponse.json({ error: "Missing resultJson" }, { status: 400 });
  }

  const db = await getDB();

  // Verify ownership
  const order = await db
    .prepare("SELECT id, user_id FROM orders WHERE id = ?")
    .bind(id)
    .first();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const resultId = `result_${id}`;
  const jsonStr = typeof resultJson === "string" ? resultJson : JSON.stringify(resultJson);

  await db
    .prepare(
      `INSERT INTO saju_results (id, order_id, result_json)
       VALUES (?, ?, ?)
       ON CONFLICT(order_id) DO UPDATE SET result_json = excluded.result_json`
    )
    .bind(resultId, id, jsonStr)
    .run();

  return NextResponse.json({ success: true });
}

// GET /api/orders/[id]/result — get saju analysis result
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDB();

  const order = await db
    .prepare("SELECT id, user_id FROM orders WHERE id = ?")
    .bind(id)
    .first();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.user_id !== session.user.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await db
    .prepare("SELECT * FROM saju_results WHERE order_id = ?")
    .bind(id)
    .first();

  if (!result) {
    return NextResponse.json({ error: "No result yet" }, { status: 404 });
  }

  return NextResponse.json({
    id: result.id,
    orderId: result.order_id,
    resultJson: JSON.parse(result.result_json as string),
    createdAt: result.created_at,
  });
}
