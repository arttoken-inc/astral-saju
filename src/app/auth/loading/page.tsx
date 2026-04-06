"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="bg-white">
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[3.75rem] max-w-md items-center justify-between bg-white px-4">
        <a href="/">
          <img
            src="/logos/logo_with_black_typo.png"
            alt="청월당"
            className="h-6"
          />
        </a>
        <a href="/mypage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#111111" />
          </svg>
        </a>
      </header>

      {/* 로딩 콘텐츠 */}
      <main className="mx-auto max-w-md">
        <div className="flex min-h-[100dvh] flex-col items-center justify-center text-center font-pretendard">
          {/* 로딩 dots 애니메이션 */}
          <div className="h-20 w-20">
            <svg viewBox="0 0 120 40" className="h-full w-full">
              <circle cx="20" cy="20" r="8" fill="#2A547D">
                <animate attributeName="r" values="8;5;8" dur="1s" repeatCount="indefinite" begin="0s" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0s" />
              </circle>
              <circle cx="60" cy="20" r="8" fill="#2A547D">
                <animate attributeName="r" values="8;5;8" dur="1s" repeatCount="indefinite" begin="0.2s" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0.2s" />
              </circle>
              <circle cx="100" cy="20" r="8" fill="#2A547D">
                <animate attributeName="r" values="8;5;8" dur="1s" repeatCount="indefinite" begin="0.4s" />
                <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" begin="0.4s" />
              </circle>
            </svg>
          </div>

          <div className="-mt-4 mb-4 text-2xl font-semibold leading-none text-[#111111]">
            로그인을 처리하고 있습니다.
          </div>
          <div className="text-base leading-none text-[#424242]">
            잠시만 기다려주세요.
          </div>

          <div className="h-12 w-full md:h-24" />
        </div>
      </main>
    </div>
  );
}
