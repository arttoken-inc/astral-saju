"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { ServiceConfig, ResultSection } from "@/lib/serviceConfig";
import { replaceTemplate } from "@/lib/templateReplace";
import { cdnUrl } from "@/lib/cdn";
import SajuTable from "./SajuTable";
import DaeunTable from "./DaeunTable";
import OhaengSection from "./OhaengSection";
import SajuCard from "./SajuCard";

function ResultHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] bg-white mx-auto max-w-md">
      <div className="flex w-full items-center justify-between px-5">
        <a className="flex items-center gap-2" href="/">
          <Image src="/logos/logo_with_black_typo.png" alt="logo" width={120} height={24} className="h-6 w-auto" priority />
        </a>
        <a className="flex h-7 w-7 items-center justify-center text-[#111111]" href="/mypage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}

const TEXT_CLASS = "absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]";

function CardWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-3">{children}</div>;
}

function SectionRenderer({ section, config, vars }: { section: ResultSection; config: ServiceConfig; vars: Record<string, string> }) {
  const t = (text: string) => replaceTemplate(text, vars);

  switch (section.type) {
    case "image":
      return (
        <div className={section.className || "relative"}>
          <img className="w-full" alt="" src={cdnUrl(section.image)} loading="lazy" />
        </div>
      );

    case "image-with-text":
      return (
        <div className={section.className || "relative"}>
          <img className="w-full" alt="" src={cdnUrl(section.image)} loading="lazy" />
          {section.texts.map((txt, i) => (
            <p key={i} className={TEXT_CLASS} style={txt.style as React.CSSProperties}>
              {t(txt.content).split("\n").map((line, j) => (
                <span key={j}>{j > 0 && <br />}{line}</span>
              ))}
            </p>
          ))}
        </div>
      );

    case "image-pair":
      return (
        <div className={section.className}>
          {section.images.map((img, i) => (
            <img key={i} className="w-full" alt="" src={cdnUrl(img)} loading="lazy" />
          ))}
        </div>
      );

    case "saju-table":
      return (
        <div className={section.className}>
          <img alt="" src={cdnUrl(section.bubbleImage)} className="mx-auto mb-4" style={{ width: section.bubbleWidth }} loading="lazy" />
          <CardWrapper>
            <SajuTable data={config.sampleData} decorations={config.decorations} />
          </CardWrapper>
        </div>
      );

    case "daeun-table":
      return (
        <div className={section.className}>
          <img alt="" src={cdnUrl(section.bubbleImages[0])} className="mx-auto mb-4" style={{ width: section.bubbleWidths[0] }} loading="lazy" />
          <CardWrapper>
            <DaeunTable data={config.sampleData} daeun={config.daeunData} decorations={config.decorations} />
          </CardWrapper>
          {section.bubbleImages[1] && (
            <img alt="" src={cdnUrl(section.bubbleImages[1])} className="mx-auto mt-4" style={{ width: section.bubbleWidths[1] }} loading="lazy" />
          )}
        </div>
      );

    case "ohaeng":
      return (
        <div className={section.className}>
          <img alt="" src={cdnUrl(section.bubbleImage)} className="mx-auto mb-4" style={{ width: section.bubbleWidth }} loading="lazy" />
          <CardWrapper>
            <OhaengSection data={config.sampleData} ohaeng={config.ohaengData} decorations={config.decorations} />
          </CardWrapper>
        </div>
      );

    case "speech-bubble":
      return (
        <div className={`mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md ${section.className || ""}`}>
          {t(section.text).split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </div>
      );

    case "destiny-partner": {
      const dp = config.destinyPartner;
      const decs = config.decorations;
      return (
        <CardWrapper>
          <div className="relative h-full border-[3px] border-[#1B2F49] bg-[#F5F3EC] shadow-md">
            <div className="absolute top-2 h-[1px] w-full bg-[#2B557E]" />
            <div className="absolute bottom-2 h-[1px] w-full bg-[#2B557E]" />
            <div className="absolute left-2 h-full w-[1px] bg-[#2B557E]" />
            <div className="absolute right-2 h-full w-[1px] bg-[#2B557E]" />
            <div className="absolute z-0 mt-6 flex w-full justify-between px-2">
              <img alt="" className="mt-5 h-[2.375rem] w-[3.5rem]" src={decs.leftCloud} loading="lazy" />
              <img alt="" className="mb-5 h-[2.375rem] w-[3.5rem]" src={decs.rightCloud} loading="lazy" />
            </div>
            <div className="relative" style={{ zIndex: 1 }}>
              <div className="px-5 py-10">
                <h3 className="text-center font-gapyeong text-xl font-bold leading-none">{t(section.title)}</h3>
                <div className="mx-2 mb-10 mt-10 overflow-hidden rounded-3xl border-4 border-[#BDCEED]">
                  <div className="relative w-full" style={{ aspectRatio: "295 / 446" }}>
                    <img className="h-full w-full object-cover" alt="" src={cdnUrl(decs.dreamPerson)} loading="lazy" />
                  </div>
                </div>
                <div className="w-full border-b border-[#A1A1A1]" />
                <div className="mt-10 space-y-6 px-4">
                  {[
                    { label: "직업", tags: [dp.job] },
                    { label: "외모", tags: dp.appearance },
                    { label: "성격", tags: dp.personality },
                    { label: "특징", tags: dp.traits },
                  ].map((sec) => (
                    <div key={sec.label} className="space-y-3">
                      <div className="font-pretendard text-base font-semibold leading-none">{sec.label}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        {sec.tags.map((tag) => (
                          <div key={tag} className="rounded-full border border-[#486493] bg-[#BDCEED]/20 px-3 py-2 font-pretendard text-sm font-semibold text-[#2B557E]">{tag}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardWrapper>
      );
    }

    case "wealth-graph":
      return (
        <div className={section.className}>
          <div className="mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md">
            {t(section.speechBubble).split("\n").map((line, i) => (
              <span key={i}>{i > 0 && <br />}{line}</span>
            ))}
          </div>
          <div className="text-center font-gapyeong text-base font-bold">{t(section.title)}</div>
          <img alt="" className="mt-4 w-full" src={cdnUrl(config.decorations.maskedWealthGraph)} loading="lazy" />
        </div>
      );

    case "crisis-list":
      return (
        <div className={section.className}>
          <div className="border-2 border-[#A39481] py-8 pl-6 pr-4">
            <h3 className="pr-2 text-center font-gapyeong text-xl font-bold leading-none text-[#111111]">{t(section.title)}</h3>
            <ul className="mt-8 flex flex-col justify-center gap-5">
              {config.crisisList.map((item, i) => (
                <li key={i} className={`flex gap-2 font-pretendard font-normal ${i >= 3 ? "pointer-events-none select-none blur-sm" : ""}`}>
                  <span className="w-6 text-center font-bold text-[#2B557E]">{String(i + 1).padStart(2, "0")}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "payment-gate":
      return (
        <div className="relative">
          <div className="relative" style={{ aspectRatio: section.aspectRatio }}>
            <img className="h-full w-full object-cover" alt="" src={cdnUrl(section.image)} loading="lazy" />
          </div>
          <div className="absolute inset-x-0 w-full -translate-y-1/2" style={{ top: section.buttonPosition.top, height: section.buttonPosition.height, paddingLeft: section.buttonPosition.px, paddingRight: section.buttonPosition.px }}>
            <button className="z-10 h-full w-full rounded-b-3xl bg-transparent" />
          </div>
        </div>
      );

    case "spacer":
      return <div className={section.className || "h-0 w-full"} />;

    default:
      return null;
  }
}

function StickyPaymentBar({ visible, buttonColor, buttonText }: { visible: boolean; buttonColor: string; buttonText: string }) {
  const [time, setTime] = useState({ h: 10, m: 31, s: 47 });

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) return { h: 0, m: 0, s: 0 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={`sticky bottom-0 z-40 w-full bg-[#000000]/80 px-4 py-4 font-pretendard transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mb-3 flex items-center justify-center gap-1 text-center text-sm text-white">
        <div>할인혜택 종료까지</div>
        <div className="text-start font-bold text-[#FDE047]">
          {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
        </div>
      </div>
      <button
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-[0.625rem] px-2.5 py-3 text-center font-pretendard text-xl font-semibold text-white"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
      <div className="h-safe-bottom" />
    </div>
  );
}

export default function ServiceResultPage({ config }: { config: ServiceConfig }) {
  const vars = {
    name: config.sampleData.nameShort,
    characterName: config.meta.characterName,
  };

  const [showPaymentBar, setShowPaymentBar] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPaymentBar(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  // 트리거 위치: speech-bubble 섹션 (운명의 짝 전에 나타나는 말풍선)
  const triggerIndex = config.resultPage.sections.findIndex(
    (s) => s.type === "speech-bubble"
  );

  return (
    <>
      <ResultHeader />
      <main className="mx-auto max-w-md pt-[3.75rem]">
        <div style={{ backgroundColor: config.colors.resultBg }}>
          {config.resultPage.sections.map((section, i) => (
            <div key={i}>
              {i === triggerIndex && <div ref={triggerRef} />}
              <SectionRenderer section={section} config={config} vars={vars} />
            </div>
          ))}
        </div>
        <StickyPaymentBar
          visible={showPaymentBar}
          buttonColor={config.colors.cardAccent}
          buttonText={`${config.meta.serviceTitle} 지금 받아보기`}
        />
      </main>
    </>
  );
}
