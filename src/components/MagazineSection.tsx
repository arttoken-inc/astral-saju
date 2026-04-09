"use client";

import { useState } from "react";
import { cdnUrl } from "@/lib/cdn";
import type { CelebrityPost, DreamPost } from "@/data/landing";
import HScrollRow from "./HScrollRow";

interface Props {
  celebrities: CelebrityPost[];
  dreamPosts: DreamPost[];
}

export default function MagazineSection({ celebrities, dreamPosts }: Props) {
  const [tab, setTab] = useState<"celebrity" | "dream">("celebrity");

  return (
    <section className="px-5">
      <h3 className="mb-3 px-0 font-pretendard text-[20px] font-bold text-[#111111]">
        사주 매거진
      </h3>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("celebrity")}
            className={`cursor-pointer rounded-full px-3 py-2 font-pretendard text-[14px] transition ${
              tab === "celebrity"
                ? "bg-[#111111] text-white"
                : "border border-[#E1E1E1] bg-transparent text-[#111111]"
            }`}
          >
            유명인 사주
          </button>
          <button
            onClick={() => setTab("dream")}
            className={`cursor-pointer rounded-full px-3 py-2 font-pretendard text-[14px] transition ${
              tab === "dream"
                ? "bg-[#111111] text-white"
                : "border border-[#E1E1E1] bg-transparent text-[#111111]"
            }`}
          >
            꿈해몽
          </button>
        </div>
        <a
          href={tab === "celebrity" ? "/magazine/celebrity" : "/dream"}
          className="flex items-center gap-1 font-pretendard text-[13px] text-[#757575]"
        >
          전체보기
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L1 9" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {tab === "celebrity" ? (
        <HScrollRow className="gap-3">
          {celebrities.map((celeb, i) => (
            <article key={celeb.href} className="w-[220px] flex-shrink-0">
              <a className="block" href={celeb.href}>
                <div className="relative mb-1">
                  <img
                    className="h-[156px] w-[220px] rounded-lg object-cover"
                    alt={`${celeb.name} 사주팔자`}
                    src={cdnUrl(celeb.img)}
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-3 font-pretendard text-[44px] font-bold leading-none text-white drop-shadow-lg">
                    {i + 1}
                  </span>
                </div>
                <h5 className="font-pretendard text-[16px] font-semibold text-[#111111]">
                  {celeb.name} 사주팔자
                </h5>
                <p className="line-clamp-2 font-pretendard text-[16px] text-gray-800">
                  {celeb.desc}
                </p>
              </a>
            </article>
          ))}
        </HScrollRow>
      ) : (
        <HScrollRow className="gap-3">
          {dreamPosts.map((post, i) => (
            <article key={post.href} className="w-[220px] flex-shrink-0">
              <a className="block rounded-lg border border-[#E1E1E1] p-4" href={post.href}>
                <span className="mb-2 inline-block font-pretendard text-[12px] font-bold text-[#757575]">
                  {i + 1}
                </span>
                <h5 className="mb-2 line-clamp-2 font-pretendard text-[14px] font-semibold text-[#111111]">
                  {post.title}
                </h5>
                <p className="line-clamp-2 font-pretendard text-[12px] text-[#757575]">
                  {post.body}
                </p>
              </a>
            </article>
          ))}
        </HScrollRow>
      )}
    </section>
  );
}
