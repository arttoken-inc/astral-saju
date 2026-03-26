"use client";

interface HeaderProps {
  isDark?: boolean;
}

export default function Header({ isDark = true }: HeaderProps) {
  const logoSrc = isDark
    ? "/logos/logo_with_white_typo.png"
    : "/logos/logo_with_black_typo.png";
  const iconColor = isDark ? "text-white" : "text-[#111111]";

  return (
    <header className="inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] md:h-20 absolute bg-transparent">
      <div className="flex w-full items-center justify-between px-5 md:px-10 xl:max-w-7xl xl:px-5">
        <a className="flex items-center gap-2" href="/">
          <img
            src={logoSrc}
            alt="logo"
            className="h-6 w-auto md:h-8"
          />
        </a>
        <div className="flex items-center gap-1">
          <a
            className={`flex h-7 w-7 items-center justify-center md:h-10 md:w-10 ${iconColor}`}
            aria-label="마이페이지로 이동"
            href="/mypage"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
