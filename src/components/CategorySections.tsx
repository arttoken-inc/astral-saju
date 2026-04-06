"use client";

import { cdnUrl } from "@/lib/cdn";
import type { CategorySection } from "@/data/landing";

function CategoryRow({ section }: { section: CategorySection }) {
  const showViewAll = section.heading.includes("뭘 좋아하실지");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-5">
        <h3 className="font-pretendard text-[16px] font-normal leading-6 text-gray-800">
          {section.emoji} {section.heading}
        </h3>
        {showViewAll && (
          <a
            href="/category/others"
            className="flex items-center gap-1 font-pretendard text-[13px] text-[#757575]"
          >
            전체보기
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L1 9" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        )}
      </div>
      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5">
        {section.cards.map((card) => (
          <a
            key={card.href + card.title}
            className="block w-[141px] flex-shrink-0"
            href={card.href}
          >
            <img
              className="h-[176px] w-[141px] rounded-lg object-cover"
              alt={card.title}
              src={cdnUrl(card.img)}
              loading="lazy"
            />
            <h5 className="truncate font-pretendard text-[16px] font-semibold leading-6 text-[#111111]">
              {card.title}
            </h5>
            <p className="truncate font-pretendard text-[14px] font-medium leading-[1.3] text-[#757575]">
              {card.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function CategorySections({ sections }: { sections: CategorySection[] }) {
  return (
    <div className="flex flex-col gap-12">
      {sections.map((section, i) => (
        <CategoryRow key={i} section={section} />
      ))}
    </div>
  );
}
