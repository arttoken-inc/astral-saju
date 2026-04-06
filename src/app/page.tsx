import { loadLandingConfig } from "@/lib/configLoader";
import { cdnUrl } from "@/lib/cdn";
import HomeClient from "@/components/HomeClient";

export const revalidate = 3600;

export default async function Home() {
  const config = await loadLandingConfig();
  const firstBanner = config.carouselSlides[0]?.banner;

  return (
    <>
      {/* 첫 히어로 슬라이드 이미지 preload — LCP 개선 */}
      {firstBanner && (
        <link rel="preload" as="image" href={cdnUrl(firstBanner)} />
      )}
      <HomeClient config={config} />
    </>
  );
}
