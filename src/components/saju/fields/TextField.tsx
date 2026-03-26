interface TextFieldProps {
  label: string;
  placeholder?: string;
  maxLength?: number;
  value: string;
  onChange: (value: string) => void;
}

export default function TextField({ label, placeholder, maxLength, value, onChange }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        {label}
      </label>
      <input
        className="w-full font-pretendard text-base font-medium leading-none tracking-[-2.5%] placeholder:font-normal placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 text-white rounded-none"
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
