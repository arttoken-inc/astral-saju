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
import { carouselSlides } from "@/data/landing";

export default function Home() {
  const [isDarkBg, setIsDarkBg] = useState(false);

  return (
    <>
      <Header isDark={isDarkBg} />
      <main>
        <HeroCarousel
          onSlideChange={(index) => setIsDarkBg(carouselSlides[index].dark)}
        />
        <PromoSection />
        <div className="mx-0 mt-10 w-full px-5 md:mt-[3.75rem] md:px-10 xl:mx-auto xl:mt-20 xl:max-w-[82.5rem]">
          <BestSajuSection />
          <CtaBanner />
          <FortuneGrid />
        </div>
        <div className="my-10 h-0 w-full border-b border-[#F1F1F1] md:my-20" />
        <div className="mx-0 mb-28 w-full px-5 md:px-10 xl:mx-auto xl:max-w-[82.5rem]">
          <div className="flex flex-col gap-10 md:gap-[3.75rem] xl:flex-row xl:gap-5">
            <DreamBox />
            <CelebrityBox />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
