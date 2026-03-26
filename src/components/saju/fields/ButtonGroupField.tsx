interface ButtonGroupFieldProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  primaryColor?: string;
}

export default function ButtonGroupField({
  label, options, value, onChange, primaryColor = "#04336D",
}: ButtonGroupFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        {label}
      </label>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex flex-1 items-center justify-center rounded-[0.625rem] border font-pretendard leading-none tracking-[-2.5%] focus:outline-none h-12 ${
              value === opt
                ? "font-semibold text-white"
                : "border-white font-medium text-[#E1E1E1]"
            }`}
            style={value === opt ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
