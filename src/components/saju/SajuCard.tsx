import { ReactNode } from "react";
import { decorations } from "@/data/bluemoonladysaju";

export default function SajuCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-full border-[3px] border-[#1B2F49] bg-[#F5F3EC] shadow-md">
      <div className="absolute top-2 h-[1px] w-full bg-[#2B557E]" />
      <div className="absolute bottom-2 h-[1px] w-full bg-[#2B557E]" />
      <div className="absolute left-2 h-full w-[1px] bg-[#2B557E]" />
      <div className="absolute right-2 h-full w-[1px] bg-[#2B557E]" />
      <div className="absolute z-0 mt-6 flex w-full justify-between px-2">
        <img
          alt="left_cloud_decoration"
          className="mt-5 h-[2.375rem] w-[3.5rem]"
          src={decorations.leftCloud}
        />
        <img
          alt="right_cloud_decoration"
          className="mb-5 h-[2.375rem] w-[3.5rem]"
          src={decorations.rightCloud}
        />
      </div>
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
