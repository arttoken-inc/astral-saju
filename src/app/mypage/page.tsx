import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이 페이지 | 청월당 사주",
};

export default function MyPage() {
  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-white px-5 pt-16">
      <h1 className="font-pretendard text-2xl font-bold text-[#111111]">
        마이페이지
      </h1>
      <p className="mt-4 font-pretendard text-base text-[#757575]">
        로그인 후 이용 가능합니다.
      </p>
    </div>
  );
}
