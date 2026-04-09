"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import SajuTable from "./SajuTable";
import DaeunTable from "./DaeunTable";
import OhaengSection from "./OhaengSection";
import SajuCard from "./SajuCard";
import type { SajuDisplayData, OhaengDisplayData, DaeunDisplayData, DestinyPartnerDisplayData } from "@/lib/sajuDisplayTypes";
import type { Decorations } from "@/lib/serviceConfig";
import { cdnUrl } from "@/lib/cdn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ChapterSection {
  type: string;
  src?: string;
  textKey?: string;
  aiKey?: string;
}

interface Chapter {
  id: string;
  title: string;
  aiKey?: string;
  sections: ChapterSection[];
}

interface ChaptersConfig {
  cdnBase: string;
  chapters: Chapter[];
}

interface SajuAnalysisResult {
  sajuDisplay: SajuDisplayData;
  ohaengDisplay: OhaengDisplayData;
  daeunDisplay: DaeunDisplayData;
  destinyPartner: DestinyPartnerDisplayData;
  resolvedImages: Record<string, string>;
  crisisList: string[];
}

interface AiTextData {
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Image helper
// ---------------------------------------------------------------------------

const ORIG_CDN = "https://cdn.aifortunedoctor.com/web/live/current/images";

function chImg(src: string) {
  // AI chapter images are under s/bluemoonladysaju/ prefix
  if (src.startsWith("ai/")) {
    return `${ORIG_CDN}/s/bluemoonladysaju/${src}`;
  }
  return `${ORIG_CDN}/${src}`;
}

// ---------------------------------------------------------------------------
// Decorations (same as used in ServiceResultPage)
// ---------------------------------------------------------------------------

const DECORATIONS: Decorations = {
  leftCloud: "decorations/border_left_cloud_decoration.png",
  rightCloud: "decorations/border_right_cloud_decoration.png",
  fiveCircle: "components/saju/fivecircle/five-circle.png",
  fiveCircleLegend: "components/saju/fivecircle/five-circle-legend.png",
  strengthDiagram: "components/saju/fivecircle/details/strength-diagram.png",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TextCard({
  text,
  decorations,
  placeholder,
}: {
  text?: string;
  decorations: Decorations;
  placeholder?: string;
}) {
  if (!text) {
    return (
      <div className="mx-4 my-6">
        <SajuCard decorations={decorations}>
          <div className="px-6 py-10 text-center font-pretendard text-sm leading-relaxed text-gray-400">
            {placeholder || "AI 분석 결과가 여기에 표시됩니다."}
          </div>
        </SajuCard>
      </div>
    );
  }

  const paragraphs = text.split("\n").filter((p) => p.trim());

  return (
    <div className="mx-4 my-6">
      <SajuCard decorations={decorations}>
        <div className="px-6 py-8">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-4 font-pretendard text-[15px] leading-[1.8] tracking-[-0.01em] text-[#333] last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </SajuCard>
    </div>
  );
}

function TOCSheet({
  chapters,
  currentPage,
  onSelect,
  onClose,
}: {
  chapters: Chapter[];
  currentPage: number;
  onSelect: (page: number) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="sheet backdrop"
      />
      <div className="relative z-10 max-h-[70vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white pb-8 pt-3">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D9D9D9]" />
        <h3 className="px-6 pb-2 font-pretendard text-base font-bold text-[#111]">
          청월아씨 정통사주
        </h3>
        {chapters.map((ch, i) => (
          <p
            key={ch.id}
            onClick={() => {
              onSelect(i);
              onClose();
            }}
            className={`m-0 w-full cursor-pointer truncate px-6 py-3 text-left font-pretendard font-normal text-black hover:bg-[#F1F1F1] hover:font-medium ${
              i === currentPage ? "font-bold" : ""
            }`}
          >
            {ch.title}
          </p>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function PaidResultPage({
  serviceId,
  orderId,
  initialPage,
}: {
  serviceId: string;
  orderId: string;
  initialPage: number;
}) {
  const [chaptersConfig, setChaptersConfig] = useState<ChaptersConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [tocOpen, setTocOpen] = useState(false);
  const [analysis, setAnalysis] = useState<SajuAnalysisResult | null>(null);
  const [aiTexts, setAiTexts] = useState<AiTextData>({});
  const [userName, setUserName] = useState("회원");
  const contentRef = useRef<HTMLDivElement>(null);

  // Load chapters config
  useEffect(() => {
    import(`@/data/services/${serviceId}/chapters.json`)
      .then((mod) => setChaptersConfig(mod.default || mod))
      .catch(() => console.error("Failed to load chapters config"));
  }, [serviceId]);

  // Load saju analysis from API (same as ServiceResultPage)
  const fetchedRef = useRef(false);
  const fetchAnalysis = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    try {
      // Try to load from saved results first
      const saved = localStorage.getItem("saju_results");
      if (!saved) return;
      const results = JSON.parse(saved);
      const entry = results.find((r: { id: string }) => r.id === orderId);
      if (!entry) {
        // Fallback: use the first result or sessionStorage
        const stored = sessionStorage.getItem(`saju_form_${serviceId}`);
        if (!stored) return;
        const formData = JSON.parse(stored);
        setUserName(formData.name || "회원");
        const res = await fetch("/api/saju/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serviceId,
            name: formData.name,
            birthdate: formData.birthdate,
            birthtime: formData.birthtime,
            gender: formData.gender,
            calendarType: formData.calendarType || "solar",
          }),
        });
        if (res.ok) setAnalysis(await res.json());
        return;
      }

      setUserName(entry.name);
      const res = await fetch("/api/saju/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          name: entry.name,
          birthdate: entry.birthdate,
          birthtime: entry.birthtime,
          gender: entry.gender,
          calendarType: "solar",
        }),
      });
      if (res.ok) setAnalysis(await res.json());
    } catch (e) {
      console.error("Failed to fetch analysis:", e);
    }
  }, [serviceId, orderId]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  // Scroll to top when page changes
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("page", String(currentPage));
    window.history.replaceState({}, "", url.toString());
  }, [currentPage]);

  if (!chaptersConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center font-pretendard text-sm text-gray-400">
          로딩 중...
        </div>
      </div>
    );
  }

  const chapters = chaptersConfig.chapters;
  const chapter = chapters[currentPage] || chapters[0];
  const nameShort = userName.length > 1 ? userName.slice(1) : userName;

  const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(chapters.length - 1, p + 1));

  // ---------------------------------------------------------------------------
  // Render a single section
  // ---------------------------------------------------------------------------
  function renderSection(sec: ChapterSection, idx: number) {
    switch (sec.type) {
      case "image":
        return (
          <div key={idx} className="relative">
            <img
              src={chImg(sec.src!)}
              alt={sec.src?.split("/").pop()?.replace(".png", "") || ""}
              className="w-full"
              loading={idx > 2 ? "lazy" : "eager"}
            />
            {sec.textKey && (
              <div className="px-5 py-4">
                {renderStaticText(sec.textKey)}
              </div>
            )}
          </div>
        );

      case "saju-sense":
        return (
          <div key={idx} className="mt-4">
            <img
              src={chImg(sec.src!)}
              alt="사주상식"
              className="w-full"
              loading="lazy"
            />
          </div>
        );

      case "saju-table":
        return (
          <div key={idx} className="mx-4 my-6">
            <SajuTable
              data={analysis?.sajuDisplay ?? null}
              decorations={DECORATIONS}
            />
          </div>
        );

      case "daeun-table":
        return (
          <div key={idx} className="mx-4 my-6">
            <DaeunTable
              data={analysis?.sajuDisplay ?? null}
              daeun={analysis?.daeunDisplay ?? null}
              decorations={DECORATIONS}
            />
          </div>
        );

      case "ohaeng":
        return (
          <div key={idx} className="mx-4 my-6">
            <OhaengSection
              data={analysis?.sajuDisplay ?? null}
              ohaeng={analysis?.ohaengDisplay ?? null}
              decorations={DECORATIONS}
            />
          </div>
        );

      case "text-card":
        return (
          <TextCard
            key={idx}
            text={aiTexts[sec.aiKey || ""]}
            decorations={DECORATIONS}
            placeholder={`${nameShort}님의 ${getAiKeyLabel(sec.aiKey)} 분석 결과가 여기에 표시됩니다.`}
          />
        );

      case "day-animal": {
        if (!analysis) return null;
        // CDN uses Korean reading of 지지, not kanji
        const jijiHanja = analysis.sajuDisplay.jiji[1];
        const jijiKrMap: Record<string, string> = {
          "子": "자", "丑": "축", "寅": "인", "卯": "묘",
          "辰": "진", "巳": "사", "午": "오", "未": "미",
          "申": "신", "酉": "유", "戌": "술", "亥": "해",
        };
        const jijiKr = jijiKrMap[jijiHanja] || jijiHanja;
        const BASE = `${ORIG_CDN}/components/s/bluemoonladysaju/animal`;
        return (
          <div key={idx} className="my-6 flex flex-col items-center">
            <img
              src={`${BASE}/title/yellow.png`}
              alt="day_animal_title"
              className="mb-4 w-3/4"
              loading="lazy"
            />
            <img
              src={`${BASE}/kanji/${encodeURIComponent(jijiKr)}/animal/yellow.png`}
              alt="day_animal"
              className="mb-4 w-2/3"
              loading="lazy"
            />
            <img
              src={`${BASE}/kanji/${encodeURIComponent(jijiKr)}/text/yellow.png`}
              alt="day_animal_text"
              className="mb-4 w-full px-4"
              loading="lazy"
            />
          </div>
        );
      }

      case "day-character": {
        if (!analysis) return null;
        const ilganKr = (() => {
          const map: Record<string, string> = { "甲": "갑", "乙": "을", "丙": "병", "丁": "정", "戊": "무", "己": "기", "庚": "경", "辛": "신", "壬": "임", "癸": "계" };
          return map[analysis.sajuDisplay.cheongan[1]] || analysis.sajuDisplay.cheongan[1];
        })();
        return (
          <div key={idx} className="my-4 flex justify-center">
            <img
              src={`${ORIG_CDN}/components/s/bluemoonladysaju/animal/gan/${encodeURIComponent(ilganKr)}.png`}
              alt="day_character"
              className="w-1/2"
              loading="lazy"
            />
          </div>
        );
      }

      case "destiny-partner": {
        if (!analysis) return null;
        const dp = analysis.destinyPartner;
        const imgSrc = analysis.resolvedImages?.dreamPerson;
        return (
          <div key={idx} className="mx-4 my-6">
            {imgSrc && (
              <img
                src={cdnUrl(imgSrc)}
                alt="운명의 짝"
                className="mb-4 w-full rounded-2xl"
                loading="lazy"
              />
            )}
            <div className="rounded-2xl bg-[#F8F7F4] p-5">
              <h4 className="mb-3 text-center font-gapyeong text-lg font-bold text-[#111]">
                {nameShort}님의 운명의 짝
              </h4>
              <div className="space-y-2 font-pretendard text-sm text-[#424242]">
                <p><strong>직업:</strong> {dp.job}</p>
                <p><strong>외모:</strong> {dp.appearance.join(", ")}</p>
                <p><strong>성격:</strong> {dp.personality.join(", ")}</p>
                <p><strong>특징:</strong> {dp.traits.join(", ")}</p>
              </div>
            </div>
          </div>
        );
      }

      case "review-cta":
        return (
          <div key={idx} className="mx-4 my-8">
            <div className="rounded-2xl border border-[#E0DCD4] bg-[#FAF8F4] px-6 py-8 text-center">
              <p className="mb-2 font-gapyeong text-lg font-bold text-[#333]">
                사주풀이가 도움이 되셨나요?
              </p>
              <p className="mb-5 font-pretendard text-sm leading-relaxed text-[#777]">
                소중한 후기를 남겨주시면<br />
                더 좋은 서비스로 보답하겠습니다.
              </p>
              <button className="rounded-full bg-[#2C2C2C] px-8 py-3 font-pretendard text-sm font-medium text-white">
                후기 작성하기
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  // Static text for webtoon panels
  function renderStaticText(textKey: string) {
    const staticTexts: Record<string, string[]> = {
      "prologue.greeting": [
        `안녕하세요, 청월입니다.`,
        `${nameShort}님과 제가 이렇게 인연이 닿아`,
        `사주를 봐드리게 되어 정말 기쁘네요.`,
      ],
      "prologue.message": [
        `오늘은 ${nameShort}님의 사주를 함께 풀어보며,`,
        `매 순간 더 나은 결정을 하실 수 있도록 도와드릴게요.`,
        `이 사주풀이가 ${nameShort}님께 따뜻한 위로와 용기를 선물할 수 있기를 바라며,`,
        `차분한 마음으로 함께해주세요.`,
      ],
      "prologue.preview": [
        `본격적인 사주풀이에 앞서 다음 장에서는`,
        `${nameShort}님의 '사주원국'과 함께`,
        `'대운'과 '오행'을 함께 살펴볼게요.`,
      ],
      "ch1.intro": [
        `그럼 ${nameShort}님의 사주에는 어떤 글자들이 있을까요?`,
        `먼저 제가 ${nameShort}님의 사주를 보기 쉽게 표로 정리했어요.`,
      ],
      "ch1.closing": [
        `이제 풀이 준비와 설명이 끝났으니,`,
        `${nameShort}님이 어떤 사람인지 알려주는, 일주부터 분석해 볼게요.`,
      ],
      "ch2.intro": [
        `${nameShort}님, 이번 장에서는 '일주(日柱)'와 '오행(五行)'에 대해 살펴볼게요.`,
        `참, ${nameShort}님과 같은 일간을 가진 친구도 소개해 드릴게요.`,
      ],
      "ch2.closing": [
        `${nameShort}님 자신을 깊이 이해하시는데 도움이 되셨길 바라요.`,
        `다음 장에서는 ${nameShort}님이 세상을 살아가는 방식,`,
      ],
      "ch3.intro": [
        `이번 장에서는 ${nameShort}님의 '십성(十星)'을 분석해 볼게요.`,
      ],
      "ch3.closing": [],
      "ch4.intro": [
        `이번에는 ${nameShort}님의 '십이운성(十二運星)'을 살펴볼게요`,
      ],
      "ch4.closing": [],
      "ch5.intro": [
        `이제 ${nameShort}님의 사주에 있는 '신살(神殺)'을 확인해볼게요.`,
      ],
      "ch5.closing": [],
      "ch6.intro": [
        `${nameShort}님, 이번엔 삶을 살아가면서 큰 힘이 되어줄 '귀인(貴人)'에 대해 풀어드릴게요.`,
      ],
      "ch6.closing": [],
      "ch7.intro": [
        `${nameShort}님, 사주 속에는 어떤 '재물운(財物運)'이 있을까요?`,
      ],
      "ch7.closing": [],
      "ch8.intro": [
        `이번 장에서는 ${nameShort}님이 가장 궁금해하실 연애와 결혼에 대해 이야기해 볼게요.`,
      ],
      "ch8.closing": [],
      "ch9.intro": [
        `${nameShort}님, 지금 하시는 일은 잘 되어가시나요?`,
        `이번 장에서는 '직업운'에 대해 살펴볼게요.`,
      ],
      "ch9.closing": [],
      "ch10.intro": [
        `이제부터 ${nameShort}님이 건강에 관해 꼭 짚고 넘어가야 할 부분들을 안내해드릴게요.`,
      ],
      "ch10.closing": [],
      "ch11.intro": [
        `${nameShort}님, 이제 '대운'을 살펴볼 차례네요.`,
        `대운은 10년마다 한 번씩 바뀌는 인생의 큰 흐름을 말하는데요,`,
      ],
      "ch11.closing": [],
      "ch12.intro": [
        `${nameShort}님, 이번에는 '향후 5년간의 연운'과 '삼재(三災)'에 대해 함께 알아볼게요.`,
      ],
      "ch13.intro": [
        `${nameShort}님, 이제 제가 준비한 마지막 이야기예요.`,
        `지금까지 함께 해 주셔서 고맙습니다.`,
      ],
      "ch14.ending": [
        `여기까지, ${nameShort}님의 사주에 담긴 다양한 이야기들을 하나씩 살펴보았어요.`,
        `${nameShort}님께서 자신을 조금 더 깊이 이해하고,`,
        `앞으로 펼쳐질 삶을 더욱 품격있고 현명하게 만들어 가셨으면 하는 마음이에요.`,
      ],
    };

    const lines = staticTexts[textKey] || [];
    if (lines.length === 0) return null;
    return (
      <div className="space-y-2">
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-center font-gapyeong text-base leading-[1.7] text-[#111]"
          >
            {line}
          </p>
        ))}
      </div>
    );
  }

  function getAiKeyLabel(key?: string): string {
    const labels: Record<string, string> = {
      personality: "성격",
      personalityDetail: "성격 상세",
      yongshinAnalysis: "용신/희신/기신",
      tenGods: "십성",
      majorCycles: "십이운성",
      risk: "신살",
      relationship: "귀인/대인관계",
      wealth: "재물운",
      love: "연애&결혼운",
      career: "직업운",
      health: "건강운",
      majorCyclesDetail: "대운 상세",
      yearlyFortune: "향후 5년 연운",
      questionAnswer: "질문 답변",
    };
    return labels[key || ""] || "";
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Fixed Header */}
      <header className="z-50 mx-auto flex h-[3.5rem] w-full max-w-md shrink-0 items-center justify-between bg-white px-4">
        <Link href="/">
          <Image
            src="/logos/logo_with_black_typo.png"
            alt="logo"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
        </Link>
        <div className="min-w-0 flex-1 px-3 text-center">
          <p className="truncate font-pretendard text-sm font-medium text-[#111]">
            {chapter.title}
          </p>
          <p className="font-pretendard text-[10px] text-[#999]">
            청월아씨 정통사주
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button aria-label="공유하기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37061L8.08261 9.19367C7.54305 8.46052 6.6753 8 5.7 8C4.20883 8 3 9.20883 3 10.7C3 12.1912 4.20883 13.4 5.7 13.4C6.6753 13.4 7.54305 12.9395 8.08261 12.2063L15.0227 16.0294C15.0077 16.1508 15 16.2745 15 16.4C15 17.8912 16.2088 19.1 17.7 19.1C19.1912 19.1 20.4 17.8912 20.4 16.4C20.4 14.9088 19.1912 13.7 17.7 13.7C16.7247 13.7 15.857 14.1605 15.3174 14.8937L8.37727 11.0706C8.39225 10.9492 8.4 10.8255 8.4 10.7C8.4 10.5745 8.39225 10.4508 8.37727 10.3294L15.3174 6.50633C15.857 7.23948 16.7247 7.7 17.7 7.7" stroke="#111" strokeWidth="1.5" />
            </svg>
          </button>
          <Link href="/mypage">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#111" strokeWidth="1.5" />
              <path d="M18 19C18 16.2386 15.3137 14 12 14C8.68629 14 6 16.2386 6 19" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Scrollable Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-md">
          {chapter.sections.map((sec, i) => renderSection(sec, i))}
        </div>
      </div>

      {/* Fixed Bottom Navigation */}
      <nav className="z-50 mx-auto flex h-14 w-full max-w-md shrink-0 items-center justify-between border-t border-[#E8E8E8] bg-white px-4">
        <button
          onClick={() => setTocOpen(true)}
          className="flex cursor-pointer items-center gap-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="#111" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-pretendard text-xs text-[#111]">목차</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentPage === 0}
            className="cursor-pointer disabled:opacity-30"
            aria-label="이전 페이지"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goNext}
            disabled={currentPage === chapters.length - 1}
            className="cursor-pointer disabled:opacity-30"
            aria-label="다음 페이지"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* TOC Sheet */}
      {tocOpen && (
        <TOCSheet
          chapters={chapters}
          currentPage={currentPage}
          onSelect={setCurrentPage}
          onClose={() => setTocOpen(false)}
        />
      )}
    </div>
  );
}
