"use client";

import { useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { cdnUrl } from "@/lib/cdn";
import type { LandingCarouselSlide } from "@/lib/configLoader";

function carouselBg(slug: string, device: "pc" | "tablet" | "mobile") {
  return cdnUrl(`main/carousel/${slug}/bg-${device}.png`);
}

function carouselText(slug: string, device: "pc" | "tablet" | "mobile") {
  return cdnUrl(`main/carousel/${slug}/text-${device}.png`);
}

function shouldLoad(slideIndex: number, activeIndex: number, total: number) {
  if (total <= 2) return true;
  const diff = Math.abs(slideIndex - activeIndex);
  // loop 모드이므로 양끝 wrap-around도 고려
  return diff <= 1 || diff >= total - 1;
}

interface HeroCarouselProps {
  slides: LandingCarouselSlide[];
  onSlideChange?: (index: number) => void;
}

export default function HeroCarousel({ slides, onSlideChange }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    onSlideChange?.(swiper.realIndex);
  }, [onSlideChange]);

  const toggleAutoplay = useCallback(() => {
    if (!swiperRef) return;
    if (isPlaying) {
      swiperRef.autoplay.stop();
    } else {
      swiperRef.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  }, [swiperRef, isPlaying]);

  const goToSlide = useCallback(
    (index: number) => {
      swiperRef?.slideToLoop(index);
    },
    [swiperRef]
  );

  return (
    <div className="relative min-h-[31.25rem] w-full md:min-h-[52rem] xl:min-h-[38.75rem]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        speed={300}
        loop
        slidesPerView={1}
        spaceBetween={0}
        onSwiper={setSwiperRef}
        onSlideChange={handleSlideChange}
        className="hero-carousel h-full w-full"
      >
        {slides.map((slide, i) => {
          const load = shouldLoad(i, activeIndex, slides.length);
          const isFirst = i === 0;
          return (
            <SwiperSlide key={slide.slug}>
              <a className="block w-full" href={slide.href}>
                <div className="relative w-full">
                  {/* 배경 이미지 — <picture>로 디바이스별 단일 다운로드 */}
                  <picture>
                    <source
                      media="(min-width: 1280px)"
                      srcSet={load ? carouselBg(slide.slug, "pc") : undefined}
                    />
                    <source
                      media="(min-width: 768px)"
                      srcSet={load ? carouselBg(slide.slug, "tablet") : undefined}
                    />
                    <img
                      className="h-[31.25rem] w-full object-cover object-center md:h-[52rem] xl:h-[38.75rem]"
                      alt={`${slide.alt} 배너 배경`}
                      src={load ? carouselBg(slide.slug, "mobile") : undefined}
                      loading={isFirst ? "eager" : "lazy"}
                      fetchPriority={isFirst ? "high" : undefined}
                    />
                  </picture>
                  {/* 텍스트 오버레이 — <picture>로 디바이스별 단일 다운로드 */}
                  <div className="absolute inset-0 mx-auto h-full w-full max-w-[80rem]">
                    <picture>
                      <source
                        media="(min-width: 1280px)"
                        srcSet={load ? carouselText(slide.slug, "pc") : undefined}
                      />
                      <source
                        media="(min-width: 768px)"
                        srcSet={load ? carouselText(slide.slug, "tablet") : undefined}
                      />
                      <img
                        className="absolute bottom-12 left-1/2 top-1/2 z-10 max-w-[23.4375rem] -translate-x-1/2 -translate-y-1/2 md:max-w-[48rem] xl:max-w-none"
                        alt={`${slide.alt} 텍스트`}
                        src={load ? carouselText(slide.slug, "mobile") : undefined}
                        loading={isFirst ? "eager" : "lazy"}
                      />
                    </picture>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 도트 인디케이터 + 자동재생 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="relative mx-auto h-full w-full max-w-[77.5rem]">
          <div className="absolute bottom-6 right-5 z-10 flex items-center gap-2 md:bottom-10 md:right-10 xl:right-0">
            <div className="flex items-center gap-1">
              {slides.map((_, i) => {
                const isDark = slides[activeIndex]?.dark;
                const activeBg = isDark ? "bg-white" : "bg-[#111111]";
                const inactiveBg = isDark ? "bg-white/40" : "bg-[#111111]/20";
                return (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    aria-label={`${i + 1}번째 페이지`}
                    className={`h-[10px] rounded-full transition-all duration-300 cursor-pointer ${
                      activeIndex === i
                        ? `w-[32px] ${activeBg}`
                        : `w-[10px] ${inactiveBg}`
                    }`}
                  />
                );
              })}
            </div>
            <button
              onClick={toggleAutoplay}
              aria-label={isPlaying ? "자동 재생 중지" : "자동 재생 시작"}
              className="flex h-4 w-4 cursor-pointer items-center justify-center"
            >
              {(() => {
                const isDark = slides[activeIndex]?.dark;
                const strokeColor = isDark ? "#FFFFFF" : "#111111";
                return isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M5 3V13" stroke={strokeColor} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
                    <path d="M11 3V13" stroke={strokeColor} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 2L14 8L4 14V2Z" stroke={strokeColor} strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                );
              })()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
