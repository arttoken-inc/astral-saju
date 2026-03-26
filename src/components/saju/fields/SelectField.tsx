interface SelectFieldProps {
  label: string;
  optional?: boolean;
  placeholder?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectField({
  label, optional, placeholder, options, value, onChange,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center justify-between py-0.5 pl-1 font-pretendard font-semibold tracking-[-2.5%] text-[#FFFFFF] text-lg"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        {label} {optional && <span className="text-sm font-normal leading-none">(선택)</span>}
      </label>
      <div className="relative">
        <select
          className="appearance-none font-pretendard text-base leading-none tracking-[-2.5%] focus:outline-none h-12 rounded-[0.652rem] border border-[#E1E1E1] bg-white/80 pl-3 pr-11 backdrop-blur-[8px] font-medium text-[#757575] w-full text-left"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 6L8 10L12 6" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
