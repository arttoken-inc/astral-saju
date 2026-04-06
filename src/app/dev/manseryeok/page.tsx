"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const FiveElementChart = dynamic(
  () => import("@/components/saju/FiveElementChart"),
  { ssr: false },
);
const OhangChart = dynamic(() => import("@/components/saju/OhangChart"), {
  ssr: false,
});

const TIME_OPTIONS = [
  { value: 0, label: "자시/子 (23:30~01:29)", hour: 0, minute: 30 },
  { value: 1, label: "축시/丑 (01:30~03:29)", hour: 2, minute: 30 },
  { value: 2, label: "인시/寅 (03:30~05:29)", hour: 4, minute: 30 },
  { value: 3, label: "묘시/卯 (05:30~07:29)", hour: 6, minute: 30 },
  { value: 4, label: "진시/辰 (07:30~09:29)", hour: 8, minute: 30 },
  { value: 5, label: "사시/巳 (09:30~11:29)", hour: 10, minute: 30 },
  { value: 6, label: "오시/午 (11:30~13:29)", hour: 12, minute: 30 },
  { value: 7, label: "미시/未 (13:30~15:29)", hour: 14, minute: 30 },
  { value: 8, label: "신시/申 (15:30~17:29)", hour: 16, minute: 30 },
  { value: 9, label: "유시/酉 (17:30~19:29)", hour: 18, minute: 30 },
  { value: 10, label: "술시/戌 (19:30~21:29)", hour: 20, minute: 30 },
  { value: 11, label: "해시/亥 (21:30~23:29)", hour: 22, minute: 30 },
];

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── 오행 색상 매핑 ──
const ELEMENT_COLORS: Record<string, string> = {
  wood: "text-green-400",
  fire: "text-red-400",
  earth: "text-yellow-400",
  metal: "text-gray-300",
  water: "text-blue-400",
};
const ELEMENT_KO: Record<string, string> = {
  wood: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};
const ELEMENT_BG: Record<string, string> = {
  wood: "bg-green-900/40",
  fire: "bg-red-900/40",
  earth: "bg-yellow-900/40",
  metal: "bg-gray-700/40",
  water: "bg-blue-900/40",
};

export default function SajuTestPage() {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [timeIdx, setTimeIdx] = useState(6); // 오시 default
  const [gender, setGender] = useState<"male" | "female">("male");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"saju" | "ziwei" | "natal" | "advanced">("saju");

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const time = TIME_OPTIONS[timeIdx];
      const res = await fetch("/api/dev/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year, month, day,
          hour: time.hour, minute: time.minute,
          gender,
          mode: "all",
        }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "계산 실패");
      }
      const data = await res.json();
      setResult(data);
      setActiveTab("saju");
    } catch (e) {
      setError(e instanceof Error ? e.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const saju = result?.saju;
  const ziwei = result?.ziwei;
  const natal = result?.natal;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">사주 종합 분석 테스트</h1>
          <p className="text-sm text-gray-500 mt-1">사주팔자 + 자미두수 + 서양 점성술</p>
        </div>

        {/* Input Form */}
        <div className="bg-gray-900 rounded-xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">출생년도</label>
              <input type="number" value={year} onChange={(e) => setYear(+e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">월</label>
              <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(+e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">일</label>
              <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(+e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">성별</label>
              <div className="flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      gender === g ? "bg-indigo-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                    {g === "male" ? "남성" : "여성"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">태어난 시</label>
              <select value={timeIdx} onChange={(e) => setTimeIdx(+e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-3 py-2 text-white text-sm">
                {TIME_OPTIONS.map((o, i) => (
                  <option key={i} value={i}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleCalculate} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg py-3 font-bold text-lg transition">
            {loading ? "계산 중..." : "종합 분석"}
          </button>
        </div>

        {error && <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 text-red-300">{error}</div>}

        {result && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-gray-900 rounded-xl p-1">
              {([
                ["saju", "사주팔자"],
                ["ziwei", "자미두수"],
                ["natal", "서양점성술"],
                ["advanced", "통합분석"],
              ] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === key ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* ═══════ 사주팔자 탭 ═══════ */}
            {activeTab === "saju" && saju && (
              <div className="space-y-4">
                {/* 사주 테이블 */}
                <Section title="사주 원국 (四柱八字)">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="text-gray-400 text-xs">
                        <th className="py-1"></th>
                        <th>시주(時)</th>
                        <th>일주(日)</th>
                        <th>월주(月)</th>
                        <th>년주(年)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-xs text-gray-500">
                        <td className="pr-2 text-right">십신</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`ss-${i}`} className={i === 1 ? "text-yellow-400" : ""}>
                            {p.stemSipsin}
                          </td>
                        ))}
                      </tr>
                      <tr className="text-2xl font-bold">
                        <td className="text-xs text-gray-400 pr-2 text-right font-normal">천간</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`stem-${i}`} className={`py-2 ${i === 1 ? "text-yellow-400" : ""} ${ELEMENT_COLORS[p.pillar.stemElement]}`}>
                            {p.pillar.stem}
                            <span className="text-xs block text-gray-500">{p.pillar.fullStem}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="text-2xl font-bold">
                        <td className="text-xs text-gray-400 pr-2 text-right font-normal">지지</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`branch-${i}`} className={`py-2 ${i === 1 ? "text-yellow-400" : ""} ${ELEMENT_COLORS[p.pillar.branchElement]}`}>
                            {p.pillar.branch}
                            <span className="text-xs block text-gray-500">{p.pillar.fullBranch}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="text-xs text-gray-500">
                        <td className="pr-2 text-right">십신</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`bs-${i}`}>{p.branchSipsin}</td>
                        ))}
                      </tr>
                      <tr className="text-xs text-gray-500">
                        <td className="pr-2 text-right">운성</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`un-${i}`}>{p.unseong}</td>
                        ))}
                      </tr>
                      <tr className="text-xs text-gray-500">
                        <td className="pr-2 text-right">신살</td>
                        {saju.pillars.map((p: any, i: number) => (
                          <td key={`sp-${i}`}>{p.spirit}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </Section>

                {/* 지장간 */}
                <Section title="지장간 (支藏干)">
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    {["시주", "일주", "월주", "년주"].map((label, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">{label}</div>
                        <div className="text-lg font-mono tracking-wider">
                          {saju.pillars[i]?.jigang}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {(saju.pillars[i]?.hiddenStems ?? []).join(" · ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* 오행 분포 */}
                <Section title="오행 분포">
                  <div className="flex gap-2 mb-4">
                    {Object.entries(saju.ohang as Record<string, number>).map(([el, count]) => {
                      const max = Math.max(...Object.values(saju.ohang as Record<string, number>));
                      return (
                        <div key={el} className={`flex-1 ${ELEMENT_BG[el]} rounded-lg p-3 text-center`}>
                          <div className={`text-lg font-bold ${ELEMENT_COLORS[el]}`}>{count}</div>
                          <div className="text-xs text-gray-400">{ELEMENT_KO[el]}</div>
                          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${count === max ? "bg-white" : "bg-gray-500"}`}
                              style={{ width: `${(count / 8) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* 레이더 차트 */}
                  <div className="bg-gray-800 rounded-lg p-4 mb-3">
                    <FiveElementChart elements={saju.ohang} />
                  </div>
                  {/* 바 차트 */}
                  <OhangChart
                    fiveElements={saju.ohang}
                    isVisible={true}
                    onClose={() => {}}
                  />
                </Section>

                {/* 합충형파해 */}
                <Section title="합충형파해 관계">
                  {Object.keys(saju.relations.pairs).length === 0 &&
                    saju.relations.triple.length === 0 &&
                    saju.relations.directional.length === 0 ? (
                    <p className="text-gray-500 text-sm">특별한 합충형파해 관계 없음</p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(saju.relations.pairs as Record<string, any>).map(([key, rel]) => {
                        const [i, j] = key.split(",").map(Number);
                        const names = ["시주", "일주", "월주", "년주"];
                        return (
                          <div key={key} className="bg-gray-800 rounded-lg px-3 py-2 text-sm">
                            <span className="text-gray-400">{names[i]}↔{names[j]}</span>
                            {rel.stem?.map((r: any, ri: number) => (
                              <span key={`s${ri}`} className="ml-2 text-amber-400">천간 {r.type} {r.detail}</span>
                            ))}
                            {rel.branch?.map((r: any, ri: number) => (
                              <span key={`b${ri}`} className="ml-2 text-cyan-400">지지 {r.type} {r.detail}</span>
                            ))}
                          </div>
                        );
                      })}
                      {saju.relations.triple.map((r: any, i: number) => (
                        <div key={`t${i}`} className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-emerald-400">삼합: {r.detail}</div>
                      ))}
                      {saju.relations.directional.map((r: any, i: number) => (
                        <div key={`d${i}`} className="bg-gray-800 rounded-lg px-3 py-2 text-sm text-purple-400">방합: {r.detail}</div>
                      ))}
                    </div>
                  )}
                </Section>

                {/* 대운 */}
                <Section title="대운 (大運) — 10년 주기">
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 min-w-max">
                      {(saju.daewoon ?? []).map((dw: any) => {
                        const currentAge = new Date().getFullYear() - year;
                        const isCurrent = currentAge >= dw.age && currentAge < dw.age + 10;
                        return (
                          <div key={dw.index}
                            className={`w-20 shrink-0 rounded-lg p-2 text-center text-sm ${
                              isCurrent ? "bg-indigo-900/60 ring-1 ring-indigo-400" : "bg-gray-800"}`}>
                            <div className="text-xs text-gray-400">{dw.age}~{dw.age + 9}세</div>
                            <div className="text-lg font-bold mt-1">{dw.ganzi}</div>
                            <div className="text-xs text-gray-500 mt-1">{dw.stemSipsin}</div>
                            <div className="text-xs text-gray-500">{dw.unseong}</div>
                            {isCurrent && <div className="text-[10px] text-indigo-400 mt-1">현재</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Section>

                {/* 특수 신살 */}
                <Section title="특수 신살">
                  <div className="flex flex-wrap gap-2">
                    {saju.specialSals.yangin.length > 0 && (
                      <Badge color="red">양인살 (羊刃殺)</Badge>
                    )}
                    {saju.specialSals.goegang && (
                      <Badge color="purple">괴강살 (魁罡殺)</Badge>
                    )}
                    {saju.specialSals.baekho && (
                      <Badge color="orange">백호살 (白虎殺)</Badge>
                    )}
                    {!saju.specialSals.yangin.length && !saju.specialSals.goegang && !saju.specialSals.baekho && (
                      <span className="text-gray-500 text-sm">특이 신살 없음</span>
                    )}
                  </div>
                </Section>
              </div>
            )}

            {/* ═══════ 자미두수 탭 ═══════ */}
            {activeTab === "ziwei" && (
              <div className="space-y-4">
                {result.ziweiError ? (
                  <div className="bg-red-900/30 rounded-lg p-4 text-red-300">{result.ziweiError}</div>
                ) : ziwei ? (
                  <>
                    <Section title="명반 기본정보">
                      <div className="grid grid-cols-3 gap-3">
                        <InfoCard label="명궁 (命宮)" value={ziwei.mingGongZhi} />
                        <InfoCard label="신궁 (身宮)" value={ziwei.shenGongZhi} />
                        <InfoCard label="오행국" value={ziwei.wuXingJu.name} />
                      </div>
                    </Section>

                    <Section title="12궁 배치">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.values(ziwei.palaces as Record<string, any>).map((palace: any) => {
                          const isMing = palace.zhi === ziwei.mingGongZhi;
                          const isShen = palace.isShenGong;
                          return (
                            <div key={palace.name}
                              className={`rounded-lg p-3 text-sm ${
                                isMing ? "bg-indigo-900/50 ring-1 ring-indigo-400" :
                                isShen ? "bg-purple-900/50 ring-1 ring-purple-400" :
                                "bg-gray-800"}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">{palace.name}</span>
                                <span className="text-xs text-gray-400">{palace.ganZhi}</span>
                              </div>
                              {isMing && <span className="text-[10px] text-indigo-400">명궁</span>}
                              {isShen && <span className="text-[10px] text-purple-400 ml-1">신궁</span>}
                              <div className="mt-1 flex flex-wrap gap-1">
                                {(palace.stars ?? []).map((s: any, si: number) => (
                                  <span key={si} className={`text-xs px-1.5 py-0.5 rounded ${
                                    s.siHua ? "bg-amber-800/50 text-amber-300" :
                                    s.brightness === "묘" || s.brightness === "왕" ? "bg-cyan-800/40 text-cyan-300" :
                                    s.brightness === "함" || s.brightness === "불" ? "bg-red-800/40 text-red-300" :
                                    "bg-gray-700 text-gray-300"
                                  }`}>
                                    {s.name}
                                    {s.brightness && <span className="text-[10px] ml-0.5">({s.brightness})</span>}
                                    {s.siHua && <span className="text-[10px] ml-0.5">[{s.siHua}]</span>}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Section>
                  </>
                ) : (
                  <p className="text-gray-500">자미두수 데이터 없음</p>
                )}
              </div>
            )}

            {/* ═══════ 서양 점성술 탭 ═══════ */}
            {activeTab === "natal" && (
              <div className="space-y-4">
                {result.natalError ? (
                  <div className="bg-red-900/30 rounded-lg p-4 text-red-300">{result.natalError}</div>
                ) : natal ? (
                  <>
                    <Section title="핵심 배치">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {natal.planets.filter((p: any) => p.id === "Sun" || p.id === "Moon").map((p: any) => (
                          <InfoCard key={p.id}
                            label={p.id === "Sun" ? "태양" : "달"}
                            value={ZODIAC_KO[p.sign] ?? p.sign}
                            sub={`${Math.floor(p.degreeInSign)}° · ${p.house}하우스`} />
                        ))}
                        <InfoCard label="상승궁 (ASC)" value={ZODIAC_KO[natal.angles.asc.sign] ?? natal.angles.asc.sign}
                          sub={`${Math.floor(natal.angles.asc.degree)}°`} />
                        <InfoCard label="중천 (MC)" value={ZODIAC_KO[natal.angles.mc.sign] ?? natal.angles.mc.sign}
                          sub={`${Math.floor(natal.angles.mc.degree)}°`} />
                      </div>
                    </Section>

                    <Section title="행성 배치">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {natal.planets.map((p: any) => (
                          <div key={p.id} className="bg-gray-800 rounded-lg p-3 text-center text-sm">
                            <div className="text-xs text-gray-400">{PLANET_KO[p.id] ?? p.id}</div>
                            <div className="font-bold mt-1">{ZODIAC_KO[p.sign] ?? p.sign}</div>
                            <div className="text-xs text-gray-500">{Math.floor(p.degreeInSign)}° · {p.house}H</div>
                            {p.isRetrograde && <div className="text-[10px] text-red-400 mt-0.5">역행</div>}
                          </div>
                        ))}
                      </div>
                    </Section>

                    <Section title="주요 애스펙트">
                      <div className="space-y-1">
                        {(natal.aspects ?? []).slice(0, 10).map((a: any, i: number) => (
                          <div key={i} className="bg-gray-800 rounded-lg px-3 py-2 text-sm flex justify-between">
                            <span>
                              <span className="text-gray-300">{PLANET_KO[a.planet1] ?? a.planet1}</span>
                              <span className="text-gray-500 mx-2">—</span>
                              <span className="text-gray-300">{PLANET_KO[a.planet2] ?? a.planet2}</span>
                            </span>
                            <span className={`${ASPECT_COLORS[a.type] ?? "text-gray-400"}`}>
                              {ASPECT_KO[a.type] ?? a.type} ({a.orb}°)
                            </span>
                          </div>
                        ))}
                      </div>
                    </Section>
                  </>
                ) : (
                  <p className="text-gray-500">서양 점성술 데이터 없음</p>
                )}
              </div>
            )}

            {/* ═══════ 통합 분석 탭 ═══════ */}
            {activeTab === "advanced" && (
              <div className="space-y-4">
                {result.advancedError ? (
                  <div className="bg-red-900/30 rounded-lg p-4 text-red-300">{result.advancedError}</div>
                ) : result.advancedContext ? (
                  <Section title="AI 프롬프트용 통합 분석 데이터">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">
                      {result.advancedContext}
                    </pre>
                  </Section>
                ) : (
                  <p className="text-gray-500">통합 분석 데이터 없음</p>
                )}
              </div>
            )}

            {/* Raw JSON */}
            <details className="mt-6 bg-gray-900 rounded-xl p-4">
              <summary className="cursor-pointer text-gray-400 text-sm">Raw JSON</summary>
              <pre className="mt-2 text-xs text-gray-300 overflow-x-auto max-h-96 overflow-y-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

// ── Helper components ──

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4">
      <h2 className="text-sm font-bold text-gray-300 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function InfoCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    red: "bg-red-900/50 text-red-300 border-red-700",
    purple: "bg-purple-900/50 text-purple-300 border-purple-700",
    orange: "bg-orange-900/50 text-orange-300 border-orange-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${colors[color] ?? colors.red}`}>
      {children}
    </span>
  );
}

// ── 번역 데이터 ──

const ZODIAC_KO: Record<string, string> = {
  Aries: "양자리", Taurus: "황소자리", Gemini: "쌍둥이자리", Cancer: "게자리",
  Leo: "사자자리", Virgo: "처녀자리", Libra: "천칭자리", Scorpio: "전갈자리",
  Sagittarius: "사수자리", Capricorn: "염소자리", Aquarius: "물병자리", Pisces: "물고기자리",
};

const PLANET_KO: Record<string, string> = {
  Sun: "태양", Moon: "달", Mercury: "수성", Venus: "금성", Mars: "화성",
  Jupiter: "목성", Saturn: "토성", Uranus: "천왕성", Neptune: "해왕성", Pluto: "명왕성",
};

const ASPECT_KO: Record<string, string> = {
  conjunction: "합(0°)", sextile: "육합(60°)", square: "스퀘어(90°)",
  trine: "트라인(120°)", opposition: "충(180°)",
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: "text-yellow-400", sextile: "text-cyan-400", square: "text-red-400",
  trine: "text-green-400", opposition: "text-orange-400",
};
