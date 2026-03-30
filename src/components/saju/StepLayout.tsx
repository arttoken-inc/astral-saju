"use client";

import { ReactNode } from "react";

interface StepLayoutProps {
  bgType: "image" | "video";
  bgSrc: string;
  videoPoster?: string;
  children: ReactNode;
  buttons: ReactNode;
  topGradient?: { height: number; from?: string };
  bottomGradient?: { height: number };
  stepIndicator?: { current: number; total: number };
  headerContent?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function StepLayout({
  bgType,
  bgSrc,
  videoPoster,
  children,
  buttons,
  topGradient,
  bottomGradient = { height: 150 },
  stepIndicator,
  headerContent,
  className = "",
  style,
}: StepLayoutProps) {
  return (
    <div className={`mx-auto h-[100dvh] min-h-[100dvh] w-full max-w-[480px] overflow-hidden text-white relative ${className}`} style={style}>
      {/* 헤더 */}
      <header className="inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] absolute bg-transparent mx-auto max-w-md">
        <div className="flex w-full items-center justify-between px-5">
          <a className="flex items-center gap-2" href="/">
            <img src="/logos/logo_with_white_typo.png" alt="logo" className="h-6 w-auto" />
          </a>
          <a className="flex h-7 w-7 items-center justify-center text-white" href="/mypage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </header>
      {/* 배경 레이어 */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
        {bgType === "video" ? (
          <div className="absolute inset-0 h-full w-full">
            <div className="relative h-full w-full [&>video]:h-full [&>video]:object-cover [&>video]:object-top">
              <video
                className="w-full"
                muted
                loop
                autoPlay
                playsInline
                poster={videoPoster}
              >
                <source src={bgSrc} type="video/mp4" />
                <img
                  src={videoPoster}
                  alt="배경"
                  className="w-full"
                />
              </video>
            </div>
          </div>
        ) : (
          <img
            alt="배경"
            className="absolute inset-0 h-full w-full object-cover"
            src={bgSrc}
          />
        )}
      </div>

      {/* 콘텐츠 오버레이 */}
      <div className="absolute inset-0 z-20 flex flex-col opacity-100">
        {/* 상단 그라디언트 */}
        {topGradient && (
          <div
            className="pointer-events-none absolute left-0 right-0 top-0"
            style={{
              height: `${topGradient.height}px`,
              backgroundImage: `linear-gradient(${topGradient.from} 0%, rgba(17, 17, 17, 0) 100%)`,
            }}
          />
        )}

        {/* 스텝 인디케이터 */}
        {stepIndicator && (
          <div className="absolute left-1/2 top-[21px] z-[1] w-full -translate-x-1/2 px-8">
            <div className="flex justify-center">
              <p className="font-pretendard text-base tracking-[-0.4px]">
                <span className="font-bold">{stepIndicator.current}</span>
                <span className="font-normal">/{stepIndicator.total}</span>
              </p>
            </div>
            {headerContent}
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="relative flex min-h-0 w-full flex-1">
          <div className="absolute inset-0 flex flex-col px-5 overflow-y-auto">
            <div className="absolute bottom-0 left-0 px-5 py-0 transition-[padding] duration-300 ease-out mx-auto flex w-full flex-1 flex-col justify-end pb-[116px]">
              {children}
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <div className="absolute bottom-0 left-0 right-0 z-10 w-full px-5 pb-10">
            <div className="mx-auto flex w-full gap-3">{buttons}</div>
          </div>
        </div>

        {/* 하단 그라디언트 */}
        {bottomGradient && (
          <div
            className="pointer-events-none absolute left-0 right-0 bottom-0 z-[-1]"
            style={{
              height: `${bottomGradient.height}px`,
              background:
                "linear-gradient(rgba(17, 17, 17, 0) 0%, rgb(17, 17, 17) 100%)",
            }}
          />
        )}
      </div>
    </div>
  );
}

// 공통 버튼 컴포넌트
export function PrevButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer items-center justify-center py-3 text-center font-pretendard border bg-transparent h-12 w-auto shrink-0 rounded-[10px] border-white px-6 text-[20px] font-medium tracking-[-0.5px] text-white"
    >
      이전
    </button>
  );
}

export function CTAButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-center px-2.5 py-3 text-center font-pretendard bg-[#04336D] h-12 flex-1 rounded-[10px] text-[20px] font-semibold tracking-[-0.5px] text-white"
    >
      {children}
    </button>
  );
}
