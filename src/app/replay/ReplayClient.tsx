"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

interface SavedResult {
  id: string;
  serviceId: string;
  serviceName: string;
  name: string;
  birthdate: string;
  birthtime: string;
  gender: string;
  createdAt: string;
  questionCount: number;
  paid?: boolean;
  paidAt?: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

const TIME_LABELS: Record<string, string> = {
  unknown: "시간모름", joja: "조자시생", chuk: "축시생", in: "인시생",
  myo: "묘시생", jin: "진시생", sa: "사시생", oh: "오시생",
  mi: "미시생", shin: "신시생", yu: "유시생", sul: "술시생",
  hae: "해시생", yaja: "야자시생",
};

const GENDER_LABELS: Record<string, string> = {
  male: "남성", female: "여성",
};

function formatBirth(birthdate: string, birthtime: string, gender: string) {
  const parts = birthdate.replace(/-/g, ".").replace(/^20|^19/, (m) => m.slice(2));
  const timeLabel = TIME_LABELS[birthtime] || `${birthtime}시생`;
  const genderLabel = GENDER_LABELS[gender] || gender;
  return `[${parts} ${timeLabel} · ${genderLabel}]`;
}

const ORIG_CDN = "https://cdn.aifortunedoctor.com";

function ServiceBanner({
  href,
  imgSrc,
  alt,
  subtext,
}: {
  href: string;
  imgSrc: string;
  alt: string;
  subtext: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative mb-8">
        <Link href={href} className="block">
          <img
            src={imgSrc}
            alt={alt}
            className="w-full overflow-hidden rounded-[0.625rem] border border-[#E1E1E1]"
            loading="lazy"
          />
        </Link>
        {/* 말풍선 서브텍스트 */}
        <div className="absolute bottom-0 left-[6%]" style={{ transform: "translateY(59.9%)" }}>
          <div className="relative w-fit rounded-[0.625rem] bg-white px-3 py-2 font-pretendard text-xs font-bold text-[#111] shadow-md [&>div]:font-normal [&>strong]:font-bold">
            <svg width="6" height="9" viewBox="0 0 6 9" fill="none" className="absolute left-4 -top-1.5">
              <path d="M0 9L3 0L6 9Z" fill="white" />
            </svg>
            <div>{subtext}</div>
          </div>
        </div>
      </div>
      <div className="flex h-12 items-center justify-center rounded-[0.625rem] border border-dashed border-[#E1E1E1] text-sm font-semibold text-[#AEAEAE]">
        아직 풀이가 없어요
      </div>
    </div>
  );
}

export default function ReplayClient({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [results, setResults] = useState<SavedResult[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    // Try fetching from DB first, fall back to localStorage
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = (await res.json()) as { orders: Array<{
            id: string; service_id: string; service_name: string;
            name: string; birthdate: string; birthtime: string;
            gender: string; question_count: number; paid: number;
            paid_at: string | null; created_at: string;
          }> };
          if (data.orders.length > 0) {
            setResults(data.orders.map((o) => ({
              id: o.id,
              serviceId: o.service_id,
              serviceName: o.service_name,
              name: o.name,
              birthdate: o.birthdate,
              birthtime: o.birthtime,
              gender: o.gender,
              createdAt: o.created_at,
              questionCount: o.question_count,
              paid: !!o.paid,
              paidAt: o.paid_at || undefined,
            })));
            return;
          }
        }
      } catch { /* API not available, use localStorage */ }

      try {
        const saved = localStorage.getItem("saju_results");
        if (saved) setResults(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    loadOrders();
  }, []);

  const bluemoonResults = results.filter(
    (r) => r.serviceId === "bluemoonladysaju" && r.paid
  );
  const hasPaidResults = bluemoonResults.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[3.75rem] max-w-md items-center justify-between bg-white px-4">
        <Link href="/">
          <Image
            src="/logos/logo_with_black_typo.png"
            alt="logo"
            width={120}
            height={28}
            className="h-7 w-auto"
            priority
          />
        </Link>
        <Link href="/mypage" aria-label="마이페이지로 이동">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 14C16.2091 14 18 12.2091 18 10C18 7.79086 16.2091 6 14 6C11.7909 6 10 7.79086 10 10C10 12.2091 11.7909 14 14 14Z" stroke="#111" strokeWidth="1.5" />
            <path d="M20 21C20 18.2386 17.3137 16 14 16C10.6863 16 8 18.2386 8 21" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </Link>
      </header>

      <main className="mx-auto max-w-md pb-24 pt-[3.75rem]">
        {/* 내 운세 다시 보기 */}
        <section className="px-5 pt-6">
          <h2 className="font-pretendard text-[1.375rem] font-bold leading-tight text-[#111]">
            내 운세 다시 보기
          </h2>

          {hasPaidResults ? (
            <>
              {/* 구매 이력 있음: 힌트 + 재생 카드 */}
              <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#F5F5F5] px-3 py-1.5 font-pretendard text-xs font-medium text-[#424242]">
                <span>✨</span>
                <span>궁금한 점을 추가로 질문해보세요</span>
              </p>

              <div className="relative mt-4">
                <button
                  onClick={() => setSheetOpen(true)}
                  className="relative block overflow-hidden rounded-2xl"
                  aria-label="bluemoonladysaju 주문 목록 시트 열기"
                >
                  <img
                    src={`${ORIG_CDN}/uploads/admin/live/banner/home-main/20260403/0778d096-8231-4c06-9e89-77280b0afb84.png`}
                    alt="상품 카드 이미지"
                    className="h-auto w-[200px] rounded-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                        <path d="M4 2L14 8L4 14V2Z" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* 구매 이력 없음: "앗, 아직 사주결과가 없어요!" */
            <img
              src={`${ORIG_CDN}/web/live/current/images/replay/no-signature-orders.png`}
              alt="주문 내역 없음"
              className="mt-4 w-full"
            />
          )}
        </section>

        {/* 구분선 - 구매 있을 때만 */}
        {hasPaidResults && (
          <div className="mx-5 mt-6 border-b border-[#E8E8E8]" />
        )}

        {/* 환영 메시지 */}
        <div className={hasPaidResults ? "mt-6 px-5" : "mt-8 px-5"}>
          <h3 className="text-center font-pretendard text-lg font-bold text-[#111]">
            {hasPaidResults
              ? `${userName} (${userEmail?.split("@")[0] ?? ""})님을 기다리고 있어요 😊`
              : `${userName}님을 기다리고 있어요 😊`
            }
          </h3>
        </div>

        {/* 서비스 배너들 */}
        <div className="mt-6 space-y-4 px-5">
          {/* 청월아씨 정통사주 - 구매 없을 때만 배너로 표시 */}
          {!hasPaidResults && (
            <ServiceBanner
              href="/s/bluemoonladysaju"
              imgSrc={`${ORIG_CDN}/uploads/admin/live/banner/horizontal-default/20260324/432cf25c-d642-47ee-97a5-11ff47e0e5a2.png`}
              alt="청월아씨 정통사주-banner"
              subtext="나만을 위해 그려주는 사주웹툰"
            />
          )}

          {/* 월하소녀 올해의 운세 */}
          <ServiceBanner
            href="/s/newyearmoongirl"
            imgSrc={`${ORIG_CDN}/uploads/admin/live/banner/horizontal-default/20260403/140b5d79-6c5c-4b7f-b9e1-c07574403694.png`}
            alt="2026년 월하소녀 올해의운세-banner"
            subtext={<><strong>2026년,</strong> 내 운의 방향이 바뀌는지 보러가기</>}
          />

          {/* 홍연아씨 연애비책 */}
          <ServiceBanner
            href="/s/redlove"
            imgSrc={`${ORIG_CDN}/uploads/admin/live/banner/horizontal-default/20260324/530ca6a3-4a1c-4857-aaba-a1cf849c5e50.png`}
            alt="홍연아씨 연애비책-banner"
            subtext={<>솔로라면 <strong>무조건 37% 할인</strong></>}
          />

          {/* 홍연아씨 사주궁합 */}
          <ServiceBanner
            href="/s/redlotuslady"
            imgSrc={`${ORIG_CDN}/uploads/admin/live/banner/horizontal-default/20260324/6a403734-b3fd-48c8-a0d1-7ae488fb556c.png`}
            alt="홍연아씨 사주궁합-banner"
            subtext={<><strong>2인 사주 + 궁합점수 무료 확인!</strong></>}
          />
        </div>
      </main>

      {/* 하단 바텀시트 - 구매 이력 있을 때만 */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <button
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
            aria-label="sheet backdrop"
          />
          <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-white pb-8 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D9D9D9]" />
            <h3 className="px-5 font-pretendard text-base font-bold text-[#111]">
              청월아씨 정통사주
            </h3>
            <ul className="mt-4 space-y-3 px-5">
              {bluemoonResults.map((r) => (
                <li key={r.id} className="rounded-2xl border border-[#E8E8E8] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-pretendard">
                        <span className="text-base font-bold text-[#111]">{r.name}</span>{" "}
                        <span className="text-sm text-[#666]">
                          {formatBirth(r.birthdate, r.birthtime, r.gender)}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 font-pretendard text-xs text-[#999]">
                        <span>구매일 <span className="text-[#666]">{formatDate(r.paidAt || r.createdAt)}</span></span>
                        <span>추가질문 <span className="text-[#666]">{r.questionCount}개</span></span>
                      </div>
                    </div>
                    <button className="p-1 text-[#999]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="10" cy="4" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="10" cy="16" r="1.5" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="h-10 flex-1 rounded-lg border border-[#E8E8E8] font-pretendard text-sm font-medium text-[#424242]">
                      추가 질문하기
                    </button>
                    <Link
                      href={`/s/bluemoonladysaju/ai/${r.id}`}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#E8E8E8] font-pretendard text-sm font-medium text-[#424242]"
                    >
                      다시보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="mx-auto max-w-md bg-[#F7F9FA] px-4 py-10">
        <div className="flex flex-col items-center">
          <Image src="/logos/logo_with_black_typo.png" alt="logo" width={100} height={20} className="mb-4 h-5 w-auto" />
          <div className="text-center font-pretendard text-[0.625rem] leading-relaxed text-[#A1A1A1]">
            <p><strong>상호</strong> 로켓AI | <strong>대표이사</strong> 임재훈</p>
            <p>광교중앙로 338 광교우미뉴브 지식산업센터 A-704</p>
            <p className="mt-2"><strong>통신판매업 신고</strong> 2022-용인수지-1749</p>
            <p><strong>사업자등록번호</strong> 680-02-02623</p>
          </div>
          <div className="mt-4 font-pretendard text-[0.625rem] text-[#A1A1A1]">
            <strong>고객상담</strong>{" "}
            <a href="http://pf.kakao.com/_xaEHxbG/chat" className="underline">카카오톡 청월당 채널</a>
            {" | "}<strong>MAIL</strong> contact@rocketai.kr
          </div>
          <div className="mt-4 flex gap-3 font-pretendard text-xs text-[#757575]">
            <Link href="/policy/service" className="underline">이용약관</Link>
            <Link href="/policy/privacy" className="underline">개인정보처리방침</Link>
          </div>
          <p className="mt-2 font-pretendard text-xs text-[#757575]">Copyright &copy; 2024 RocketAI - All right reserved</p>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
