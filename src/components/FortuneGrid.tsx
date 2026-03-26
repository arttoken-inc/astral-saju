import { fortuneCards } from "@/data/landing";
import ServiceCard from "./ServiceCard";

export default function FortuneGrid() {
  return (
    <div>
      <h2 className="mb-5 font-pretendard text-[20px] font-semibold text-[#111111] md:mb-7 md:text-[32px]">
        어떤 운세가 궁금하세요?
      </h2>
      <div className="grid grid-cols-2 gap-x-2 gap-y-6 md:gap-x-5 md:gap-y-10 xl:grid-cols-4 xl:gap-x-5 xl:gap-y-10">
        {fortuneCards.map((card) => (
          <ServiceCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  );
}
