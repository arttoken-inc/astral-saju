"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { cdnUrl } from "@/lib/cdn";
import type { CarouselSlide } from "@/data/landing";

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      swiperRef?.slideToLoop(index);
    },
    [swiperRef]
  );

  return (
    <div className="w-full pt-6">
      <div className="mx-2">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
          speed={500}
          loop
          loopAdditionalSlides={2}
          slidesPerView={1}
          spaceBetween={0}
          onSwiper={setSwiperRef}
          onSlideChange={handleSlideChange}
          className="hero-carousel w-full overflow-hidden rounded-2xl"
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={slide.slug}>
              <a className="relative block w-full" href={slide.href}>
                <img
                  className="aspect-[224/280] w-full rounded-2xl object-cover"
                  alt={`${slide.alt} 배너`}
                  src={cdnUrl(slide.banner)}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                />
                <img
                  className="absolute right-3 top-0 h-[46px] w-9"
                  alt="랭킹 뱃지"
                  src={cdnUrl(slide.rankBadge)}
                  loading="lazy"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 도트 인디케이터 — 캐러셀 아래 */}
      <div className="mt-4 flex items-center justify-center gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`${i + 1}번째 배너로 이동`}
            className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
              activeIndex === i ? "bg-[#111111]" : "bg-[#D9D9D9]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
