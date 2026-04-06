"use client";

import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import RecommendSection from "@/components/RecommendSection";
import PromoSection from "@/components/PromoSection";
import CategorySections from "@/components/CategorySections";
import SnackSection from "@/components/SnackSection";
import MagazineSection from "@/components/MagazineSection";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import type { LandingConfig } from "@/lib/configLoader";

export default function HomeClient({ config }: { config: LandingConfig }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[448px] pt-[104px]">
        <div className="mb-20">
          <HeroCarousel slides={config.carouselSlides} />
          <div className="mb-10 mt-6 border-b border-[#F1F1F1]" />
          <RecommendSection cards={config.recommendCards} />
          <div className="my-10 border-b border-[#F1F1F1]" />
          <PromoSection videoSrc={config.promoVideoSrc} />
          <div className="my-10 border-b border-[#F1F1F1]" />
          <CategorySections sections={config.categorySections} />
          <div className="my-10 border-b border-[#F1F1F1]" />
          <SnackSection cards={config.snackCards} />
          <div className="my-10 border-b border-[#F1F1F1]" />
          <MagazineSection
            celebrities={config.celebrities}
            dreamPosts={config.dreamPosts}
          />
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
