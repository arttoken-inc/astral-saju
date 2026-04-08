import type { SajuDisplayData, OhaengDisplayData } from "@/lib/sajuDisplayTypes";
import type { Decorations } from "@/lib/serviceConfig";
import SajuCard from "./SajuCard";
import { cdnUrl } from "@/lib/cdn";
import { useEffect, useMemo, useRef, useState } from "react";

function yongsinImg(name: string) {
  return `https://cdn.aifortunedoctor.com/web/live/current/images/components/saju/fivecircle/details/${encodeURIComponent(name)}.png`;
}

function InfoButton({ title, description, align = "left" }: { title: string; description: string; align?: "left" | "center" | "right" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [open]);

  const posStyle = align === "right"
    ? { right: "-10px" }
    : align === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { left: "calc(-66px)" };
  const arrowStyle = align === "right"
    ? { right: "16px" }
    : align === "center"
      ? { left: "50%" }
      : { left: "calc(20% + 25px)" };

  return (
    <div ref={wrapperRef} className="relative">
      <button className="cursor-pointer" onClick={() => setOpen((v) => !v)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A1A1A1]">
          <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" stroke="currentColor" />
          <path d="M6.373 11.5V5.137H7.627V11.5H6.373ZM7.006 4.152C6.572 4.152 6.209 3.824 6.209 3.414C6.209 3.004 6.572 2.676 7.006 2.676C7.428 2.676 7.791 3.004 7.791 3.414C7.791 3.824 7.428 4.152 7.006 4.152Z" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-[29px] z-10 flex min-w-[15rem] flex-col items-center" style={posStyle}>
          <svg width="6" height="9" viewBox="0 0 6 9" fill="none" className="absolute top-[-8px] -translate-x-1/2" style={arrowStyle}>
            <path d="M0 9L3 0L6 9H0Z" fill="white" />
            <path d="M0 9L3 0L6 9" stroke="#A1A1A1" strokeWidth="1" />
          </svg>
          <div className="h-full w-full rounded-md border border-[#A1A1A1] bg-white py-2 pl-3 pr-2">
            <p className="mb-1 font-pretendard text-xs font-semibold text-[#424242]">{title}</p>
            <p className="whitespace-pre-line font-pretendard text-xs text-[#424242]">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface OhaengSectionProps {
  data: SajuDisplayData | null;
  ohaeng: OhaengDisplayData | null;
  decorations: Decorations;
}

export default function OhaengSection({ data, ohaeng: oh, decorations }: OhaengSectionProps) {
  if (!data || !oh) {
    return (
      <SajuCard decorations={decorations}>
        <div className="px-6 py-10 text-center font-pretendard text-sm text-gray-400">
          사주 분석 후 오행 정보가 표시됩니다
        </div>
      </SajuCard>
    );
  }

  const maxRatio = useMemo(() => Math.max(...oh.ratio.map((r) => r.value)), [oh.ratio]);
  const barRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setBarVisible(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <SajuCard decorations={decorations}>
      <div className="px-7 pb-10">
        <h3 className="my-10 text-center font-gapyeong text-2xl font-bold">
          {data.name}님의 오행&amp;용신
        </h3>

        {/* 오행분포 */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-start gap-1">
            <h4 className="font-pretendard text-base font-bold text-[#111111]">오행분포: 겉으로 보이는 오행의 균형</h4>
            <InfoButton title="오행분포란?" description={"사주팔자에 오행이 각각 몇개씩 존재하는지와\n오행간의 상생/상극을 나타낸 표입니다"} />
          </div>
          <div className="relative mx-1">
            <img alt="" className="w-full" src={cdnUrl(decorations.fiveCircle)} loading="lazy" />
            <img alt="" className="absolute left-1 top-0 h-[32px] w-[51px]" src={cdnUrl(decorations.fiveCircleLegend)} loading="lazy" />
            {oh.distribution.map((count, i) => {
              const positions = [
                { left: "49.1%", top: "21.8%" },
                { left: "91.2%", top: "47.3%" },
                { left: "75.6%", top: "92.6%" },
                { left: "22.6%", top: "92.6%" },
                { left: "8.8%", top: "47.3%" },
              ];
              return (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 font-pretendard text-xs font-semibold" style={{ left: positions[i].left, top: positions[i].top, color: oh.ratio[i].color }}>
                  {count}개
                </div>
              );
            })}
          </div>
        </div>

        {/* 오행비율 */}
        <div className="mb-7">
          <div className="mb-6 flex items-center justify-start gap-1">
            <h4 className="font-pretendard text-base font-bold text-[#111111]">오행비율: 실제 내 사주 속 오행의 강약</h4>
            <InfoButton title="오행비율이란?" description={"조후와 궁성에 따른 오행의 보정을 적용하여,\n나의 오행 강약을 정확하게 분석한 표입니다"} />
          </div>
          <div ref={barRef} className="grid aspect-[1.5] w-full grid-cols-5 grid-rows-[auto_1fr_auto] gap-x-2 gap-y-1">
            {Array.from({ length: 5 }, (_, i) =>
              i === oh.myElementIndex ? (
                <div key={i} className="relative -mx-1 mb-2">
                  <div className="mx-auto flex items-center justify-center rounded-md border-none bg-black py-1 font-pretendard text-sm font-medium text-white">나의 오행</div>
                  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" className="absolute bottom-[1px] left-1/2 -translate-x-1/2 translate-y-full">
                    <path d="M1.265 0.5L6.735 0.5L4 7.608L1.265 0.5Z" fill="black" />
                  </svg>
                </div>
              ) : <div key={i} />
            )}
            {oh.ratio.map((r, i) => (
              <div key={r.hanja} className="mt-auto rounded-md transition-all duration-700 ease-out" style={{ backgroundColor: r.color, height: barVisible && maxRatio > 0 ? `${(r.value / maxRatio) * 100}%` : "0px", transitionDelay: `${i * 100}ms` }} />
            ))}
            {oh.ratio.map((r) => (
              <div key={`label-${r.hanja}`} className="mt-1 text-center font-zenantique text-base leading-none" style={{ color: r.color }}>{r.hanja}</div>
            ))}
          </div>
          <div className="mt-6">
            {oh.ratio.map((r, i) => {
              const isMyElement = i === oh.myElementIndex;
              return (
                <div key={r.name} className={`px-4 py-[22px] ${isMyElement ? "rounded-[10px] bg-white shadow-md" : ""}`} style={{ borderBottom: isMyElement ? "none" : "1px solid rgba(225,225,225,0.9)" }}>
                  <div className="flex items-center justify-between">
                    <div className="font-pretendard text-base" style={{ color: r.color }}>
                      <span className="font-semibold">{r.name}</span>{" "}
                      <span className="font-zenantique font-normal">{r.hanja}</span>
                    </div>
                    <div className="font-pretendard text-base text-gray-800">
                      <span className="font-bold">{r.value}% : </span>
                      <span className="font-light">{r.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-center">
              {[
                { label: "용신", name: oh.yongshin.img, tooltip: { title: "용신이란?", desc: "사주의 균형을 맞추기 위해 필요한 오행으로,\n사주 전체의 조화를 이끄는 핵심 에너지", align: "left" as const } },
                { label: "희신", name: oh.heeshin.img, tooltip: { title: "희신이란?", desc: "용신을 도와 사주의 흐름을 좋게 만드는 보조\n적인 오행으로, 용신을 생하는 오행입니다.", align: "center" as const } },
                { label: "기신", name: oh.gishin.img, tooltip: { title: "기신이란?", desc: "사주의 흐름을 방해하고 균형을 깨뜨리는 오\n행으로, 용신을 극하는 오행입니다.", align: "right" as const } },
              ].map((item) => (
                <div key={item.label} className="flex w-[115px] flex-col items-center gap-5">
                  <div className="flex items-center gap-1">
                    <span className="font-pretendard text-base font-normal">{item.label}</span>
                    <InfoButton title={item.tooltip.title} description={item.tooltip.desc} align={item.tooltip.align} />
                  </div>
                  <img alt={item.name} src={yongsinImg(item.name)} className="h-auto w-12" loading="lazy" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center font-pretendard text-xs text-[#757575]">*억부용신 및 조후용신을 고려한 결과입니다.*</p>
          </div>
        </div>

        {/* 신강신약 */}
        <div className="border-t border-[#E1E1E1]/90">
          <div className="mt-7 flex items-center justify-start gap-1">
            <h4 className="font-pretendard text-base font-bold text-[#111111]">신강신약</h4>
          </div>
          <div className="mt-8 flex flex-col gap-3.5">
            <img alt="" src={cdnUrl(decorations.strengthDiagram)} className="w-full" loading="lazy" />
            <div className="flex items-center justify-between">
              {["극약", "태약", "신약", "중화", "신강", "태강", "극왕"].map((label) => {
                const isActive = label === oh.strength.level;
                return (
                  <div key={label} className={`font-pretendard ${isActive ? "font-bold text-[#111111]" : "font-normal text-[#A1A1A1]"}`}>{label}</div>
                );
              })}
            </div>
            <div className="mx-auto flex w-48 flex-col items-center justify-center border border-black bg-white py-2.5 text-center">
              <div className="font-gapyeong text-base font-bold text-black">
                일간 <span className="text-[#AE1C1C]">&apos;{oh.strength.ilgan}&apos;</span>, <span className="text-[#AE1C1C]">&apos;{oh.strength.level}&apos;</span>한
              </div>
              <div>사주입니다.</div>
            </div>
          </div>
        </div>
      </div>
    </SajuCard>
  );
}
