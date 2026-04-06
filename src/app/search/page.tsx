"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import Image from "next/image";

const popularTags = [
  "정통사주",
  "신년운세",
  "월하소녀",
  "커리어",
  "오늘의 운세",
  "관상",
  "청월아씨",
  "홍연아씨",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white">
        <div className="mx-auto flex h-[60px] max-w-[448px] items-center justify-between px-5">
          <a className="flex h-6 items-center gap-2" href="/">
            <Image src="/logos/logo_with_black_typo.png" alt="logo" width={83} height={24} className="h-6 w-auto" priority />
          </a>
          <a className="flex h-7 w-7 items-center justify-center" aria-label="마이페이지로 이동" href="/mypage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-[448px] pt-[60px]">
        <div className="flex min-h-[calc(100dvh-140px)] flex-col">
          {/* Search bar */}
          <div className="px-4 pt-4">
            <div className="flex h-[52px] w-full items-center gap-2 rounded-[10px] border border-[#F1F1F1] bg-white p-3">
              <input
                type="text"
                placeholder="보고싶은 운세를 검색해주세요."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent font-pretendard text-[16px] text-[#111] outline-none placeholder:text-[#999]"
              />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 20L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Empty state */}
          <div className="py-4">
            <p className="py-8 text-center font-pretendard text-[14px] text-[#757575]">
              최근 검색 내역이 없습니다.
            </p>
          </div>

          {/* Divider */}
          <div className="border-b border-[#F1F1F1]" />

          {/* Popular tags */}
          <div className="px-5 pt-6">
            <h2 className="mb-4 font-pretendard text-[16px] font-semibold text-[#111]">
              인기 검색어
            </h2>
            <div className="flex flex-wrap gap-x-1 gap-y-4">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className="cursor-pointer rounded-full border border-[#E1E1E1] bg-white px-4 py-1.5 font-pretendard text-[14px] text-[#111]"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom nav spacer */}
        <div className="h-20" />
      </main>
      <BottomNav />
    </>
  );
}
