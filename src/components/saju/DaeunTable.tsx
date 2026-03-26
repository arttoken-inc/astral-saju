import { sajuResult, daeunTable } from "@/data/bluemoonladysaju";
import SajuCard from "./SajuCard";

export default function DaeunTable() {
  const d = daeunTable;
  return (
    <SajuCard>
      <div className="px-6 py-10">
        <h3 className="text-center font-gapyeong text-xl font-bold leading-none text-[#111111]">
          {sajuResult.name}님의 대운표
        </h3>
        <p className="mt-2 text-center font-pretendard text-xs">
          {sajuResult.nameShort}님의 대운주기는{" "}
          <span className="font-semibold">
            {d.startAge}세부터 시작해 {d.cycle}년 주기
          </span>
          로 찾아와요.
        </p>
        <table className="mt-4 w-full">
          <thead>
            <tr>
              {d.years.map((year, i) => (
                <th
                  key={year}
                  className={`border border-x-[#BFBFBF] border-y-[#111111] bg-white px-0 py-1 text-center font-pretendard text-xs font-semibold text-[#111111] min-[414px]:px-1.5 min-[414px]:text-sm ${i === 0 ? "border-l-0" : ""} ${i === d.years.length - 1 ? "border-r-0" : ""}`}
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {d.ages.map((age, i) => (
                <td
                  key={age}
                  className={`border border-t-0 border-x-[#BFBFBF] border-b-[#111111] py-1.5 text-center font-gapyeong text-xs text-[#111111] min-[414px]:text-sm ${i === 0 ? "border-l-0" : ""} ${i === d.ages.length - 1 ? "border-r-0" : ""}`}
                >
                  {age}세
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </SajuCard>
  );
}
