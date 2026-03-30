"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import PromoSection from "@/components/PromoSection";
import BestSajuSection from "@/components/BestSajuSection";
import CtaBanner from "@/components/CtaBanner";
import FortuneGrid from "@/components/FortuneGrid";
import DreamBox from "@/components/DreamBox";
import CelebrityBox from "@/components/CelebrityBox";
import Footer from "@/components/Footer";
import type { LandingConfig } from "@/lib/configLoader";

export default function HomeClient({ config }: { config: LandingConfig }) {
  const [isDarkBg, setIsDarkBg] = useState(false);

  return (
    <>
      <Header isDark={isDarkBg} />
      <main>
        <HeroCarousel
          slides={config.carouselSlides}
          onSlideChange={(index) => setIsDarkBg(config.carouselSlides[index].dark)}
        />
        <PromoSection videoSrc={config.assets.promoVideoSrc} />
        <div className="mx-0 mt-10 w-full px-5 md:mt-[3.75rem] md:px-10 xl:mx-auto xl:mt-20 xl:max-w-[82.5rem]">
          <BestSajuSection cards={config.bestCards} />
          <CtaBanner replayMobileImg={config.assets.replayMobileImg} replayPcImg={config.assets.replayPcImg} />
          <FortuneGrid cards={config.fortuneCards} />
        </div>
        <div className="my-10 h-0 w-full border-b border-[#F1F1F1] md:my-20" />
        <div className="mx-0 mb-28 w-full px-5 md:px-10 xl:mx-auto xl:max-w-[82.5rem]">
          <div className="flex flex-col gap-10 md:gap-[3.75rem] xl:flex-row xl:gap-5">
            <DreamBox posts={config.dreamPosts} />
            <CelebrityBox celebrities={config.celebrities} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
