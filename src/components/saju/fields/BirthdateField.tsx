"use client";

interface BirthdateFieldProps {
  label: string;
  placeholder?: string;
  calendarLabels?: [string, string];
  value: string;
  onChange: (value: string) => void;
  calendarType: "solar" | "lunar";
  onCalendarChange: (type: "solar" | "lunar") => void;
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

export default function BirthdateField({
  label, placeholder, calendarLabels = ["양력", "음력"],
  value, onChange, calendarType, onCalendarChange,
}: BirthdateFieldProps) {
  const handleChange = (raw: string) => {
    let v = raw.replace(/[^0-9]/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    if (v.length > 4) v = v.slice(0, 4) + "." + v.slice(4);
    if (v.length > 7) v = v.slice(0, 7) + "." + v.slice(7);
    const parts = v.split(".");
    if (parts[0]?.length === 4) {
      const y = parseInt(parts[0]);
      if (y > 2025) { parts[0] = "2025"; v = parts.join("."); }
      if (y < 1900 && parts[0].length === 4) { parts[0] = "1900"; v = parts.join("."); }
    }
    if (parts[1]?.length === 2) {
      const m = parseInt(parts[1]);
      if (m > 12) { parts[1] = "12"; v = parts.join("."); }
      if (m < 1 && parts[1] !== "0") { parts[1] = "01"; v = parts.join("."); }
    }
    if (parts[2]?.length === 2) {
      const d = parseInt(parts[2]);
      if (d > 31) { parts[2] = "31"; v = parts.join("."); }
      if (d < 1 && parts[2] !== "0") { parts[2] = "01"; v = parts.join("."); }
    }
    onChange(v);
  };

  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
        style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
      >
        <span>{label}</span>
        <span className="flex items-center gap-2.5">
          {calendarLabels.map((lbl, i) => {
            const isActive = i === 0 ? calendarType === "solar" : calendarType === "lunar";
            return (
              <button
                key={lbl}
                type="button"
                onClick={() => onCalendarChange(i === 0 ? "solar" : "lunar")}
                className="flex cursor-pointer items-center justify-center gap-1 leading-none tracking-[-2.5%]"
              >
                <CheckSvg active={isActive} />
                <div className={`font-pretendard text-sm font-medium leading-none ${isActive ? "text-white" : "text-[#A1A1A1]"}`}>{lbl}</div>
              </button>
            );
          })}
        </span>
      </label>
      <input
        className="w-full font-pretendard text-base font-medium leading-none tracking-[-2.5%] placeholder:font-normal placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 text-white rounded-none"
        placeholder={placeholder}
        maxLength={10}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
}
