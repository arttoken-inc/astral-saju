"use client";

import { cdnUrl } from "@/lib/cdn";
import type { RecommendCard } from "@/data/landing";

export default function RecommendSection({ cards }: { cards: RecommendCard[] }) {
  return (
    <section>
      <h2 className="mb-2 ml-6 font-pretendard text-[20px] font-bold leading-[26px] tracking-tight text-[#111111]">
        ✨ 어라, 이거 내 얘긴데..?!
      </h2>
      <div className="mb-4 ml-5 inline-block rounded bg-[#F3F5F8] p-2">
        <span className="font-pretendard text-[12px] font-bold text-[#2D4A71]">
          💡 로그인 후 맞춤형 추천을 받아보세요!
        </span>
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto pl-5">
        {cards.map((card) => (
          <a
            key={card.href}
            className="block w-[238px] flex-shrink-0"
            href={card.href}
          >
            <img
              className="h-[298px] w-[238px] rounded-xl border border-[#E1E1E1] object-cover"
              alt={card.title}
              src={cdnUrl(card.img)}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
