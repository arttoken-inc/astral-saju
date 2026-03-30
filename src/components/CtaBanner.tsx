import { cdnUrl } from "@/lib/cdn";

export default function CtaBanner({ replayMobileImg, replayPcImg }: { replayMobileImg: string; replayPcImg: string }) {
  return (
    <a className="my-10 block md:my-[3.75rem]" href="/replay">
      <img
        className="block h-[3.25rem] w-full rounded-[0.625rem] object-cover shadow-lg md:hidden"
        alt="내 분석 결과 다시 보러가기"
        src={cdnUrl(replayMobileImg)}
      />
      <img
        className="hidden h-20 w-full rounded-[0.625rem] object-cover shadow-lg md:block"
        alt="내 분석 결과 다시 보러가기"
        src={cdnUrl(replayPcImg)}
      />
    </a>
  );
}
