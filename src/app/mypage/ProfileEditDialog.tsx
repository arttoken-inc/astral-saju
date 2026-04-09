"use client";

import { useState, useRef, useEffect } from "react";

interface ProfileData {
  displayName: string;
  birthdate: string;
  birthtime: string;
  gender: string;
  calendarType: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProfileData) => Promise<void>;
  initial: {
    displayName?: string | null;
    birthdate?: string | null;
    birthtime?: string | null;
    gender?: string | null;
    calendarType?: string | null;
  };
}

const TIME_OPTIONS = [
  { value: "", label: "시간을 선택해 주세요" },
  { value: "joja", label: "자시 (23:30~01:29)" },
  { value: "chuk", label: "축시 (01:30~03:29)" },
  { value: "in", label: "인시 (03:30~05:29)" },
  { value: "myo", label: "묘시 (05:30~07:29)" },
  { value: "jin", label: "진시 (07:30~09:29)" },
  { value: "sa", label: "사시 (09:30~11:29)" },
  { value: "oh", label: "오시 (11:30~13:29)" },
  { value: "mi", label: "미시 (13:30~15:29)" },
  { value: "shin", label: "신시 (15:30~17:29)" },
  { value: "yu", label: "유시 (17:30~19:29)" },
  { value: "sul", label: "술시 (19:30~21:29)" },
  { value: "hae", label: "해시 (21:30~23:29)" },
];

// 체크 아이콘 (filled)
function CheckIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="9" fill="#1C304A" fillOpacity="0.9" />
      <path d="M5.5 9L8 11.5L12.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke="#E1E1E1" />
    </svg>
  );
}

export default function ProfileEditDialog({ open, onClose, onSave, initial }: Props) {
  const [name, setName] = useState(initial.displayName ?? "");
  const [birthdate, setBirthdate] = useState(initial.birthdate ?? "");
  const [timeKey, setTimeKey] = useState(
    initial.birthtime && initial.birthtime !== "unknown" ? initial.birthtime : ""
  );
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<string>(initial.gender ?? "");
  const [calendarType, setCalendarType] = useState(initial.calendarType ?? "solar");
  const [saving, setSaving] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setName(initial.displayName ?? "");
      setBirthdate(initial.birthdate ?? "");
      const hasTime = initial.birthtime && initial.birthtime !== "unknown";
      setTimeKey(hasTime ? initial.birthtime! : "");
      setUnknownTime(false);
      setGender(initial.gender ?? "");
      setCalendarType(initial.calendarType ?? "solar");
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSave = async () => {
    if (!name.trim() || !birthdate.trim() || !gender) return;
    setSaving(true);
    try {
      await onSave({
        displayName: name.trim(),
        birthdate: birthdate.trim(),
        birthtime: (unknownTime || !timeKey) ? "unknown" : timeKey,
        gender,
        calendarType,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleBirthdateInput = (val: string) => {
    // Auto-format: add dots after year and month
    const digits = val.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = digits.slice(0, 4) + "." + digits.slice(4);
    if (digits.length > 6) formatted = digits.slice(0, 4) + "." + digits.slice(4, 6) + "." + digits.slice(6);
    setBirthdate(formatted);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Dialog */}
      <div
        role="dialog"
        aria-label="내 정보 입력"
        className="relative mx-4 w-full max-w-[448px] rounded-[20px] bg-white px-5 pb-6 pt-7"
      >
        {/* Header */}
        <div className="mb-5 text-center">
          <h3 className="font-pretendard text-[20px] font-semibold text-[#111111]">
            내 정보 입력
          </h3>
          <p className="mt-1 font-pretendard text-[16px] text-[#424242]">
            프로필을 완성하고 더 정확한 결과를 받아보세요.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* 이름 */}
          <div>
            <label className="font-pretendard text-[14px] font-bold text-[#111111]">
              이름
            </label>
            <input
              type="text"
              maxLength={4}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요. (최대 4글자)"
              className="mt-1 block h-10 w-full border-b border-[#E1E1E1] px-1 font-pretendard text-[16px] text-[#111111] outline-none placeholder:text-[#A1A1A1]"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-pretendard text-[14px] font-bold text-[#111111]">
                생년월일
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCalendarType("solar")}
                  className="flex cursor-pointer items-center gap-1 font-pretendard text-[16px] text-[#111111]"
                >
                  <CheckIcon active={calendarType === "solar"} />
                  <span>양력</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarType("lunar")}
                  className="flex cursor-pointer items-center gap-1 font-pretendard text-[16px] text-[#111111]"
                >
                  <CheckIcon active={calendarType === "lunar"} />
                  <span>음력</span>
                </button>
              </div>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={birthdate}
              onChange={(e) => handleBirthdateInput(e.target.value)}
              placeholder="1990.12.31"
              className="mt-1 block h-10 w-full border-b border-[#E1E1E1] px-1 font-pretendard text-[16px] text-[#111111] outline-none placeholder:text-[#A1A1A1]"
            />
          </div>

          {/* 태어난 시간 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="font-pretendard text-[14px] font-bold text-[#111111]">
                태어난 시간
              </label>
              <button
                type="button"
                onClick={() => {
                  const next = !unknownTime;
                  setUnknownTime(next);
                  if (next) setTimeKey("");
                }}
                className="flex cursor-pointer items-center gap-1 font-pretendard text-[16px] text-[#111111]"
              >
                <CheckIcon active={unknownTime} />
                <span>시간 모름</span>
              </button>
            </div>
            <div className="relative mt-1">
              <select
                value={unknownTime ? "" : timeKey}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimeKey(v);
                  if (v) setUnknownTime(false);
                }}
                className="h-10 w-full appearance-none border-b border-[#E1E1E1] bg-transparent px-1 font-pretendard text-[16px] text-[#111111] outline-none"
              >
                {TIME_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* 성별 */}
          <div>
            <label className="font-pretendard text-[14px] font-bold text-[#111111]">
              성별
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("남성")}
                className={`h-12 cursor-pointer rounded-[10px] font-pretendard text-[16px] font-semibold transition ${
                  gender === "남성"
                    ? "bg-[#1C304A]/90 text-white"
                    : "bg-white/80 text-[#757575] border border-[#E1E1E1]"
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setGender("여성")}
                className={`h-12 cursor-pointer rounded-[10px] font-pretendard text-[16px] font-semibold transition ${
                  gender === "여성"
                    ? "bg-[#1C304A]/90 text-white"
                    : "bg-white/80 text-[#757575] border border-[#E1E1E1]"
                }`}
              >
                여성
              </button>
            </div>
          </div>

          {/* 저장하기 */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !name.trim() || !birthdate.trim() || !gender}
            className="mt-2 h-12 w-full cursor-pointer rounded-[10px] bg-[#111111] font-pretendard text-[16px] font-semibold text-white transition disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
