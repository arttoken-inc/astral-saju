import { NextResponse } from "next/server";
import { calculateManseryeok } from "@/lib/manseryeok";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const { name, gender, birthdate, birthtime, calendarType } = body;

    if (!name || !birthdate || !birthtime) {
      return NextResponse.json({ error: "name, birthdate, birthtime은 필수입니다" }, { status: 400 });
    }

    // 생년월일 형식 검증
    if (!/^\d{4}\.\d{2}\.\d{2}$/.test(birthdate)) {
      return NextResponse.json({ error: "birthdate 형식: YYYY.MM.DD" }, { status: 400 });
    }

    const result = calculateManseryeok({
      name,
      gender: gender ?? "남성",
      birthdate,
      birthtime,
      calendarType: (calendarType === "lunar" ? "lunar" : "solar") as "solar" | "lunar",
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[manseryeok API]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "만세력 계산 중 오류 발생" },
      { status: 500 },
    );
  }
}
