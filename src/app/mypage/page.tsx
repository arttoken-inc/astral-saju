import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import Image from "next/image";
import { cdnUrl } from "@/lib/cdn";
import ProfileCard from "./ProfileCard";

export const metadata: Metadata = {
  title: "마이 페이지 | 청월당 사주",
};

export default async function MyPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="bg-white">
      {/* 헤더 - X 닫기 버튼 + 하단 보더 */}
      <header className="fixed inset-x-0 top-0 z-50 mx-auto flex h-[3.75rem] max-w-md items-center justify-between border-b border-[#E1E1E1] bg-white px-4">
        <a href="/">
          <Image
            src="/logos/logo_with_black_typo.png"
            alt="청월당"
            width={120}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </a>
        <a href="/" aria-label="마이페이지 닫기">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7L7 21M7 7L21 21" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </a>
      </header>

      <main className="mx-auto max-w-md pt-[3.75rem]">
        {/* 내 프로필 */}
        <section className="mt-8 px-5">
          <h3 className="font-pretendard text-2xl font-semibold leading-[130%] tracking-[-0.025em] text-[#111111]">
            내 프로필
          </h3>

          <ProfileCard userName={user?.name} />
        </section>

        {/* 나의 친구 */}
        <section className="mb-8 mt-8 px-5">
          <h4 className="font-pretendard text-base font-semibold text-[#111111]">
            나의 친구 <span className="text-[#757575]">0/10</span>
          </h4>
          <div className="mt-4">
            <button className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border border-dashed border-[#E1E1E1]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="#E1E1E1" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </section>

        {/* 내 사주 결과 다시보기 배너 */}
        <div className="mb-10 w-full px-5">
          <Link href="/replay">
            <img
              src={cdnUrl("replay/replay_banner.png")}
              alt="내 사주 결과 다시보기"
              className="w-full rounded-[0.3125rem] border border-[#F1F1F1] shadow-[0px_4px_20px_0px_#0000001A]"
            />
          </Link>
        </div>

        {/* 구분선 */}
        <div className="mx-5 border-b border-[#E1E1E1]" />

        {/* 카카오톡 문의 */}
        <div className="flex flex-col items-center py-8">
          <a
            href="https://pf.kakao.com/_cheongwoldang"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-[0.625rem] bg-[#FEE500] px-5 py-4"
          >
            <svg width="18" height="18" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.98064 0C4.29499 0 0.5 3.07389 0.5 6.81773C0.5 9.26108 2.0877 11.3892 4.44989 12.6108L3.63667 15.6453C3.59795 15.7241 3.63667 15.8424 3.71412 15.9212C3.75285 15.9606 3.8303 16 3.86902 16C3.90774 16 3.98519 15.9606 4.02392 15.9606L7.47039 13.5961C7.9738 13.6749 8.47722 13.7143 9.01936 13.7143C13.705 13.7143 17.5 10.6404 17.5 6.89655C17.5 3.07389 13.705 0 8.98064 0Z"
                fill="#111111"
              />
            </svg>
            <span className="font-pretendard text-sm font-bold text-[#111111]">카카오톡 문의</span>
          </a>
          <p className="mt-3 font-pretendard text-sm text-[#757575]">
            운영시간 평일 09:00~18:00
          </p>
        </div>

        {/* 두꺼운 구분선 */}
        <div className="mb-7 mt-2 border-b-4 border-[#F1F1F1]" />

        {/* 계정 설정 */}
        <section className="mb-28 px-5">
          <h4 className="font-pretendard text-base font-semibold text-[#111111]">
            계정 설정
          </h4>

          {/* 휴대폰 번호 / 이메일 */}
          <div className="mt-4 flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.93 13.21 17.38L15.41 15.18C15.68 14.91 16.08 14.82 16.43 14.94C17.55 15.31 18.76 15.51 20 15.51C20.55 15.51 21 15.96 21 16.51V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="#A1A1A1" />
              </svg>
              <div>
                <div className="font-pretendard text-sm font-normal text-[#111111]">휴대폰 번호</div>
                <div className="font-pretendard text-sm text-[#424242]">{user?.email || ""}</div>
              </div>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* 구분선 */}
          <div className="mb-6 mt-4 border-b border-[#E1E1E1]" />

          {/* 로그아웃 */}
          <div className="flex justify-center">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="font-pretendard text-xs font-semibold text-[#757575] underline underline-offset-2"
              >
                로그아웃하기
              </button>
            </form>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="w-full bg-[#F7F9FA] px-4 py-10">
          <div className="flex flex-col items-center">
            <Image
              src="/logos/logo_with_black_typo.png"
              alt="청월당"
              width={100}
              height={20}
              className="mb-4 h-5 w-auto"
            />
            <div className="text-center font-pretendard text-[0.625rem] leading-relaxed text-[#A1A1A1]">
              <p>상호 로켓AI | 대표이사 임재운</p>
              <p>광교중앙로 338 경기우미뉴브 지식산업센터 A-704</p>
              <p className="mt-2">통신판매업 신고 2022-용인수지-1749</p>
              <p>사업자등록번호 680-02-02623</p>
            </div>
            <div className="mt-4 font-pretendard text-[0.625rem] text-[#A1A1A1]">
              고객상담{" "}
              <a href="https://pf.kakao.com/_cheongwoldang" target="_blank" rel="noopener noreferrer" className="underline">
                카카오톡 청월당 채널
              </a>
              {" | "}MAIL contact@rocketai.kr
            </div>
            <div className="mt-4 flex gap-3 font-pretendard text-xs text-[#757575]">
              <a href="/terms" className="underline">이용약관</a>
              <a href="/privacy" className="underline">개인정보처리방침</a>
            </div>
            <p className="mt-2 font-pretendard text-xs text-[#757575]">
              Copyright &copy; 2024 RocketAI - All right reserved
            </p>
            <div className="mt-4 flex gap-3">
              <a href="https://pf.kakao.com/_cheongwoldang" target="_blank" rel="noopener noreferrer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EAED]">
                  <svg width="20" height="20" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.98064 0C4.29499 0 0.5 3.07389 0.5 6.81773C0.5 9.26108 2.0877 11.3892 4.44989 12.6108L3.63667 15.6453C3.59795 15.7241 3.63667 15.8424 3.71412 15.9212C3.75285 15.9606 3.8303 16 3.86902 16C3.90774 16 3.98519 15.9606 4.02392 15.9606L7.47039 13.5961C7.9738 13.6749 8.47722 13.7143 9.01936 13.7143C13.705 13.7143 17.5 10.6404 17.5 6.89655C17.5 3.07389 13.705 0 8.98064 0Z"
                      fill="#AEB2BA"
                    />
                  </svg>
                </div>
              </a>
              <a href="https://www.instagram.com/cheongwoldang" target="_blank" rel="noopener noreferrer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8EAED]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 17.7383 21.3889 19.2135 20.3012 20.3012C19.2135 21.3889 17.7383 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 6.26174 2.61107 4.78649 3.69878 3.69878C4.78649 2.61107 6.26174 2 7.8 2ZM7.6 4C6.64522 4 5.72955 4.37928 5.05442 5.05442C4.37928 5.72955 4 6.64522 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C17.3548 20 18.2705 19.6207 18.9456 18.9456C19.6207 18.2705 20 17.3548 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6ZM17.25 5.5C17.5815 5.5 17.8995 5.6317 18.1339 5.86612C18.3683 6.10054 18.5 6.41848 18.5 6.75C18.5 7.08152 18.3683 7.39946 18.1339 7.63388C17.8995 7.8683 17.5815 8 17.25 8C16.9185 8 16.6005 7.8683 16.3661 7.63388C16.1317 7.39946 16 7.08152 16 6.75C16 6.41848 16.1317 6.10054 16.3661 5.86612C16.6005 5.6317 16.9185 5.5 17.25 5.5ZM12 7C13.3261 7 14.5979 7.52678 15.5355 8.46447C16.4732 9.40215 17 10.6739 17 12C17 13.3261 16.4732 14.5979 15.5355 15.5355C14.5979 16.4732 13.3261 17 12 17C10.6739 17 9.40215 16.4732 8.46447 15.5355C7.52678 14.5979 7 13.3261 7 12C7 10.6739 7.52678 9.40215 8.46447 8.46447C9.40215 7.52678 10.6739 7 12 7ZM12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" fill="#AEB2BA" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
