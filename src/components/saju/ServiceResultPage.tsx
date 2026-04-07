"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import type {
  LoadedServiceConfig,
  ResultSection,
  ServiceScript,
  TextOverlay,
} from "@/lib/serviceConfig";
import type {
  SajuDisplayData,
  OhaengDisplayData,
  DaeunDisplayData,
} from "@/lib/sajuDisplayTypes";
import { resolveServiceImagePath } from "@/lib/configLoader";
import { replaceTemplate } from "@/lib/templateReplace";
import { cdnUrl } from "@/lib/cdn";
import SajuTable from "./SajuTable";
import DaeunTable from "./DaeunTable";
import OhaengSection from "./OhaengSection";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SajuAnalysisResult {
  sajuDisplay: SajuDisplayData;
  ohaengDisplay: OhaengDisplayData;
  daeunDisplay: DaeunDisplayData;
  resolvedImages: Record<string, string>;
  crisisList: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function img(serviceId: string, path: string): string {
  return cdnUrl(resolveServiceImagePath(serviceId, path));
}

function resolveScript(
  script: ServiceScript,
  scriptKey: string | undefined,
): TextOverlay[] | string | undefined {
  if (!scriptKey) return undefined;
  const parts = scriptKey.split(".");
  let cur: unknown = script;
  for (const p of parts) {
    if (cur && typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur as TextOverlay[] | string | undefined;
}

const TEXT_CLASS =
  "absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]";

// ---------------------------------------------------------------------------
// Result Header
// ---------------------------------------------------------------------------

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

function CardWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-3">{children}</div>;
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#04336D]" />
      <p className="mt-4 font-pretendard text-sm text-gray-500">사주를 분석하고 있습니다...</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Renderer
// ---------------------------------------------------------------------------

function SectionRenderer({
  section,
  config,
  vars,
  analysis,
}: {
  section: ResultSection;
  config: LoadedServiceConfig;
  vars: Record<string, string>;
  analysis: SajuAnalysisResult | null;
}) {
  const { service, script } = config;
  const serviceId = service.meta.serviceId;
  const t = (text: string) => replaceTemplate(text, vars);
  const decs = service.decorations;

  switch (section.type) {
    case "webtoon-panel": {
      const scriptData = resolveScript(script, section.scriptKey);
      const overlays = Array.isArray(scriptData) ? scriptData : undefined;
      return (
        <div className={section.className || "relative"}>
          {section.image && (
            <img className="w-full" alt="" src={img(serviceId, section.image)} loading="lazy" />
          )}
          {overlays?.map((overlay, i) => (
            <p key={i} className={TEXT_CLASS} style={overlay.position as React.CSSProperties}>
              {t(overlay.text).split("\n").map((line, j) => (
                <span key={j}>{j > 0 && <br />}{line}</span>
              ))}
            </p>
          ))}
        </div>
      );
    }

    case "image-sequence":
      return (
        <div className={section.className}>
          {section.images.map((imgPath, i) => (
            <img key={i} className="w-full" alt="" src={img(serviceId, imgPath)} loading="lazy" />
          ))}
        </div>
      );

    case "saju-table":
      return (
        <div className={section.className || "relative mt-36"}>
          {!analysis ? <LoadingSkeleton /> : (
            <CardWrapper>
              <SajuTable data={analysis.sajuDisplay} decorations={decs} />
            </CardWrapper>
          )}
        </div>
      );

    case "daeun-table":
      return (
        <div className={section.className || "relative mt-40"}>
          {!analysis ? <LoadingSkeleton /> : (
            <CardWrapper>
              <DaeunTable data={analysis.sajuDisplay} daeun={analysis.daeunDisplay} decorations={decs} />
            </CardWrapper>
          )}
        </div>
      );

    case "ohaeng":
      return (
        <div className={section.className || "relative mb-10 mt-80"}>
          {!analysis ? <LoadingSkeleton /> : (
            <CardWrapper>
              <OhaengSection data={analysis.sajuDisplay} ohaeng={analysis.ohaengDisplay} decorations={decs} />
            </CardWrapper>
          )}
        </div>
      );

    case "speech-bubble": {
      const scriptData = resolveScript(script, section.scriptKey);
      const text = typeof scriptData === "string" ? scriptData : "";
      return (
        <div className={`mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md ${section.className || ""}`}>
          {t(text).split("\n").map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </div>
      );
    }

    case "destiny-partner": {
      const title = t(script.titles.destiny_partner || "{name}님의 운명의 짝");
      const resolvedImg = analysis?.resolvedImages?.dreamPerson;
      const rule = service.dynamicImages.dreamPerson;
      const dreamPersonImg = resolvedImg
        ? cdnUrl(resolvedImg)
        : rule?.fallback ? cdnUrl(rule.fallback) : "";
      return (
        <CardWrapper>
          <div className="relative h-full border-[3px] border-[#1B2F49] bg-[#F5F3EC] shadow-md">
            <div className="absolute top-2 h-[1px] w-full bg-[#2B557E]" />
            <div className="absolute bottom-2 h-[1px] w-full bg-[#2B557E]" />
            <div className="absolute left-2 h-full w-[1px] bg-[#2B557E]" />
            <div className="absolute right-2 h-full w-[1px] bg-[#2B557E]" />
            <div className="absolute z-0 mt-6 flex w-full justify-between px-2">
              <img alt="" className="mt-5 h-[2.375rem] w-[3.5rem]" src={cdnUrl(decs.leftCloud)} loading="lazy" />
              <img alt="" className="mb-5 h-[2.375rem] w-[3.5rem]" src={cdnUrl(decs.rightCloud)} loading="lazy" />
            </div>
            <div className="relative" style={{ zIndex: 1 }}>
              <div className="px-5 py-10">
                <h3 className="text-center font-gapyeong text-xl font-bold leading-none">{title}</h3>
                <div className="mx-2 mb-10 mt-10 overflow-hidden rounded-3xl border-4 border-[#BDCEED]">
                  <div className="relative w-full" style={{ aspectRatio: "295 / 446" }}>
                    <img className="h-full w-full object-cover" alt="" src={dreamPersonImg} loading="lazy" />
                  </div>
                </div>
                <div className="w-full border-b border-[#A1A1A1]" />
                <div className="mt-10 space-y-6 px-4">
                  <p className="text-center font-pretendard text-sm text-gray-400">
                    {analysis ? "운명의 짝 상세 정보는 유료 분석에서 확인하세요" : "사주 분석 후 운명의 짝 정보가 표시됩니다"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardWrapper>
      );
    }

    case "wealth-graph": {
      const speechText = resolveScript(script, section.scriptKey ?? "result.wealth_intro");
      const title = t(script.titles.wealth_graph || "{name}님의 시기별 재산");
      const resolvedImg = analysis?.resolvedImages?.wealthGraph;
      const rule = service.dynamicImages.wealthGraph;
      const graphImg = resolvedImg
        ? cdnUrl(resolvedImg)
        : rule?.fallback ? cdnUrl(rule.fallback) : "";
      return (
        <div className={section.className || "relative mb-10 mt-28 px-3"}>
          {typeof speechText === "string" && (
            <div className="mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md">
              {t(speechText).split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </div>
          )}
          <div className="text-center font-gapyeong text-base font-bold">{title}</div>
          <img alt="" className="mt-4 w-full" src={graphImg} loading="lazy" />
        </div>
      );
    }

    case "crisis-list": {
      const title = t(script.titles.crisis_list || "{name}님에게 찾아올 위기");
      const items = analysis?.crisisList ?? [
        "사주 분석 후 위기 정보가 표시됩니다",
        "결제 후 전체 내용을 확인할 수 있습니다",
      ];
      return (
        <div className={section.className || "relative mx-6 p-2 shadow-md -mt-16 mb-12"}>
          <div className="border-2 border-[#A39481] py-8 pl-6 pr-4">
            <h3 className="pr-2 text-center font-gapyeong text-xl font-bold leading-none text-[#111111]">{title}</h3>
            <ul className="mt-8 flex flex-col justify-center gap-5">
              {items.map((item, i) => (
                <li key={i} className={`flex gap-2 font-pretendard font-normal ${i >= 3 ? "pointer-events-none select-none blur-sm" : ""}`}>
                  <span className="w-6 text-center font-bold text-[#2B557E]">{String(i + 1).padStart(2, "0")}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    case "payment-gate":
      return (
        <div className="relative">
          <div className="relative" style={{ aspectRatio: section.aspectRatio }}>
            <img className="h-full w-full object-cover" alt="" src={img(serviceId, section.image)} loading="lazy" />
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

// ---------------------------------------------------------------------------
// Sticky Payment Bar
// ---------------------------------------------------------------------------

function StickyPaymentBar({
  visible,
  buttonColor,
  buttonText,
  countdown,
}: {
  visible: boolean;
  buttonColor: string;
  buttonText: string;
  countdown: { h: number; m: number; s: number };
}) {
  const [time, setTime] = useState(countdown);

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

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ServiceResultPage({ config }: { config: LoadedServiceConfig }) {
  const { service, script } = config;
  const serviceId = service.meta.serviceId;

  const [analysis, setAnalysis] = useState<SajuAnalysisResult | null>(null);
  const [userName, setUserName] = useState("회원");
  const [showPaymentBar, setShowPaymentBar] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  // Load form data from sessionStorage and call API
  const fetchAnalysis = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      const stored = sessionStorage.getItem(`saju_form_${serviceId}`);
      if (!stored) return;

      const formData = JSON.parse(stored) as Record<string, string>;
      const name = formData.name || "회원";
      setUserName(name);

      const res = await fetch("/api/saju/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          name,
          birthdate: formData.birthdate,
          birthtime: formData.birthtime,
          gender: formData.gender,
          calendarType: formData.calendarType || "solar",
          dynamicImages: service.dynamicImages,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as SajuAnalysisResult;
        setAnalysis(data);
      }
    } catch (e) {
      console.error("Failed to fetch saju analysis:", e);
    }
  }, [serviceId, service.dynamicImages]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // Template vars
  const nameShort = userName.length > 1 ? userName.slice(1) : userName;
  const vars = {
    name: nameShort,
    character: script.character.name,
    characterName: script.character.name,
    serviceTitle: service.meta.serviceTitle,
  };

  // Payment bar trigger
  useEffect(() => {
    if (!triggerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShowPaymentBar(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  const paymentBar = service.resultPage.paymentBar;
  const triggerType = paymentBar.triggerAfter;
  const triggerIndex = service.resultPage.sections.findIndex(
    (s) => s.type === triggerType,
  );

  const paymentButtonText = replaceTemplate(script.payment.button, vars);

  return (
    <>
      <ResultHeader />
      <main className="mx-auto max-w-md pt-[3.75rem]">
        <div style={{ backgroundColor: service.theme.resultBg }}>
          {service.resultPage.sections.map((section, i) => (
            <div key={i}>
              {i === triggerIndex && <div ref={triggerRef} />}
              <SectionRenderer section={section} config={config} vars={vars} analysis={analysis} />
            </div>
          ))}
        </div>
        <StickyPaymentBar
          visible={showPaymentBar}
          buttonColor={service.theme.cardAccent}
          buttonText={paymentButtonText}
          countdown={paymentBar.countdown}
        />
      </main>
    </>
  );
}
