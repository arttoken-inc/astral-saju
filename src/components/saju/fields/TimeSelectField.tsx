"use client";

import type { TimeOption } from "@/lib/serviceConfig";

interface TimeSelectFieldProps {
  label: string;
  unknownLabel?: string;
  options: TimeOption[];
  value: string;
  onChange: (value: string) => void;
  unknownTime: boolean;
  onUnknownChange: (unknown: boolean) => void;
}

function CheckSvg({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707Z" fill="#FFFFFF" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M7.333 10L9.111 11.778L12.667 8.222M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z" stroke="#A1A1A1" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function TimeSelectField({
  label, unknownLabel = "시간모름", options,
  value, onChange, unknownTime, onUnknownChange,
}: TimeSelectFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        <span>{label}</span>
        <button
          type="button"
          onClick={() => onUnknownChange(!unknownTime)}
          className="flex cursor-pointer items-center justify-center gap-1 leading-none tracking-[-2.5%]"
        >
          <CheckSvg active={unknownTime} />
          <div className={`font-pretendard text-sm font-medium leading-none ${unknownTime ? "text-white" : "text-[#A1A1A1]"}`}>{unknownLabel}</div>
        </button>
      </label>
      <div className="relative">
        <select
          className="w-full appearance-none font-pretendard text-base leading-none tracking-[-2.5%] placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 font-medium text-[#757575] rounded-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.target.showPicker?.()}
          disabled={unknownTime}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
