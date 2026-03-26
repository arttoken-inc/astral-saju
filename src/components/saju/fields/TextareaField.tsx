"use client";

interface TextareaFieldProps {
  label: string;
  optional?: boolean;
  placeholder?: string;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
}

export default function TextareaField({
  label, optional, placeholder, maxLength = 200, value, onChange,
}: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center justify-between py-0.5 pl-1 font-pretendard font-semibold tracking-[-2.5%] text-[#FFFFFF] text-lg"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        {label} {optional && <span className="text-sm font-normal leading-none">(선택)</span>}
      </label>
      <div>
        <textarea
          className="block w-full resize-none px-3 py-4 tracking-[-2.5%] placeholder:whitespace-pre-line focus:outline-none h-[160px] rounded-[10px] border border-white/20 bg-white/80 text-base font-medium leading-[1.5] text-[#111111] backdrop-blur-sm placeholder:font-medium placeholder:text-[#757575]"
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-2 w-full pr-1 text-right font-pretendard text-xs font-normal leading-none tracking-[-2.5%] text-[#E1E1E1]">
          {value.length}/{maxLength}
        </div>
      </div>
    </div>
  );
}
