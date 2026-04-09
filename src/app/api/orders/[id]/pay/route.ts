import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDB } from "@/lib/db";

// PATCH /api/orders/[id]/pay — mark order as paid
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDB();

  // Verify the order belongs to this user
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

  await db
    .prepare("UPDATE orders SET paid = 1, paid_at = datetime('now') WHERE id = ?")
    .bind(id)
    .run();

  return NextResponse.json({ success: true });
}
