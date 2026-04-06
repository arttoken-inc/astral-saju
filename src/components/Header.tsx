"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

const categories = [
  { label: "전체", href: "/" },
  { label: "종합", href: "/category/general" },
  { label: "연애", href: "/category/love" },
  { label: "재물/커리어", href: "/category/wealth-career" },
  { label: "궁합", href: "/category/compatibility" },
  { label: "기타", href: "/category/others" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="mx-auto flex h-[60px] max-w-[448px] items-center justify-between px-5">
        <a className="flex h-6 items-center gap-2" href="/">
          <Image
            src="/logos/logo_with_black_typo.png"
            alt="logo"
            width={83}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </a>
        <a
          className="flex h-7 w-7 items-center justify-center"
          aria-label="마이페이지로 이동"
          href="/mypage"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <nav aria-label="홈 카테고리" className="h-11">
        <div className="mx-auto flex max-w-[448px] justify-between px-5">
          {categories.map((cat) => {
            const isActive = pathname === cat.href;
            return (
              <a
                key={cat.href}
                href={cat.href}
                className={`whitespace-nowrap px-2 pt-3 font-pretendard text-[16px] leading-4 transition ${
                  isActive
                    ? "border-b-2 border-[#111111] pb-3.5 font-bold text-[#111111]"
                    : "pb-4 font-medium text-[#424242]"
                }`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
