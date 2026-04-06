"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Image from "next/image";

const CDN = "https://cdn.aifortunedoctor.com";

const hours = [
  "모름",
  "子時 (23:30~01:29)",
  "丑時 (01:30~03:29)",
  "寅時 (03:30~05:29)",
  "卯時 (05:30~07:29)",
  "辰時 (07:30~09:29)",
  "巳時 (09:30~11:29)",
  "午時 (11:30~13:29)",
  "未時 (13:30~15:29)",
  "申時 (15:30~17:29)",
  "酉時 (17:30~19:29)",
  "戌時 (19:30~21:29)",
  "亥時 (21:30~23:29)",
];

const faqs = [
  {
    q: "Q. 양력만 입력이 가능한가요?",
    a: "A. 사주팔자는 음력으로 보나, 양력으로 보나 동일합니다. 음력으로 입력 시에는, 양력으로 변환하여 사주팔자를 해석합니다.",
  },
  {
    q: "Q. 사주팔자란 무엇인가요?",
    a: "A. 한 사람의 길흉화복을 점치기 위해 생년월일, 태어난 시간을 기준으로 한 네가지 기둥과 여덟가지 글자를 말합니다. 운세박사에서는 태어난 사주 정보(년,월,일,시)를 바탕으로 만세력에 기반하여 풀이를 제공합니다.",
  },
  {
    q: "Q. 태어난 시간이 꼭 필요한가요?",
    a: "A. 필요합니다. 태어난 시간을 알면 더욱 자세한 운세를 알 수 있습니다. 물론 태어난 시간을 '모름'으로 처리하여 대략적 풀이결과를 제공할 수 있으나, 왠만하면 꼭 입력을 해주시길 부탁드립니다.",
  },
];

const recommendCards = [
  {
    href: "/s/redlove",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/3e336630-3a45-4f3d-955d-b1bf2914cfd7.png`,
  },
  {
    href: "/b/loveagain",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/13fb4d7e-36d5-42e1-bfda-1281ba47e2d2.png`,
  },
  {
    href: "/s/redlotuslady",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/61bc0239-08c8-4f50-b36d-ca72bb513aa3.png`,
  },
  {
    href: "/s/newyearmoongirl/2026",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/3667a2e5-5f70-45a9-94fb-fce39024a7a4.png`,
  },
  {
    href: "/b/career",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/9f2132cc-2362-432e-86be-39bf84c283a5.png`,
  },
  {
    href: "/b/money",
    img: `${CDN}/uploads/admin/live/banner/home-main/20260403/28f76aa9-52c7-457e-88e7-00122ae882d5.png`,
  },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

const selectClass =
  "mt-2 h-12 w-full appearance-none rounded-lg border border-gray-800/20 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_16px_center] bg-no-repeat pl-4 pr-10 text-sm outline-none";

export default function TodayPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[448px] items-center justify-between px-5">
          <a className="flex h-6 items-center gap-2" href="/">
            <Image
              src="/logos/logo_with_black_typo.png"
              alt="logo"
              width={83}
              height={24}
              className="h-6 w-auto"
              priority
            />
          </a>
          <a
            className="flex h-7 w-7 items-center justify-center"
            aria-label="마이페이지로 이동"
            href="/mypage"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[448px] pt-[60px]">
        {/* Dark bg — negative margin creates overlap with hero card */}
        <div className="-mb-[240px] h-64 bg-gray-800" />

        {/* Hero banner card */}
        <div className="relative mx-4 mt-2 overflow-hidden rounded-t-2xl bg-gray-100 px-4 pb-6 pt-4">
          <p className="font-[SSRockRegular,sans-serif] text-[30px] font-normal text-amber-950">
            오늘의 운세
          </p>
          <p className="mt-2 text-sm text-amber-950">
            대통의 제왕들도 매일 보았던
            <br />
            명리학에 기반한 오늘의 운세
          </p>
          {/* Hero decorations */}
          <img
            className="absolute bottom-0 right-0 block w-28"
            alt=""
            src="https://cheongwoldang.com/banners/saju_bb_m.png"
          />
          <img
            className="absolute bottom-6 right-4 w-20"
            alt=""
            src="https://cheongwoldang.com/images/asian_planc/today_main.png"
          />
        </div>

        {/* Form card */}
        <div className="mx-4 rounded-b-2xl border-b border-l border-r bg-white px-4 shadow-lg">
          <div className="py-9">
            {/* Gender */}
            <div>
              <p className="text-sm font-bold">성별</p>
              <select className={selectClass}>
                <option>선택</option>
                <option>남자</option>
                <option>여자</option>
              </select>
            </div>

            {/* Birth date */}
            <div>
              <p className="mt-7 text-sm font-bold">생년월일</p>
              <select className={selectClass}>
                <option>양력</option>
                <option>음력</option>
              </select>
              <select className={selectClass}>
                <option>출생년</option>
                {years.map((y) => (
                  <option key={y}>{y}년</option>
                ))}
              </select>
              <select className={`${selectClass} !mt-3`}>
                <option>출생월</option>
                {months.map((m) => (
                  <option key={m}>{m}월</option>
                ))}
              </select>
              <select className={`${selectClass} !mt-3`}>
                <option>출생일</option>
                {days.map((d) => (
                  <option key={d}>{d}일</option>
                ))}
              </select>
            </div>

            {/* Birth time */}
            <div>
              <p className="mt-7 text-sm font-bold">
                태어난 시간 - 입력해야 정확해요!
              </p>
              <select className={selectClass}>
                {hours.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* CTA */}
            <div className="mt-14">
              <button className="w-full cursor-pointer rounded-lg bg-orange-800 p-3 text-base font-bold text-white">
                무료로 운세 보기
              </button>
            </div>
          </div>
        </div>

        {/* Info & FAQ section */}
        <div className="mx-5 pb-14">
          {/* 오늘의 운세 소개 */}
          <div className="mt-10 border-b border-gray-300 pb-7">
            <p className="text-lg font-bold">오늘의 운세 소개</p>
            <p className="mt-3 text-base leading-relaxed">
              운명이라는 단어는 운(運)과 명(命)으로 구성됩니다. 이 중 명(命)은
              타고난 사주팔자를 의미합니다. 우리의 타고난 사주팔자는 바꿀 수
              없지만,{" "}
              <span className="bg-yellow-200 font-bold">
                시간이 지남에 따라 우리의 운(運)
              </span>
              은 변해갑니다.
            </p>
            <p className="mt-3 text-base leading-relaxed">
              옛날 대륙의 패권을 놓고 각축을 벌이던 제후들은 전쟁을 치르기 전에
              역경(易經)에 능통한 신관(神官)으로부터 점을 점(占)하고{" "}
              <span className="bg-yellow-200 font-bold">중대사를 실행</span>에
              옮겼던 것입니다. 좋은 운세를 얻었을 때 비로소 전쟁과 같은 국가
              중대사를 실행에 옮겼던 것입니다.
            </p>
            <p className="mt-3 text-base leading-relaxed">
              과거 대륙의 패권자들의 행했던 의사결정 방법처럼, 아무하루 중요한
              문제에 직면하는 현대인들에게{" "}
              <span className="bg-yellow-200 font-bold">
                인공지능 운세박사가 선택의 지혜를 제시
              </span>
              합니다.
            </p>
          </div>

          {/* FAQ */}
          <div className="mt-8 border-b">
            <p className="mb-3 text-lg font-bold">자주 묻는 질문</p>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-[#F2F2F2] ${i === 0 ? "border-y" : ""}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between p-4 pr-12 text-left text-base"
                >
                  {faq.q}
                  <svg
                    className={`h-4 w-4 flex-shrink-0 transition ${openFaq === i ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 다른 운세 확인하기 */}
        <div className="border-b border-t border-slate-200 bg-slate-50 py-6">
          <h3 className="mb-4 px-5 font-pretendard text-lg font-bold leading-tight text-[#111]">
            다른 운세 확인하기
          </h3>
          <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5">
            {recommendCards.map((card) => (
              <a
                key={card.href}
                className="block w-[141px] flex-shrink-0"
                href={card.href}
              >
                <img
                  className="h-[176px] w-[141px] rounded-lg border border-[#E1E1E1] object-cover"
                  alt=""
                  src={card.img}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </div>

        <Footer />
        <div className="h-20" />
      </main>
      <BottomNav />
    </>
  );
}
