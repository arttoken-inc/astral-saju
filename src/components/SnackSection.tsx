"use client";

import { cdnUrl } from "@/lib/cdn";
import type { SnackCard } from "@/data/landing";
import HScrollRow from "./HScrollRow";

export default function SnackSection({ cards }: { cards: SnackCard[] }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-5">
        <h3 className="font-pretendard text-[16px] font-normal leading-6 text-gray-800">
          🍿 심심할 때는? 5분 순삭 스낵사주
        </h3>
        <a
          href="/category/others"
          className="flex items-center gap-1 font-pretendard text-[13px] text-[#757575]"
        >
          전체보기
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L1 9" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <HScrollRow className="grid auto-cols-[288px] grid-flow-col grid-rows-3 gap-3 pr-5">
        {cards.map((card, i) => (
          <article key={card.href} className="h-16">
            <a className="flex h-full items-center" href={card.href}>
              <span className="w-7 flex-shrink-0 font-pretendard text-[16px] font-semibold text-[#111111]">
                {i + 1}
              </span>
              <img
                className="h-16 w-[100px] flex-shrink-0 rounded object-cover"
                alt={card.title}
                src={cdnUrl(card.img)}
                loading="lazy"
              />
              <div className="ml-3 min-w-0 flex-1">
                <h5 className="truncate font-pretendard text-[16px] font-semibold text-[#111111]">
                  {card.title}
                </h5>
                <p className="truncate font-pretendard text-[12px] text-[#424242]">
                  {card.desc}
                </p>
              </div>
            </a>
          </article>
        ))}
      </HScrollRow>
    </section>
  );
}
