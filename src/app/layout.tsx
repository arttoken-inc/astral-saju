import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "청월당 사주 - 프리미엄 웹툰 사주, 타로, 궁합, 작명, 해몽, AI 사주, 인공지능 운세",
  description:
    "프리미엄 웹툰 사주, 타로, 궁합, 작명, 해몽, AI 사주, 인공지능 운세",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preload"
          href="/fonts/GapyeongHanseokbong/GapyeongHanseokbongR.hangul-core.woff2?v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GapyeongHanseokbong/GapyeongHanseokbongR.hangul-common.woff2?v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GapyeongHanseokbong/GapyeongHanseokbongB.hangul-core.woff2?v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GapyeongHanseokbong/GapyeongHanseokbongB.hangul-common.woff2?v=3"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
