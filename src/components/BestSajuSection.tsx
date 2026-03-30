import ServiceCard from "./ServiceCard";
import type { LandingCard } from "@/lib/configLoader";

export default function BestSajuSection({ cards }: { cards: LandingCard[] }) {
  return (
    <div>
      <h2 className="mb-5 font-pretendard text-[20px] font-semibold text-[#111111] md:mb-7 md:text-[32px]">
        청월당 BEST 사주
      </h2>
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:gap-x-5 md:gap-y-10 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-10">
        {cards.map((card) => (
          <ServiceCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
