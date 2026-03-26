import type { SajuData, OhaengData, Decorations } from "@/lib/serviceConfig";
import SajuCard from "./SajuCard";

const CDN = "https://cdn.aifortunedoctor.com";
function yongsinImg(name: string) {
  return `${CDN}/web/live/current/images/components/saju/fivecircle/details/${encodeURIComponent(name)}.png`;
}

function InfoButton() {
  return (
    <button className="cursor-pointer">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A1A1A1]">
        <rect x="0.5" y="0.5" width="13" height="13" rx="6.5" stroke="currentColor" />
        <path d="M6.373 11.5V5.137H7.627V11.5H6.373ZM7.006 4.152C6.572 4.152 6.209 3.824 6.209 3.414C6.209 3.004 6.572 2.676 7.006 2.676C7.428 2.676 7.791 3.004 7.791 3.414C7.791 3.824 7.428 4.152 7.006 4.152Z" fill="currentColor" />
      </svg>
    </button>
  );
}

interface OhaengSectionProps {
  data: SajuData;
  ohaeng: OhaengData;
  decorations: Decorations;
}

export default function OhaengSection({ data, ohaeng: oh, decorations }: OhaengSectionProps) {
  const maxRatio = Math.max(...oh.ratio.map((r) => r.value));

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
            <InfoButton />
          </div>
          <div className="relative mx-1">
            <img alt="" className="w-full" src={decorations.fiveCircle} />
            <img alt="" className="absolute left-1 top-0 h-[32px] w-[51px]" src={decorations.fiveCircleLegend} />
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
            <InfoButton />
          </div>
          <div className="grid aspect-[1.5] w-full grid-cols-5 grid-rows-[auto_1fr_auto] gap-x-2 gap-y-1">
            <div /><div /><div />
            <div className="relative -mx-1 mb-2">
              <div className="mx-auto flex items-center justify-center rounded-md border-none bg-black py-1 font-pretendard text-[0.625rem] font-medium text-white">나의 오행</div>
              <svg width="8" height="9" viewBox="0 0 8 9" fill="none" className="absolute bottom-[1px] left-1/2 -translate-x-1/2 translate-y-full">
                <path d="M1.265 0.5L6.735 0.5L4 7.608L1.265 0.5Z" fill="black" />
              </svg>
            </div>
            <div />
            {oh.ratio.map((r) => (
              <div key={r.hanja} className="mt-auto rounded-md" style={{ backgroundColor: r.color, height: maxRatio > 0 ? `${(r.value / maxRatio) * 100}%` : "0px" }} />
            ))}
            {oh.ratio.map((r) => (
              <div key={`label-${r.hanja}`} className="mt-1 text-center font-zenantique text-base leading-none" style={{ color: r.color }}>{r.hanja}</div>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {oh.ratio.map((r) => (
              <div key={r.name} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="flex h-6 w-6 items-center justify-center rounded font-pretendard text-xs font-semibold text-white" style={{ backgroundColor: r.color }}>{r.name}</div>
                  <span className="font-zenantique text-sm" style={{ color: r.color }}>{r.hanja}</span>
                </div>
                <span className="font-pretendard text-sm">{r.value}% :{r.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-center gap-4">
              {[
                { label: "용신", name: oh.yongshin.img },
                { label: "희신", name: oh.heeshin.img },
                { label: "기신", name: oh.gishin.img },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="font-pretendard text-sm font-semibold">{item.label}</span>
                    <InfoButton />
                  </div>
                  <img alt={item.name} src={yongsinImg(item.name)} className="h-12 w-12" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-center font-pretendard text-xs text-[#757575]">*억부용신 및 조후용신을 고려한 결과입니다.*</p>
          </div>
        </div>

        {/* 신강신약 */}
        <div>
          <h4 className="mb-4 font-pretendard text-base font-bold text-[#111111]">신강신약</h4>
          <div className="flex flex-col items-center">
            <img alt="" src={decorations.strengthDiagram} className="w-[274px]" />
            <div className="mt-2 flex w-[274px] justify-between font-pretendard text-[0.625rem] text-[#757575]">
              {["극약", "태약", "신약", "중화", "신강", "태강", "극왕"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="mt-4 text-center font-pretendard text-sm">
              일간 <span className="font-semibold">&apos;{oh.strength.ilgan}&apos;</span>,{" "}
              <span className="font-semibold">&apos;{oh.strength.level}&apos;</span>한
              <br />사주입니다.
            </div>
          </div>
        </div>
      </div>
    </SajuCard>
  );
}
