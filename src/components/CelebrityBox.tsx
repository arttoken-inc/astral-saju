import { cdnUrl } from "@/lib/cdn";
import type { LandingCelebrity } from "@/lib/configLoader";

export default function CelebrityBox({ celebrities }: { celebrities: LandingCelebrity[] }) {
  return (
    <div className="w-full xl:flex-1">
      <h2 className="mb-5 font-pretendard text-[20px] font-semibold text-[#111111] md:mb-7 md:text-[32px]">
        유명인 사주 구경하기
      </h2>
      <div className="w-full rounded-[0.625rem] border border-[#E1E1E1] bg-white px-5 pb-8 pt-8 shadow-md md:px-7 xl:pb-6">
        <div>
          {celebrities.map((celeb, i) => (
            <a
              key={celeb.href}
              className={`flex w-full items-center gap-5 ${
                i === 1
                  ? "my-5 border-b border-t border-[#F1F1F1] py-4 md:py-5"
                  : ""
              }`}
              href={celeb.href}
            >
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-[10px] object-cover"
                  alt={celeb.name}
                  src={cdnUrl(celeb.img)}
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="mb-1 font-pretendard text-base font-semibold text-[#111111]">
                  {celeb.title}
                </h4>
                <p className="line-clamp-2 font-pretendard text-sm font-normal text-[#424242]">
                  {celeb.body}
                </p>
              </div>
            </a>
          ))}
        </div>
        <a
          className="mx-auto mt-5 flex h-12 w-full max-w-[19rem] items-center justify-center rounded-[0.625rem] bg-[#F1F1F1] font-pretendard text-[16px] font-semibold text-[#111111]"
          href="/p/c"
        >
          유명인 사주 더 보기
        </a>
      </div>
    </div>
  );
}
