export default function ResultLoading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#F3F2EF]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#04336D]" />
      <p className="mt-4 font-pretendard text-sm text-gray-500">
        사주를 분석하고 있습니다...
      </p>
    </div>
  );
}
