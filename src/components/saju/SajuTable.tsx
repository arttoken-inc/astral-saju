import type { SajuDisplayData } from "@/lib/sajuDisplayTypes";
import type { Decorations } from "@/lib/serviceConfig";
import SajuCard from "./SajuCard";
import { cdnUrl } from "@/lib/cdn";

function kanjiImg(char: string) {
  return cdnUrl(`moonlight/kanji/${encodeURIComponent(char)}.png`);
}

interface SajuTableProps {
  data: SajuDisplayData | null;
  decorations: Decorations;
}

export default function SajuTable({ data: d, decorations }: SajuTableProps) {
  if (!d) {
    return (
      <SajuCard decorations={decorations}>
        <div className="px-6 py-10 text-center font-pretendard text-sm text-gray-400">
          사주 분석 후 사주표가 표시됩니다
        </div>
      </SajuCard>
    );
  }

  const cols = ["時", "日", "月", "年"];

  return (
    <SajuCard decorations={decorations}>
      <div className="mb-6 mt-10 flex w-full flex-col items-center justify-center gap-1 text-center">
        <div className="font-gapyeong text-lg font-normal">
          {d.name}님의 사주
        </div>
        <div className="font-gapyeong text-2xl font-bold">
          {d.birthDate}{" "}
          <span className="font-zenantique font-normal">{d.birthTime}</span>
          <span>시</span>
        </div>
      </div>
      <div className="mb-8 w-full items-center justify-center p-2 text-center">
        <div className="w-full px-3 font-zenantique font-normal text-black">
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black text-[1.375rem]">
            <div className="border-r-2 border-black" />
            {cols.map((col, i) => (
              <div key={col} className={`flex items-center justify-center py-2.5 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>{col}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-sm">十星<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(십성)</div></div>
            {d.sipseongTop.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-base">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 grid-rows-2 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-b border-r-2 border-b-[#8A8A8A] border-r-black text-sm">天干<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(천간)</div></div>
            {d.cheongan.map((ch, i) => (
              <div key={`cg-${i}`} className={`flex items-center justify-center border-b border-b-[#8A8A8A] bg-white p-1 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>
                <img alt={ch} src={kanjiImg(ch)} loading="lazy" />
              </div>
            ))}
            <div className="flex flex-col items-center justify-center border-r-2 border-r-black text-sm">地支<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(지지)</div></div>
            {d.jiji.map((ji, i) => (
              <div key={`jj-${i}`} className={`flex items-center justify-center bg-white p-1 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>
                <img alt={ji} src={kanjiImg(ji)} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-sm">十星<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(십성)</div></div>
            {d.sipseongBottom.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-base">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">十二運星<div className="mt-0.5 font-gyeonggibatang text-[0.5625rem] font-normal leading-tight">(십이운성)</div></div>
            {d.sibiUnseong.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-base">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-sm">神殺<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(신살)</div></div>
            {d.sinsal.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-base">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-sm">貴人<div className="mt-0.5 font-gyeonggibatang text-[0.6875rem] font-normal leading-tight">(귀인)</div></div>
            {d.guin.map((g, i) => (
              <div key={i} className={`flex min-h-[55.75px] flex-col items-center justify-center bg-white py-2 leading-tight ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                {g.split("\n").map((line, j) => (
                  <span key={j} className="font-gyeonggibatang text-[0.625rem]">{line}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SajuCard>
  );
}
