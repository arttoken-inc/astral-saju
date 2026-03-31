import { ReactNode } from "react";
import Image from "next/image";
import type { Decorations } from "@/lib/serviceConfig";
import { cdnUrl } from "@/lib/cdn";

interface SajuCardProps {
  children: ReactNode;
  decorations: Decorations;
}

export default function SajuCard({ children, decorations }: SajuCardProps) {
  return (
    <div className="relative h-full border-[3px] border-[#1B2F49] bg-[#F5F3EC] shadow-md">
      <div className="absolute top-2 h-[1px] w-full bg-[#2B557E]" />
      <div className="absolute bottom-2 h-[1px] w-full bg-[#2B557E]" />
      <div className="absolute left-2 h-full w-[1px] bg-[#2B557E]" />
      <div className="absolute right-2 h-full w-[1px] bg-[#2B557E]" />
      <div className="absolute z-0 mt-6 flex w-full justify-between px-2">
        <Image alt="" className="mt-5" width={56} height={38} src={cdnUrl(decorations.leftCloud)} loading="lazy" />
        <Image alt="" className="mb-5" width={56} height={38} src={cdnUrl(decorations.rightCloud)} loading="lazy" />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
