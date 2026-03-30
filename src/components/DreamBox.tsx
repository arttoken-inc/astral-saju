import type { LandingDreamPost } from "@/lib/configLoader";

export default function DreamBox({ posts }: { posts: LandingDreamPost[] }) {
  return (
    <div className="w-full xl:flex-1">
      <h2 className="mb-5 font-pretendard text-[20px] font-semibold text-[#111111] md:mb-7 md:text-[32px]">
        꿈 해몽 백과사전
      </h2>
      <div className="w-full rounded-[0.625rem] border border-[#E1E1E1] bg-white px-5 pb-8 pt-8 shadow-md md:px-7 xl:pb-6">
        <div>
          {posts.map((post, i) => (
            <a
              key={post.href}
              className={`block w-full ${
                i === 1
                  ? "my-5 border-b border-t border-[#F1F1F1] py-4 md:py-5"
                  : ""
              }`}
              href={post.href}
            >
              <h4 className="mb-3 line-clamp-1 font-pretendard text-base font-semibold leading-none text-[#111111] md:text-xl md:font-bold">
                {post.title}
              </h4>
              <p className="line-clamp-2 font-pretendard text-sm font-normal text-[#424242] md:text-base">
                {post.body}
              </p>
            </a>
          ))}
        </div>
        <a
          className="mx-auto mt-5 flex h-12 w-full max-w-[19rem] items-center justify-center rounded-[0.625rem] bg-[#F1F1F1] font-pretendard text-[16px] font-semibold text-[#111111]"
          href="/dream"
        >
          다양한 해몽 보러가기
        </a>
      </div>
    </div>
  );
}
