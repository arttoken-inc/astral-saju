"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import StepLayout, {
  PrevButton,
  CTAButton,
} from "@/components/saju/StepLayout";
import { stepImages, timeOptions } from "@/data/bluemoonladysaju";

type Step = "home" | "intro" | "info" | "middle" | "step1" | "step2";

function BluemoonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step") as string | null;
  const step: Step =
    stepParam === "step_intro"
      ? "intro"
      : stepParam === "step_info"
        ? "info"
        : stepParam === "step_middle"
          ? "middle"
          : stepParam === "step_1"
            ? "step1"
            : stepParam === "step_2"
              ? "step2"
              : "home";

  // 폼 상태
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [birthTime, setBirthTime] = useState("");
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [loveStatus, setLoveStatus] = useState("");
  const [loveDuration, setLoveDuration] = useState("");
  const [question, setQuestion] = useState("");

  const goTo = (s: string) => {
    if (s === "home") {
      router.push("/s/bluemoonladysaju");
    } else {
      router.push(`/s/bluemoonladysaju?step=${s}`);
    }
  };

  const SajuHeader = () => (
    <header className="inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] absolute bg-transparent mx-auto max-w-md">
      <div className="flex w-full items-center justify-between px-5">
        <a className="flex items-center gap-2" href="/">
          <img src="/logos/logo_with_white_typo.png" alt="logo" className="h-6 w-auto" />
        </a>
        <a className="flex h-7 w-7 items-center justify-center text-white" href="/mypage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );

  // ===== HERO =====
  if (step === "home") {
    return (
      <div className="mx-auto h-[100dvh] min-h-[100dvh] w-full max-w-[480px] overflow-hidden text-white relative">
        <SajuHeader />
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
          <div className="absolute inset-0 h-full w-full">
            <div className="relative h-full w-full [&>video]:h-full [&>video]:object-cover [&>video]:object-top">
              <video className="w-full" muted loop autoPlay playsInline poster={stepImages.homePoster}>
                <source src={stepImages.homeVideo} type="video/mp4" />
                <img src={stepImages.homePoster} alt="배경" className="w-full" />
              </video>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 z-20 flex flex-col opacity-100">
          <div
            className="pointer-events-none absolute left-0 right-0 top-0"
            style={{ height: 130, backgroundImage: "linear-gradient(180deg, rgba(17,17,17,0.5) 0%, rgba(17,17,17,0) 100%)" }}
          />
          <div className="relative flex min-h-0 w-full flex-1">
            <div className="absolute inset-0 flex flex-col px-5 overflow-y-auto">
              <div className="absolute bottom-0 left-0 px-5 py-0 mx-auto flex w-full flex-1 flex-col justify-end pb-10">
                <div className="absolute bottom-[120px] left-0 right-0 z-10 flex justify-center px-5">
                  <div className="relative w-full">
                    <div className="w-full">
                      <img
                        src={stepImages.homeTitle}
                        alt="BlueMoonLadySaju Title"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="absolute bottom-0 left-0 right-0 z-10 w-full px-5 pb-10">
              <div className="mx-auto flex w-full gap-3">
                <CTAButton onClick={() => goTo("step_intro")}>
                  내 사주팔자 바로 확인하기
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== INTRO =====
  if (step === "intro") {
    return (
      <StepLayout
        bgType="image"
        bgSrc={stepImages.intro}
        bottomGradient={{ height: 150 }}
        buttons={
          <>
            <PrevButton onClick={() => goTo("home")} />
            <CTAButton onClick={() => goTo("step_info")}>
              좋아, 내 이름은..
            </CTAButton>
          </>
        }
      >
        <div />
      </StepLayout>
    );
  }

  // ===== INFO (1/3) =====
  if (step === "info") {
    return (
      <StepLayout
        bgType="image"
        bgSrc={stepImages.info}
        topGradient={{ height: 238, from: "rgb(17, 17, 17)" }}
        bottomGradient={{ height: 450 }}
        stepIndicator={{ current: 1, total: 3 }}
        buttons={
          <>
            <PrevButton onClick={() => goTo("step_intro")} />
            <CTAButton onClick={() => goTo("step_middle")}>
              다 입력했어!
            </CTAButton>
          </>
        }
      >
        <div className="relative z-[60] flex w-full flex-1 flex-col items-end justify-end">
          <div className="w-full space-y-8 px-1">
            {/* 이름 */}
            <div className="flex flex-col gap-3">
              <label
                className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
                style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
              >
                나의 이름
              </label>
              <input
                className="w-full font-pretendard text-base font-medium leading-none tracking-[-2.5%] placeholder:font-normal placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 text-white rounded-none"
                placeholder="이름을 입력해 주세요."
                maxLength={4}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 생년월일 */}
            <div className="flex flex-col gap-3">
              <label
                className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
                style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
              >
                <span>나의 생년월일</span>
                <span className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCalendarType("solar")}
                    className="flex cursor-pointer items-center justify-center gap-1 leading-none tracking-[-2.5%]"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {calendarType === "solar" ? (
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707Z" fill="#FFFFFF" />
                      ) : (
                        <path d="M7.333 10L9.111 11.778L12.667 8.222M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z" stroke="#A1A1A1" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                    <div className={`font-pretendard text-sm font-medium leading-none ${calendarType === "solar" ? "text-white" : "text-[#A1A1A1]"}`}>양력</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarType("lunar")}
                    className="flex cursor-pointer items-center justify-center gap-1 leading-none tracking-[-2.5%]"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {calendarType === "lunar" ? (
                        <path fillRule="evenodd" clipRule="evenodd" d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707Z" fill="#FFFFFF" />
                      ) : (
                        <path d="M7.333 10L9.111 11.778L12.667 8.222M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z" stroke="#A1A1A1" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                    <div className={`font-pretendard text-sm font-medium leading-none ${calendarType === "lunar" ? "text-white" : "text-[#A1A1A1]"}`}>음력</div>
                  </button>
                </span>
              </label>
              <input
                className="w-full font-pretendard text-base font-medium leading-none tracking-[-2.5%] placeholder:font-normal placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 text-white rounded-none"
                placeholder="0000.00.00"
                value={birthDate}
                maxLength={10}
                onChange={(e) => {
                  let v = e.target.value.replace(/[^0-9]/g, "");
                  if (v.length > 8) v = v.slice(0, 8);
                  // 자동으로 . 삽입
                  if (v.length > 4) v = v.slice(0, 4) + "." + v.slice(4);
                  if (v.length > 7) v = v.slice(0, 7) + "." + v.slice(7);
                  // 유효성: 년도 1900~2025, 월 01~12, 일 01~31
                  const parts = v.split(".");
                  if (parts[0] && parts[0].length === 4) {
                    const y = parseInt(parts[0]);
                    if (y > 2025) { parts[0] = "2025"; v = parts.join("."); }
                    if (y < 1900 && parts[0].length === 4) { parts[0] = "1900"; v = parts.join("."); }
                  }
                  if (parts[1] && parts[1].length === 2) {
                    const m = parseInt(parts[1]);
                    if (m > 12) { parts[1] = "12"; v = parts.join("."); }
                    if (m < 1 && parts[1] !== "0") { parts[1] = "01"; v = parts.join("."); }
                  }
                  if (parts[2] && parts[2].length === 2) {
                    const d = parseInt(parts[2]);
                    if (d > 31) { parts[2] = "31"; v = parts.join("."); }
                    if (d < 1 && parts[2] !== "0") { parts[2] = "01"; v = parts.join("."); }
                  }
                  setBirthDate(v);
                }}
              />
            </div>

            {/* 태어난 시간 */}
            <div className="flex flex-col gap-3">
              <label
                className="flex items-center justify-between py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
                style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
              >
                <span>나의 태어난 시간</span>
                <button
                  type="button"
                  onClick={() => setUnknownTime(!unknownTime)}
                  className="flex cursor-pointer items-center justify-center gap-1 leading-none tracking-[-2.5%]"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    {unknownTime ? (
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM13.707 8.707C13.8892 8.5184 13.99 8.2658 13.9877 8.0036C13.9854 7.7414 13.8802 7.49059 13.6948 7.30518C13.5094 7.11977 13.2586 7.0146 12.9964 7.01233C12.7342 7.01005 12.4816 7.11084 12.293 7.293L9 10.586L7.707 9.293C7.5184 9.11084 7.2658 9.01005 7.0036 9.01233C6.7414 9.0146 6.49059 9.11977 6.30518 9.30518C6.11977 9.49059 6.0146 9.7414 6.01233 10.0036C6.01005 10.2658 6.11084 10.5184 6.293 10.707L8.293 12.707C8.48053 12.8945 8.73484 12.9998 9 12.9998C9.26516 12.9998 9.51947 12.8945 9.707 12.707L13.707 8.707Z" fill="#FFFFFF" />
                    ) : (
                      <path d="M7.333 10L9.111 11.778L12.667 8.222M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z" stroke="#A1A1A1" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                  <div className={`font-pretendard text-sm font-medium leading-none ${unknownTime ? "text-white" : "text-[#A1A1A1]"}`}>시간모름</div>
                </button>
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none font-pretendard text-base leading-none tracking-[-2.5%] placeholder:text-[#757575] focus:outline-none h-10 border-b border-b-[#E1E1E1] bg-transparent px-1 font-medium text-[#757575] rounded-none"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  disabled={unknownTime}
                >
                  {timeOptions.map((opt) => (
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

            {/* 성별 */}
            <div className="flex flex-col gap-3">
              <label
                className="py-0.5 pl-1 font-pretendard text-base font-semibold leading-none tracking-[-2.5%] text-[#FFFFFF]"
                style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}
              >
                성별
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  className={`flex flex-1 items-center justify-center rounded-[0.625rem] border font-pretendard leading-none tracking-[-2.5%] focus:outline-none h-12 ${
                    gender === "male"
                      ? "bg-[#04336D] border-[#04336D] text-white font-semibold"
                      : "border-white font-medium text-[#E1E1E1]"
                  }`}
                >
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setGender("female")}
                  className={`flex flex-1 items-center justify-center rounded-[0.625rem] border font-pretendard leading-none tracking-[-2.5%] focus:outline-none h-12 ${
                    gender === "female"
                      ? "bg-[#04336D] border-[#04336D] text-white font-semibold"
                      : "border-white font-medium text-[#E1E1E1]"
                  }`}
                >
                  여성
                </button>
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    );
  }

  // ===== MIDDLE =====
  if (step === "middle") {
    return (
      <StepLayout
        bgType="image"
        bgSrc={stepImages.middle}
        bottomGradient={{ height: 150 }}
        buttons={
          <>
            <PrevButton onClick={() => goTo("step_info")} />
            <CTAButton onClick={() => goTo("step_1")}>
              응, 어떤걸 알려줄까?
            </CTAButton>
          </>
        }
      >
        <div />
      </StepLayout>
    );
  }

  // ===== STEP1 (2/3) =====
  if (step === "step1") {
    return (
      <StepLayout
        bgType="image"
        bgSrc={stepImages.step1}
        topGradient={{ height: 238, from: "rgb(17, 17, 17)" }}
        bottomGradient={{ height: 450 }}
        stepIndicator={{ current: 2, total: 3 }}
        headerContent={
          <div className="mt-5">
            <div className="relative flex items-center gap-3">
              <h2
                className="relative flex items-center gap-3 font-pretendard text-lg font-semibold leading-[1] tracking-[-0.45px] [text-shadow:rgba(0,0,0,0.35)_0px_0px_6px] before:absolute before:left-[-12px] before:block before:h-4 before:w-[2px] before:rounded-full before:bg-[#04336D] before:content-['']"
              >
                청월
              </h2>
            </div>
            <p className="mt-2 whitespace-pre-line font-pretendard text-base leading-[1.5] tracking-[-0.4px] [text-shadow:rgba(0,0,0,0.25)_0px_0px_4px]">
              {`혹시 지금 만나는 분이 있으세요?\n연애 중이신지 궁금해요!`}
            </p>
          </div>
        }
        buttons={
          <>
            <PrevButton onClick={() => goTo("step_middle")} />
            <CTAButton onClick={() => goTo("step_2")}>다음으로</CTAButton>
          </>
        }
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between py-0.5 pl-1 font-pretendard font-semibold tracking-[-2.5%] text-[#FFFFFF] text-lg" style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}>
              현재 연애 중이신가요? <span className="text-sm font-normal leading-none">(선택)</span>
            </label>
            <div className="relative">
              <select
                className="appearance-none font-pretendard text-base leading-none tracking-[-2.5%] focus:outline-none h-12 rounded-[0.652rem] border border-[#E1E1E1] bg-white/80 pl-3 pr-11 backdrop-blur-[8px] font-medium text-[#757575] w-full text-left"
                value={loveStatus}
                onChange={(e) => setLoveStatus(e.target.value)}
              >
                <option value="">연애 상태</option>
                <option value="dating">연애중</option>
                <option value="solo">솔로</option>
                <option value="married">기혼</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {loveStatus && (
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between py-0.5 pl-1 font-pretendard font-semibold tracking-[-2.5%] text-[#FFFFFF] text-lg" style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}>
                연애/솔로 기간이 어떻게 되나요? <span className="text-sm font-normal leading-none">(선택)</span>
              </label>
              <div className="relative">
                <select
                  className="appearance-none font-pretendard text-base leading-none tracking-[-2.5%] focus:outline-none h-12 rounded-[0.652rem] border border-[#E1E1E1] bg-white/80 pl-3 pr-11 backdrop-blur-[8px] font-medium text-[#757575] w-full text-left"
                  value={loveDuration}
                  onChange={(e) => setLoveDuration(e.target.value)}
                >
                  <option value="">진행 기간</option>
                  <option value="lt1">1년 미만</option>
                  <option value="1to3">1년 이상 ~ 3년 미만</option>
                  <option value="3to5">3년 이상 ~ 5년 미만</option>
                  <option value="gt5">5년 이상</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#757575" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </StepLayout>
    );
  }

  // ===== STEP2 (3/3) =====
  if (step === "step2") {
    return (
      <StepLayout
        bgType="image"
        bgSrc={stepImages.step2}
        topGradient={{ height: 238, from: "rgb(17, 17, 17)" }}
        bottomGradient={{ height: 450 }}
        stepIndicator={{ current: 3, total: 3 }}
        headerContent={
          <div className="mt-5">
            <div className="relative flex items-center gap-3">
              <h2 className="relative flex items-center gap-3 font-pretendard text-lg font-semibold leading-[1] tracking-[-0.45px] [text-shadow:rgba(0,0,0,0.35)_0px_0px_6px] before:absolute before:left-[-12px] before:block before:h-4 before:w-[2px] before:rounded-full before:bg-[#04336D] before:content-['']">
                청월
              </h2>
            </div>
            <p className="mt-2 whitespace-pre-line font-pretendard text-base leading-[1.5] tracking-[-0.4px] [text-shadow:rgba(0,0,0,0.25)_0px_0px_4px]">
              {`고민이나 중요한 일이 있으신가요?\n제게 알려주시면, 정성껏 답변해 드릴게요.`}
            </p>
          </div>
        }
        buttons={
          <>
            <PrevButton onClick={() => goTo("step_1")} />
            <CTAButton onClick={() => router.push("/s/bluemoonladysaju/result")}>
              결과 보러가기
            </CTAButton>
          </>
        }
      >
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between py-0.5 pl-1 font-pretendard font-semibold tracking-[-2.5%] text-[#FFFFFF] text-lg" style={{ textShadow: "rgb(0, 0, 0) 0px 4px 20px" }}>
              청월아씨에게 궁금한 점을 물어보세요. <span className="text-sm font-normal leading-none">(선택)</span>
            </label>
            <div>
              <textarea
                className="block w-full resize-none px-3 py-4 tracking-[-2.5%] placeholder:whitespace-pre-line focus:outline-none h-[160px] rounded-[10px] border border-white/20 bg-white/80 text-base font-medium leading-[1.5] text-[#111111] backdrop-blur-sm placeholder:font-medium placeholder:text-[#757575]"
                maxLength={200}
                placeholder="정성껏 답변 해 드리오니, 꼼꼼하게 작성해 주세요"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="mt-2 w-full pr-1 text-right font-pretendard text-xs font-normal leading-none tracking-[-2.5%] text-[#E1E1E1]">
                {question.length}/200
              </div>
            </div>
          </div>
        </div>
      </StepLayout>
    );
  }

  return null;
}

export default function BluemoonPage() {
  return (
    <Suspense>
      <BluemoonContent />
    </Suspense>
  );
}
