import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F7F9FA] px-4 py-10 md:px-10 md:py-[60px]">
      <div className="w-full xl:mx-auto xl:max-w-[77.5rem]">
        <Image
          src="/logos/logo_with_black_typo.png"
          alt="logo"
          width={120}
          height={32}
          className="mx-auto mb-7 h-6 w-auto md:mx-0 md:mb-9 md:h-8"
          loading="lazy"
        />
        <div className="flex flex-col items-center justify-center gap-3 font-pretendard text-[0.625rem] text-[#A1A1A1] md:items-start md:text-xs">
          <div className="flex flex-col items-center gap-1 md:flex-row md:items-start md:gap-0">
            <div className="flex items-center gap-2">
              <span>
                <strong className="font-bold text-[#A1A1A1]">상호</strong>{" "}
                로켓AI
              </span>
              <span>
                <strong className="font-bold text-[#A1A1A1]">대표이사</strong>{" "}
                임재훈
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline md:mx-2">|</span>
              <span>광교중앙로 338 광교우미뉴브 지식산업센터 A-704</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 md:flex-row md:gap-0">
            <span>
              <strong className="font-bold text-[#A1A1A1]">
                통신판매업 신고
              </strong>{" "}
              2022-용인수지-1749
            </span>
            <span className="hidden md:inline md:mx-2">|</span>
            <span>
              <strong className="font-bold text-[#A1A1A1]">
                사업자등록번호
              </strong>{" "}
              680-02-02623
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 md:flex-row md:gap-0">
            <span>
              <strong className="font-bold text-[#A1A1A1]">고객상담</strong>{" "}
              <a
                href="http://pf.kakao.com/_xaEHxbG/chat"
                className="text-[#A1A1A1] underline"
              >
                카카오톡 청월당 채널
              </a>
            </span>
            <span className="hidden md:inline md:mx-2">|</span>
            <span>
              <strong className="font-bold text-[#A1A1A1]">MAIL</strong>{" "}
              <a
                href="mailto:contact@rocketai.kr"
                className="text-[#A1A1A1] underline"
              >
                contact@rocketai.kr
              </a>
            </span>
          </div>
        </div>

        <div className="mt-8 md:mt-10 md:flex md:flex-row-reverse md:justify-between">
          <div>
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <a
                href="/policy/service"
                className="font-pretendard text-[12px] font-semibold text-[#757575]"
              >
                이용약관
              </a>
              <a
                href="/policy/privacy"
                className="font-pretendard text-[12px] font-semibold text-[#757575]"
              >
                개인정보처리방침
              </a>
            </div>
            <p className="mt-2 text-center font-pretendard text-[12px] text-[#A1A1A1] md:text-left">
              Copyright © 2024 RocketAI - All right reserved
            </p>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 md:mt-0 md:justify-end">
            <a href="https://pf.kakao.com/_xaEHxbG">
              <svg
                className="h-10 w-10 md:h-12 md:w-12"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#AEB2BA" />
                <path
                  d="M20 11C14.477 11 10 14.383 10 18.5C10 21.12 11.784 23.426 14.5 24.756L13.5 28.5C13.457 28.666 13.574 28.834 13.75 28.834C13.834 28.834 13.916 28.799 13.974 28.736L18.084 25.732C18.709 25.816 19.35 25.86 20 25.86C25.523 25.86 30 22.477 30 18.36C30 14.243 25.523 11 20 11Z"
                  fill="white"
                />
              </svg>
            </a>
            <a href="https://www.instagram.com/bluemoon_saju">
              <svg
                className="h-10 w-10 md:h-12 md:w-12"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="40" height="40" rx="20" fill="#AEB2BA" />
                <path
                  d="M7.88892 25.7777V15.111C7.88892 11.2267 11.0046 8.11108 14.8889 8.11108H25.5556C29.4399 8.11108 32.5556 11.2267 32.5556 15.111V25.7777C32.5556 29.662 29.4399 32.7777 25.5556 32.7777H14.8889C11.0046 32.7777 7.88892 29.662 7.88892 25.7777Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx="20.2222"
                  cy="20.4445"
                  r="5.33333"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle cx="27" cy="13.4445" r="1.33333" fill="white" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
