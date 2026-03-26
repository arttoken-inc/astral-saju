"use client";

import {
  sajuResult,
  resultImages,
  resultBubbleImages,
  resultHyundaiImages,
  decorations,
  destinyPartner,
  crisisList,
} from "@/data/bluemoonladysaju";
import SajuTable from "@/components/saju/SajuTable";
import DaeunTable from "@/components/saju/DaeunTable";
import OhaengSection from "@/components/saju/OhaengSection";

const n = sajuResult.nameShort;

function ResultHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] bg-white mx-auto max-w-md">
      <div className="flex w-full items-center justify-between px-5">
        <a className="flex items-center gap-2" href="/">
          <img src="/logos/logo_with_black_typo.png" alt="logo" className="h-6 w-auto" />
        </a>
        <a className="flex h-7 w-7 items-center justify-center text-[#111111]" href="/mypage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}

function FullWidthImg({ alt, src }: { alt: string; src: string }) {
  return (
    <div className="relative">
      <img className="w-full" alt={alt} src={src} />
    </div>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return <div className="w-full px-3">{children}</div>;
}

export default function ResultPage() {
  return (
    <>
      <ResultHeader />
      <main className="mx-auto max-w-md pt-[3.75rem]">
        <div className="bg-[#F3F2EF]">
          {/* 1. result_0 + 인사 텍스트 */}
          <div className="relative">
            <img className="w-full" alt="result_0" src={resultImages[0]} />
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ left: "29%", top: "36.1%", transform: "translateX(-50%) translateY(-50%)" }}>
              {n}님,<br />만나서 반가워요,
            </p>
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "34.4%", top: "46.8%", transform: "translateX(50%) translateY(-50%)" }}>
              지금부터 {n}님의<br />사주를 풀어드릴<br />청월이라고 합니다.
            </p>
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ left: "39.5%", bottom: "12.4%", transform: "translateX(-50%) translateY(50%)" }}>
              {n}님과 제가<br />이렇게 인연이 닿아
            </p>
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "31.3%", bottom: "5.5%", transform: "translateX(50%) translateY(50%)" }}>
              이야기를<br />풀어드리게 되어<br />정말 기쁘네요
            </p>
          </div>

          {/* 2. result_1 */}
          <FullWidthImg alt="result_1" src={resultImages[1]} />

          {/* 3. result_2 + 텍스트 */}
          <div className="relative">
            <img className="w-full" alt="result_2" src={resultImages[2]} />
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "34.6%", top: "16.8%", transform: "translateX(50%) translateY(-50%)" }}>
              먼저 제가<br />{n}님의 사주를<br />보기 쉽게 정리했어요
            </p>
          </div>

          {/* 4. 사주표 카드 */}
          <div className="relative mt-36">
            <img
              alt="result_bubble_0"
              src={resultBubbleImages[0]}
              className="mx-auto mb-4 w-[252px]"
            />
            <CardWrapper>
              <SajuTable />
            </CardWrapper>
          </div>

          {/* 5. 대운표 카드 */}
          <div className="relative mt-40">
            <img
              alt="result_bubble_1"
              src={resultBubbleImages[1]}
              className="mx-auto mb-4 w-[237px]"
            />
            <CardWrapper>
              <DaeunTable />
            </CardWrapper>
            <img
              alt="result_bubble_2"
              src={resultBubbleImages[2]}
              className="mx-auto mt-4 w-[248px]"
            />
          </div>

          {/* 6. 오행/용신 카드 */}
          <div className="relative mb-10 mt-80">
            <img
              alt="result_bubble_3"
              src={resultBubbleImages[3]}
              className="mx-auto mb-4 w-[288px]"
            />
            <CardWrapper>
              <OhaengSection />
            </CardWrapper>
          </div>

          {/* 7. result_3 + 텍스트 */}
          <div className="relative">
            <img className="w-full" alt="result_3" src={resultImages[3]} />
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "34.6%", top: "28.9%", transform: "translateX(50%) translateY(-50%)" }}>
              조금 비밀스러운<br />이야기지만,
            </p>
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "34.5%", bottom: "9.4%", transform: "translateX(50%) translateY(50%)" }}>
              {n}님의 사주에는<br />이런 내용들이<br />보이네요
            </p>
          </div>

          {/* 8. 말풍선 */}
          <div className="mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md">
            애정운에서는 {n}님이 앞으로 만나게 될<br />운명의 짝이 보이고..
          </div>

          {/* 9. 운명의 짝 카드 */}
          <CardWrapper>
            <div className="relative h-full border-[3px] border-[#1B2F49] bg-[#F5F3EC] shadow-md">
              <div className="absolute top-2 h-[1px] w-full bg-[#2B557E]" />
              <div className="absolute bottom-2 h-[1px] w-full bg-[#2B557E]" />
              <div className="absolute left-2 h-full w-[1px] bg-[#2B557E]" />
              <div className="absolute right-2 h-full w-[1px] bg-[#2B557E]" />
              <div className="absolute z-0 mt-6 flex w-full justify-between px-2">
                <img alt="left_cloud_decoration" className="mt-5 h-[2.375rem] w-[3.5rem]" src={decorations.leftCloud} />
                <img alt="right_cloud_decoration" className="mb-5 h-[2.375rem] w-[3.5rem]" src={decorations.rightCloud} />
              </div>
              <div className="relative" style={{ zIndex: 1 }}>
                <div className="px-5 py-10">
                  <h3 className="text-center font-gapyeong text-xl font-bold leading-none">
                    {n}님의 운명의 짝
                  </h3>
                  <div className="mx-2 mb-10 mt-10 overflow-hidden rounded-3xl border-4 border-[#BDCEED]">
                    <div className="relative w-full" style={{ aspectRatio: "295 / 446" }}>
                      <img className="h-full w-full object-cover" alt="dream person image" src={decorations.dreamPerson} />
                    </div>
                  </div>
                  <div className="w-full border-b border-[#A1A1A1]" />
                  <div className="mt-10 space-y-6 px-4">
                    {[
                      { label: "직업", tags: [destinyPartner.job] },
                      { label: "외모", tags: destinyPartner.appearance },
                      { label: "성격", tags: destinyPartner.personality },
                      { label: "특징", tags: destinyPartner.traits },
                    ].map((section) => (
                      <div key={section.label} className="space-y-3">
                        <div className="font-pretendard text-base font-semibold leading-none">
                          {section.label}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {section.tags.map((tag) => (
                            <div
                              key={tag}
                              className="rounded-full border border-[#486493] bg-[#BDCEED]/20 px-3 py-2 font-pretendard text-sm font-semibold text-[#2B557E]"
                            >
                              {tag}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardWrapper>

          <div className="h-0 w-full" />

          {/* 11. 재산 그래프 */}
          <div className="relative mb-10 mt-28 px-3">
            <div className="mx-auto mb-5 mt-10 w-fit border border-black bg-white px-4 py-3 text-center font-gapyeong text-base leading-[150%] shadow-md">
              {n}님이 앞으로 얼마나 많은 재물을<br />잃거나 얻게 될지도 보이고요,
            </div>
            <div className="text-center font-gapyeong text-base font-bold">
              {n}님의 시기별 재산
            </div>
            <img alt="masked-wealth-graph" className="mt-4 w-full" src={decorations.maskedWealthGraph} />
          </div>

          {/* 12. result_4 */}
          <FullWidthImg alt="result_4" src={resultImages[4]} />

          {/* 13. 위기 목록 */}
          <div className="relative mx-6 p-2 shadow-md -mt-16 mb-12">
            <div className="border-2 border-[#A39481] py-8 pl-6 pr-4">
              <h3 className="pr-2 text-center font-gapyeong text-xl font-bold leading-none text-[#111111]">
                {n}님에게 찾아올 위기
              </h3>
              <ul className="mt-8 flex flex-col justify-center gap-5">
                {crisisList.map((item, i) => (
                  <li
                    key={i}
                    className={`flex gap-2 font-pretendard font-normal ${i >= 3 ? "pointer-events-none select-none blur-sm" : ""}`}
                  >
                    <span className="w-6 text-center font-bold text-[#2B557E]">
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 14. result_5 + 텍스트 */}
          <div className="relative">
            <img className="w-full" alt="result_5" src={resultImages[5]} />
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ right: "35.2%", top: "12%", transform: "translateX(50%) translateY(-50%)" }}>
              이 밖에도 {n}님께<br />드릴 말씀이<br />정말 많으니,
            </p>
          </div>

          {/* 15. result_6 + 텍스트 */}
          <div className="relative">
            <img className="w-full" alt="result_6" src={resultImages[6]} />
            <p className="absolute whitespace-nowrap text-center text-base min-[354px]:text-lg min-[396px]:text-xl min-[438px]:text-[1.375rem] min-[438px]:leading-[1.5] font-gapyeong text-[#111111]" style={{ left: "50%", top: "15.9%", transform: "translateX(-50%) translateY(-50%)" }}>
              &quot;오직 {n}님 만을 위해<br />준비된 이야기&quot;
            </p>
          </div>

          {/* 16. result_7 + 결제 버튼 (여기서 멈춤) */}
          <div className="relative">
            <div className="relative" style={{ aspectRatio: "750 / 3538" }}>
              <img className="h-full w-full object-cover" alt="result_7" src={resultImages[7]} />
            </div>
            <div className="absolute inset-x-0 top-[48.5%] h-[3%] w-full -translate-y-1/2 px-[7.5%]">
              <button className="z-10 h-full w-full rounded-b-3xl bg-transparent" />
            </div>
          </div>

          {/* 17~. 결제 후 콘텐츠 (이미지만) */}
          <div>
            <img className="w-full" alt="result_hyundai_1" src={resultHyundaiImages[0]} />
            <img className="w-full" alt="result_hyundai_2" src={resultHyundaiImages[1]} />
          </div>
          {resultImages.slice(8).map((src, i) => (
            <FullWidthImg key={i} alt={`result_${i + 8}`} src={src} />
          ))}
        </div>
      </main>
    </>
  );
}
