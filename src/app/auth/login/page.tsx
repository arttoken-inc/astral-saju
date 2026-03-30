import type { Metadata } from "next";
import { signIn } from "@/auth";

export const metadata: Metadata = {
  title: "로그인 | 청월당 사주",
};

export default function LoginPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex min-h-[100dvh] max-w-md items-center">
        <div className="-mt-16 w-full">
          {/* 로그인 이미지 */}
          <div className="mx-auto mb-12 px-8">
            <div className="relative" style={{ aspectRatio: "933 / 942" }}>
              <img
                className="h-full w-full object-cover"
                alt="login"
                src="https://cdn.aifortunedoctor.com/web/live/current/images/auth/login/default.png"
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="px-6 space-y-3">
            {/* 구글 로그인 */}
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/auth/loading" });
              }}
            >
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-[0.625rem] border border-[#dadce0] bg-white font-pretendard text-base font-bold text-[#3c4043]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Google로 로그인/가입
              </button>
            </form>

            {/* 카카오 버튼 */}
            <button className="flex h-12 w-full items-center justify-center gap-2 rounded-[0.625rem] bg-[#FEE500]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-black"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.98064 0C4.29499 0 0.5 3.07389 0.5 6.81773C0.5 9.26108 2.0877 11.3892 4.44989 12.6108L3.63667 15.6453C3.59795 15.7241 3.63667 15.8424 3.71412 15.9212C3.75285 15.9606 3.8303 16 3.86902 16C3.90774 16 3.98519 15.9606 4.02392 15.9606L7.47039 13.5961C7.9738 13.6749 8.47722 13.7143 9.01936 13.7143C13.705 13.7143 17.5 10.6404 17.5 6.89655C17.5 3.07389 13.705 0 8.98064 0Z"
                  fill="currentColor"
                />
              </svg>
              <span className="font-pretendard text-base font-bold text-[#191600]">
                카카오로 로그인/가입
              </span>
            </button>

            {/* 전화번호 로그인 */}
            <button className="mx-auto block w-fit font-pretendard font-normal text-[#424242] underline underline-offset-2">
              전화번호로 로그인/가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
