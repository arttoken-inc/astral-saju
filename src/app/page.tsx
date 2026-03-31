import { loadLandingConfig } from "@/lib/configLoader";
import { cdnUrl } from "@/lib/cdn";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600;

export default async function Home() {
  const config = await loadLandingConfig();
  const firstSlug = config.carouselSlides[0]?.slug;

  return (
    <>
      {/* 첫 히어로 슬라이드 이미지 preload — LCP 개선 */}
      {firstSlug && (
        <>
          <link
            rel="preload"
            as="image"
            href={cdnUrl(`main/carousel/${firstSlug}/bg-mobile.png`)}
            media="(max-width: 767px)"
          />
          <link
            rel="preload"
            as="image"
            href={cdnUrl(`main/carousel/${firstSlug}/bg-tablet.png`)}
            media="(min-width: 768px) and (max-width: 1279px)"
          />
          <link
            rel="preload"
            as="image"
            href={cdnUrl(`main/carousel/${firstSlug}/bg-pc.png`)}
            media="(min-width: 1280px)"
          />
        </>
      )}
      <HomeClient config={config} />
    </>
  );
}
