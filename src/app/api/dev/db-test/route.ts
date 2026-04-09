import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

// DEV ONLY: Test D1 database end-to-end (create user, order, result, then read back)
export async function POST() {
  const db = await getDB();
  const testEmail = "test@e2e.dev";
  const orderId = `test_${Date.now()}`;

  // 1. Upsert user
  await db
    .prepare(
      `INSERT INTO users (id, email, name, provider)
       VALUES (?, ?, ?, 'google')
       ON CONFLICT(email) DO UPDATE SET name = excluded.name`
    )
    .bind(testEmail, testEmail, "E2E테스트")
    .run();

  // 2. Create order
  await db
    .prepare(
      `INSERT INTO orders (id, user_id, service_id, service_name, name, birthdate, birthtime, gender, question, question_count)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      orderId,
      testEmail,
      "bluemoonladysaju",
      "청월아씨 정통사주",
      "테스트",
      "1995.03.15",
      "oh",
      "남성",
      "올해 재물운이 궁금합니다",
      1
    )
    .run();

  // 3. Save saju result
  const mockResult = { personality: "테스트 성격 분석 결과", wealth: "재물운 좋음" };
  await db
    .prepare(
      `INSERT INTO saju_results (id, order_id, result_json)
       VALUES (?, ?, ?)`
    )
    .bind(`result_${orderId}`, orderId, JSON.stringify(mockResult))
    .run();

  // 4. Mark as paid
  await db
    .prepare("UPDATE orders SET paid = 1, paid_at = datetime('now') WHERE id = ?")
    .bind(orderId)
    .run();

  // 5. Read back everything
  const user = await db.prepare("SELECT * FROM users WHERE email = ?").bind(testEmail).first();
  const order = await db.prepare("SELECT * FROM orders WHERE id = ?").bind(orderId).first();
  const result = await db.prepare("SELECT * FROM saju_results WHERE order_id = ?").bind(orderId).first();
  const allOrders = await db
    .prepare("SELECT o.*, sr.result_json FROM orders o LEFT JOIN saju_results sr ON sr.order_id = o.id WHERE o.user_id = ? ORDER BY o.created_at DESC")
    .bind(testEmail)
    .all();

  return NextResponse.json({
    success: true,
    test: {
      user,
      order,
      result: result ? { ...result, result_json: JSON.parse(result.result_json as string) } : null,
      allOrders: allOrders.results,
    },
  });
}

// GET: read all test data
export async function GET() {
  const db = await getDB();
  const users = await db.prepare("SELECT * FROM users").all();
  const orders = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  const results = await db.prepare("SELECT * FROM saju_results").all();

  return NextResponse.json({
    users: users.results,
    orders: orders.results,
    results: results.results.map((r) => ({
      ...r,
      result_json: JSON.parse(r.result_json as string),
    })),
  });
}

// DELETE: cleanup test data
export async function DELETE() {
  const db = await getDB();
  await db.prepare("DELETE FROM saju_results WHERE order_id LIKE 'test_%'").run();
  await db.prepare("DELETE FROM orders WHERE id LIKE 'test_%'").run();
  await db.prepare("DELETE FROM users WHERE email = 'test@e2e.dev'").run();

  return NextResponse.json({ success: true, message: "Test data cleaned up" });
}
