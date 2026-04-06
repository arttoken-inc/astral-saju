import { cdnUrl } from "@/lib/cdn";

export default function PromoSection({ videoSrc }: { videoSrc: string }) {
  return (
    <section className="flex flex-col items-center">
      <div className="mb-2 inline-flex h-[27px] items-center rounded-full border border-[#F1F1F1] px-3">
        <span className="font-pretendard text-[10px] text-[#424242]">
          THE HYUNDAI &amp; 청월당
        </span>
      </div>
      <h3 className="mb-3.5 text-center font-pretendard text-[18px] font-bold leading-[1.3] text-[#111111]">
        &#39;더현대&#39;를 사로잡은 대한민국 1위 사주
      </h3>
      <video
        className="w-full"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={cdnUrl(videoSrc)} type="video/webm" />
      </video>
      <p className="mt-5 text-center font-pretendard text-[14px] text-[#838383]">
        무려 <b className="font-bold text-[#838383]">13,745명</b>이 방문한
        <br />
        압도적인 <b className="font-bold text-[#838383]">적중률</b>, 청월당 사주
      </p>
    </section>
  );
}
