"use client";

import { useState, useEffect, useCallback } from "react";

import { CDN_BASE as CDN_URL } from "@/lib/cdn";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CarouselSlide {
  slug: string;
  href: string;
  alt: string;
  dark: boolean;
}

interface Card {
  title: string;
  desc: string;
  href: string;
  img: string;
}

interface DreamPost {
  title: string;
  body: string;
  href: string;
}

interface Celebrity {
  name: string;
  title: string;
  body: string;
  img: string;
  href: string;
}

interface LandingConfig {
  carouselSlides: CarouselSlide[];
  bestCards: Card[];
  fortuneCards: Card[];
  dreamPosts: DreamPost[];
  celebrities: Celebrity[];
  assets: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cdnSrc(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${CDN_URL}/${path}`;
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Section({
  title,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left"
      >
        <span className="flex items-center gap-2 font-pretendard text-sm font-semibold text-gray-900">
          {title}
          {badge && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-500">
              {badge}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="border-t border-gray-100 px-5 py-4">{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel slide editor
// ---------------------------------------------------------------------------

function CarouselEditor({
  slides,
  onChange,
}: {
  slides: CarouselSlide[];
  onChange: (s: CarouselSlide[]) => void;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...slides];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };

  const update = (i: number, patch: Partial<CarouselSlide>) => {
    const next = [...slides];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => onChange(slides.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {slides.map((s, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pretendard text-xs font-semibold text-gray-600">#{i + 1} {s.slug}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              </button>
              <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button onClick={() => remove(i)} className="rounded p-1 text-red-400 hover:bg-red-50">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Carousel preview images */}
          <div className="mb-2 flex gap-2 overflow-x-auto">
            {["mobile", "tablet", "pc"].map((device) => {
              const bgUrl = cdnSrc(`main/carousel/${s.slug}/bg-${device}.png`);
              return (
                <div key={device} className="shrink-0">
                  <img src={bgUrl} alt={`${s.slug} ${device}`} className="h-16 w-auto rounded border border-gray-200 object-cover" loading="lazy" />
                  <p className="mt-0.5 text-center text-[10px] text-gray-400">{device}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs text-gray-500">slug</span>
              <input type="text" value={s.slug} onChange={(e) => update(i, { slug: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">href</span>
              <input type="text" value={s.href} onChange={(e) => update(i, { href: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">alt</span>
              <input type="text" value={s.alt} onChange={(e) => update(i, { alt: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
            </label>
            <label className="flex items-center gap-2 pt-4">
              <input type="checkbox" checked={s.dark} onChange={(e) => update(i, { dark: e.target.checked })} className="rounded border-gray-300" />
              <span className="text-xs text-gray-500">dark mode</span>
            </label>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...slides, { slug: "", href: "", alt: "", dark: false }])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 슬라이드 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card list editor (bestCards, fortuneCards)
// ---------------------------------------------------------------------------

function CardListEditor({
  cards,
  onChange,
  label,
}: {
  cards: Card[];
  onChange: (c: Card[]) => void;
  label: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const next = [...cards];
    const t = i + dir;
    if (t < 0 || t >= next.length) return;
    [next[i], next[t]] = [next[t], next[i]];
    onChange(next);
  };

  const update = (i: number, patch: Partial<Card>) => {
    const next = [...cards];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => onChange(cards.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {cards.map((c, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pretendard text-xs font-semibold text-gray-600">#{i + 1} {c.title}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
              </button>
              <button onClick={() => move(i, 1)} disabled={i === cards.length - 1} className="rounded p-1 text-gray-400 hover:bg-gray-200 disabled:opacity-30">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              <button onClick={() => remove(i)} className="rounded p-1 text-red-400 hover:bg-red-50">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Thumbnail */}
            {c.img && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                <img src={cdnSrc(c.img)} alt={c.title} className="h-full w-full object-contain" loading="lazy" />
              </div>
            )}
            <div className="flex-1 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs text-gray-500">title</span>
                  <input type="text" value={c.title} onChange={(e) => update(i, { title: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">href</span>
                  <input type="text" value={c.href} onChange={(e) => update(i, { href: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">desc</span>
                <input type="text" value={c.desc} onChange={(e) => update(i, { desc: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">img (CDN 경로)</span>
                <input type="text" value={c.img} onChange={(e) => update(i, { img: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
              </label>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...cards, { title: "", desc: "", href: "", img: "" }])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + {label} 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dream posts editor
// ---------------------------------------------------------------------------

function DreamPostsEditor({
  posts,
  onChange,
}: {
  posts: DreamPost[];
  onChange: (p: DreamPost[]) => void;
}) {
  const update = (i: number, patch: Partial<DreamPost>) => {
    const next = [...posts];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => onChange(posts.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {posts.map((p, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pretendard text-xs font-semibold text-gray-600">#{i + 1}</span>
            <button onClick={() => remove(i)} className="rounded p-1 text-red-400 hover:bg-red-50">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-1.5">
            <label className="block">
              <span className="text-xs text-gray-500">title</span>
              <input type="text" value={p.title} onChange={(e) => update(i, { title: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">body</span>
              <textarea value={p.body} onChange={(e) => update(i, { body: e.target.value })} rows={2} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">href</span>
              <input type="text" value={p.href} onChange={(e) => update(i, { href: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
            </label>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...posts, { title: "", body: "", href: "" }])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 포스트 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Celebrities editor
// ---------------------------------------------------------------------------

function CelebritiesEditor({
  items,
  onChange,
}: {
  items: Celebrity[];
  onChange: (c: Celebrity[]) => void;
}) {
  const update = (i: number, patch: Partial<Celebrity>) => {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {items.map((c, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-pretendard text-xs font-semibold text-gray-600">#{i + 1} {c.name}</span>
            <button onClick={() => remove(i)} className="rounded p-1 text-red-400 hover:bg-red-50">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex gap-3">
            {c.img && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
                <img src={cdnSrc(c.img)} alt={c.name} className="h-full w-full object-contain" loading="lazy" />
              </div>
            )}
            <div className="flex-1 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs text-gray-500">name</span>
                  <input type="text" value={c.name} onChange={(e) => update(i, { name: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500">href</span>
                  <input type="text" value={c.href} onChange={(e) => update(i, { href: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs text-gray-500">title</span>
                <input type="text" value={c.title} onChange={(e) => update(i, { title: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">body (요약)</span>
                <textarea value={c.body} onChange={(e) => update(i, { body: e.target.value })} rows={2} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:border-blue-400 focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">img (CDN 경로)</span>
                <input type="text" value={c.img} onChange={(e) => update(i, { img: e.target.value })} className="mt-0.5 block w-full rounded border border-gray-200 bg-white px-2 py-1 font-mono text-xs focus:border-blue-400 focus:outline-none" />
              </label>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { name: "", title: "", body: "", img: "", href: "" }])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 유명인 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assets editor
// ---------------------------------------------------------------------------

function AssetsEditor({
  assets,
  onChange,
}: {
  assets: Record<string, string>;
  onChange: (a: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(assets).map(([key, val]) => (
        <div key={key}>
          <span className="font-pretendard text-xs font-medium text-gray-500">{key}</span>
          <div className="mt-1 flex items-start gap-3">
            {val && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                {/\.(webm|mp4|mov)$/i.test(val) ? (
                  <video src={cdnSrc(val)} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={cdnSrc(val)} alt={key} className="h-full w-full object-contain" loading="lazy" />
                )}
              </div>
            )}
            <input
              type="text"
              value={val}
              onChange={(e) => onChange({ ...assets, [key]: e.target.value })}
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function LandingEditorPage() {
  const [config, setConfig] = useState<LandingConfig | null>(null);
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/landing");
      const data = (await res.json()) as { source: string; data: LandingConfig };
      setConfig(data.data);
      setSource(data.source);
      setJsonText(JSON.stringify(data.data, null, 2));
    } catch {
      showToast("설정 로드 실패");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const dataToSave = jsonMode ? JSON.parse(jsonText) : config;
      const res = await fetch("/api/admin/landing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      if (!res.ok) throw new Error();
      showToast("저장 완료");
      setSource("r2");
      if (jsonMode) {
        setConfig(dataToSave);
      } else {
        setJsonText(JSON.stringify(config, null, 2));
      }
    } catch {
      showToast("저장 실패");
    }
    setSaving(false);
  };

  const update = <K extends keyof LandingConfig>(key: K, val: LandingConfig[K]) => {
    if (!config) return;
    const next = { ...config, [key]: val };
    setConfig(next);
    setJsonText(JSON.stringify(next, null, 2));
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!config) {
    return <div className="p-6 font-pretendard text-gray-500">설정을 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="font-pretendard text-xl font-bold text-gray-900">랜딩 페이지 관리</h1>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              source === "r2"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {source === "r2" ? "R2 저장됨" : "기본값"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={jsonMode}
              onChange={(e) => {
                setJsonMode(e.target.checked);
                if (e.target.checked) {
                  setJsonText(JSON.stringify(config, null, 2));
                } else {
                  try {
                    setConfig(JSON.parse(jsonText));
                  } catch {
                    showToast("JSON 파싱 오류");
                    setJsonMode(true);
                  }
                }
              }}
              className="rounded border-gray-300"
            />
            <span className="font-pretendard text-sm text-gray-600">JSON 모드</span>
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "R2에 저장"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {jsonMode ? (
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="h-[calc(100vh-200px)] w-full rounded-lg border border-gray-200 bg-white p-4 font-mono text-xs text-gray-800 focus:border-blue-400 focus:outline-none"
            spellCheck={false}
          />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            <Section title="캐러셀 슬라이드" badge={`${config.carouselSlides.length}개`} defaultOpen>
              <CarouselEditor
                slides={config.carouselSlides}
                onChange={(s) => update("carouselSlides", s)}
              />
            </Section>

            <Section title="BEST 카드" badge={`${config.bestCards.length}개`}>
              <CardListEditor
                cards={config.bestCards}
                onChange={(c) => update("bestCards", c)}
                label="BEST 카드"
              />
            </Section>

            <Section title="운세 카드" badge={`${config.fortuneCards.length}개`}>
              <CardListEditor
                cards={config.fortuneCards}
                onChange={(c) => update("fortuneCards", c)}
                label="운세 카드"
              />
            </Section>

            <Section title="꿈해몽 포스트" badge={`${config.dreamPosts.length}개`}>
              <DreamPostsEditor
                posts={config.dreamPosts}
                onChange={(p) => update("dreamPosts", p)}
              />
            </Section>

            <Section title="유명인 사주" badge={`${config.celebrities.length}개`}>
              <CelebritiesEditor
                items={config.celebrities}
                onChange={(c) => update("celebrities", c)}
              />
            </Section>

            <Section title="기타 에셋">
              <AssetsEditor
                assets={config.assets}
                onChange={(a) => update("assets", a)}
              />
            </Section>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 font-pretendard text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
