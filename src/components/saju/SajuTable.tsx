import type { SajuData, Decorations } from "@/lib/serviceConfig";
import SajuCard from "./SajuCard";
import { cdnUrl } from "@/lib/cdn";

function kanjiImg(char: string) {
  return cdnUrl(`moonlight/kanji/${encodeURIComponent(char)}.png`);
}

interface SajuTableProps {
  data: SajuData;
  decorations: Decorations;
}

export default function SajuTable({ data: d, decorations }: SajuTableProps) {
  const cols = ["時", "日", "月", "年"];

  return (
    <SajuCard decorations={decorations}>
      <div className="mb-6 mt-10 flex w-full flex-col items-center justify-center gap-1 text-center">
        <div className="font-gapyeong text-sm font-normal xs:text-lg">
          {d.name}님의 사주
        </div>
        <div className="font-gapyeong text-xl font-bold xs:text-2xl">
          {d.birthDate}{" "}
          <span className="font-zenantique font-normal">{d.birthTime}</span>
          <span>시</span>
        </div>
      </div>
      <div className="mb-8 w-full items-center justify-center p-2 text-center">
        <div className="w-full px-3 font-zenantique text-black">
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black text-[1.375rem]">
            <div className="border-r-2 border-black" />
            {cols.map((col, i) => (
              <div key={col} className={`flex items-center justify-center py-2.5 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>{col}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">十星<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(십성)</div></div>
            {d.sipseongTop.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-sm">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.625rem] leading-none">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 grid-rows-2 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-b border-r-2 border-b-[#8A8A8A] border-r-black text-xs">天干<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(천간)</div></div>
            {d.cheongan.map((ch, i) => (
              <div key={`cg-${i}`} className={`flex items-center justify-center border-b border-b-[#8A8A8A] bg-white p-1 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>
                <img alt={ch} src={kanjiImg(ch)} />
              </div>
            ))}
            <div className="flex flex-col items-center justify-center border-r-2 border-r-black text-xs">地支<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(지지)</div></div>
            {d.jiji.map((ji, i) => (
              <div key={`jj-${i}`} className={`flex items-center justify-center bg-white p-1 ${i < 3 ? "border-r border-r-[#8A8A8A]" : ""}`}>
                <img alt={ji} src={kanjiImg(ji)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">十星<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(십성)</div></div>
            {d.sipseongBottom.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-sm">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.625rem] leading-none">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">十二運星<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(십이운성)</div></div>
            {d.sibiUnseong.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-sm">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.625rem] leading-none">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-b-2 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">神殺<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(신살)</div></div>
            {d.sinsal.map((s, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                <span className="text-sm">{s.hanja}</span>
                <div className="mt-0.5 font-gyeonggibatang text-[0.625rem] leading-none">({s.hangul})</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 border-r-2 border-black">
            <div className="flex flex-col items-center justify-center border-r-2 border-black text-xs">貴人<div className="mt-0.5 font-gyeonggibatang text-[0.5rem] leading-none">(귀인)</div></div>
            {d.guin.map((g, i) => (
              <div key={i} className={`flex flex-col items-center justify-center bg-white py-2 text-[0.625rem] leading-tight ${i < 3 ? "border-r border-r-[#8a8a8a]" : ""}`}>
                {g.split("\n").map((line, j) => (
                  <span key={j} className="font-gyeonggibatang">{line}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SajuCard>
  );
}
