"use client";

import { useState, useEffect, useCallback, use } from "react";

import { CDN_BASE as CDN_URL } from "@/lib/cdn";

// ---------------------------------------------------------------------------
// Types (mirrors serviceConfig.ts but kept minimal for the editor)
// ---------------------------------------------------------------------------

interface ServiceConfig {
  meta: Record<string, string>;
  colors: Record<string, string>;
  steps: Step[];
  resultPage: { sections: ResultSection[] };
  sampleData: Record<string, unknown>;
  ohaengData: Record<string, unknown>;
  daeunData: Record<string, unknown>;
  destinyPartner: Record<string, unknown>;
  crisisList: string[];
  timeOptions: { value: string; label: string; disabled?: boolean }[];
  decorations: Record<string, string>;
}

type Step = Record<string, unknown> & { id: string; type: string };
type ResultSection = Record<string, unknown> & { type: string };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cdnSrc(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${CDN_URL}/${path}`;
}

function isImagePath(v: unknown): v is string {
  if (typeof v !== "string") return false;
  return /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(v) || /\.(mp4|webm|mov)$/i.test(v);
}

// ---------------------------------------------------------------------------
// Collapsible section
// ---------------------------------------------------------------------------

function Section({
  title,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badge?: string;
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
// Field editors
// ---------------------------------------------------------------------------

function StringField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
        />
      )}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-gray-200"
      />
      <div>
        <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
        <span className="ml-2 font-mono text-xs text-gray-400">{value}</span>
      </div>
    </label>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      <div className="mt-1 flex items-start gap-3">
        {value && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            {/\.(mp4|webm|mov)$/i.test(value) ? (
              <video
                src={cdnSrc(value)}
                className="h-full w-full object-cover"
                muted
              />
            ) : (
              <img
                src={cdnSrc(value)}
                alt={label}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            )}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="이미지 경로"
          className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-32 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Generic key-value editor for nested objects
// ---------------------------------------------------------------------------

function ObjectEditor({
  obj,
  onChange,
  imageKeys,
}: {
  obj: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
  imageKeys?: string[];
}) {
  const set = (key: string, val: unknown) => onChange({ ...obj, [key]: val });

  return (
    <div className="space-y-3">
      {Object.entries(obj).map(([key, val]) => {
        if (isImagePath(val) || imageKeys?.includes(key)) {
          return (
            <ImageField
              key={key}
              label={key}
              value={String(val ?? "")}
              onChange={(v) => set(key, v)}
            />
          );
        }
        if (typeof val === "string") {
          return (
            <StringField
              key={key}
              label={key}
              value={val}
              onChange={(v) => set(key, v)}
              multiline={val.includes("\n") || val.length > 80}
            />
          );
        }
        if (typeof val === "number") {
          return (
            <NumberField
              key={key}
              label={key}
              value={val}
              onChange={(v) => set(key, v)}
            />
          );
        }
        if (typeof val === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => set(key, e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="font-pretendard text-xs font-medium text-gray-500">{key}</span>
            </label>
          );
        }
        if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
          return (
            <StringField
              key={key}
              label={`${key} (줄바꿈으로 구분)`}
              value={val.join("\n")}
              onChange={(v) => set(key, v.split("\n"))}
              multiline
            />
          );
        }
        if (Array.isArray(val) && val.every((v) => typeof v === "number")) {
          return (
            <StringField
              key={key}
              label={`${key} (쉼표로 구분)`}
              value={val.join(", ")}
              onChange={(v) =>
                set(
                  key,
                  v.split(",").map((s) => Number(s.trim())),
                )
              }
            />
          );
        }
        // Nested objects/arrays → JSON textarea
        return (
          <label key={key} className="block">
            <span className="font-pretendard text-xs font-medium text-gray-500">{key}</span>
            <textarea
              value={JSON.stringify(val, null, 2)}
              onChange={(e) => {
                try {
                  set(key, JSON.parse(e.target.value));
                } catch {
                  // invalid JSON, keep editing
                }
              }}
              rows={Math.min(12, String(JSON.stringify(val, null, 2)).split("\n").length + 1)}
              className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            />
          </label>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step editor
// ---------------------------------------------------------------------------

function StepEditor({
  step,
  index,
  onChange,
  onRemove,
  onMove,
  total,
}: {
  step: Step;
  index: number;
  onChange: (s: Step) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  total: number;
}) {
  const typeColors: Record<string, string> = {
    hero: "bg-purple-100 text-purple-700",
    "fullscreen-image": "bg-green-100 text-green-700",
    form: "bg-blue-100 text-blue-700",
  };

  return (
    <Section
      title={`#${index + 1} ${step.id}`}
      badge={step.type}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[step.type] ?? "bg-gray-100 text-gray-600"}`}
        >
          {step.type}
        </span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            title="위로"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
            title="아래로"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="rounded p-1 text-red-400 hover:bg-red-50"
            title="삭제"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <ObjectEditor
        obj={step}
        onChange={(updated) => onChange(updated as Step)}
        imageKeys={["bgSrc", "bgPoster", "titleImage"]}
      />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Result section editor
// ---------------------------------------------------------------------------

function ResultSectionEditor({
  section,
  index,
  onChange,
  onRemove,
  onMove,
  total,
}: {
  section: ResultSection;
  index: number;
  onChange: (s: ResultSection) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  total: number;
}) {
  const typeColors: Record<string, string> = {
    image: "bg-emerald-100 text-emerald-700",
    "image-with-text": "bg-teal-100 text-teal-700",
    "image-pair": "bg-cyan-100 text-cyan-700",
    "saju-table": "bg-indigo-100 text-indigo-700",
    "daeun-table": "bg-violet-100 text-violet-700",
    ohaeng: "bg-fuchsia-100 text-fuchsia-700",
    "destiny-partner": "bg-pink-100 text-pink-700",
    "wealth-graph": "bg-amber-100 text-amber-700",
    "crisis-list": "bg-red-100 text-red-700",
    "speech-bubble": "bg-sky-100 text-sky-700",
    "payment-gate": "bg-orange-100 text-orange-700",
    spacer: "bg-gray-100 text-gray-600",
  };

  const displayName = section.type + (
    "image" in section && typeof section.image === "string"
      ? ` — ${(section.image as string).split("/").pop()}`
      : ""
  );

  return (
    <Section title={`#${index + 1} ${displayName}`} badge={section.type}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[section.type] ?? "bg-gray-100 text-gray-600"}`}
        >
          {section.type}
        </span>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="rounded p-1 text-red-400 hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <ObjectEditor
        obj={section}
        onChange={(updated) => onChange(updated as ResultSection)}
        imageKeys={["image", "bubbleImage", "maskedWealthGraph", "dreamPerson"]}
      />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Crisis list editor
// ---------------------------------------------------------------------------

function CrisisListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="font-pretendard text-xs text-gray-400">{i + 1}.</span>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="rounded p-1 text-red-400 hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, ""])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 항목 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time options editor
// ---------------------------------------------------------------------------

function TimeOptionsEditor({
  options,
  onChange,
}: {
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (opts: { value: string; label: string; disabled?: boolean }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={opt.value}
            onChange={(e) => {
              const next = [...options];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
            placeholder="value"
            className="w-24 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
          />
          <input
            type="text"
            value={opt.label}
            onChange={(e) => {
              const next = [...options];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
            placeholder="label"
            className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
          />
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={!!opt.disabled}
              onChange={(e) => {
                const next = [...options];
                next[i] = { ...next[i], disabled: e.target.checked || undefined };
                onChange(next);
              }}
              className="rounded border-gray-300"
            />
            <span className="text-xs text-gray-400">비활성</span>
          </label>
          <button
            onClick={() => onChange(options.filter((_, j) => j !== i))}
            className="rounded p-1 text-red-400 hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...options, { value: "", label: "" }])}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 옵션 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const [config, setConfig] = useState<ServiceConfig | null>(null);
  const [source, setSource] = useState<string>("");
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
      const res = await fetch(`/api/admin/services/${serviceId}`);
      const data = (await res.json()) as { source: string; data: ServiceConfig };
      setConfig(data.data);
      setSource(data.source);
      setJsonText(JSON.stringify(data.data, null, 2));
    } catch {
      showToast("설정 로드 실패");
    }
    setLoading(false);
  }, [serviceId]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const dataToSave = jsonMode ? JSON.parse(jsonText) : config;
      const res = await fetch(`/api/admin/services/${serviceId}`, {
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

  const update = <K extends keyof ServiceConfig>(key: K, val: ServiceConfig[K]) => {
    if (!config) return;
    const next = { ...config, [key]: val };
    setConfig(next);
    setJsonText(JSON.stringify(next, null, 2));
  };

  const updateStep = (index: number, step: Step) => {
    if (!config) return;
    const steps = [...config.steps];
    steps[index] = step;
    update("steps", steps);
  };

  const moveStep = (index: number, dir: -1 | 1) => {
    if (!config) return;
    const steps = [...config.steps];
    const target = index + dir;
    if (target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    update("steps", steps);
  };

  const removeStep = (index: number) => {
    if (!config || !confirm("이 스텝을 삭제하시겠습니까?")) return;
    update("steps", config.steps.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, section: ResultSection) => {
    if (!config) return;
    const sections = [...config.resultPage.sections];
    sections[index] = section;
    update("resultPage", { sections });
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    if (!config) return;
    const sections = [...config.resultPage.sections];
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    [sections[index], sections[target]] = [sections[target], sections[index]];
    update("resultPage", { sections });
  };

  const removeSection = (index: number) => {
    if (!config || !confirm("이 섹션을 삭제하시겠습니까?")) return;
    update("resultPage", {
      sections: config.resultPage.sections.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="p-6 font-pretendard text-gray-500">서비스를 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <div className="flex items-center gap-3">
            <a
              href="/admin/services"
              className="font-pretendard text-sm text-gray-400 hover:text-blue-600"
            >
              &larr; 목록
            </a>
            <h1 className="font-pretendard text-xl font-bold text-gray-900">
              {config.meta.serviceTitle || serviceId}
            </h1>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                source === "r2"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {source === "r2" ? "R2 저장됨" : "번들 (기본값)"}
            </span>
            <span className="font-pretendard text-xs text-gray-400">{serviceId}</span>
          </div>
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
            {/* Meta */}
            <Section title="기본 정보 (meta)" defaultOpen>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(config.meta).map(([key, val]) => (
                  <StringField
                    key={key}
                    label={key}
                    value={val}
                    onChange={(v) => update("meta", { ...config.meta, [key]: v })}
                  />
                ))}
              </div>
            </Section>

            {/* Colors */}
            <Section title="색상 (colors)">
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(config.colors).map(([key, val]) => (
                  <ColorField
                    key={key}
                    label={key}
                    value={val}
                    onChange={(v) => update("colors", { ...config.colors, [key]: v })}
                  />
                ))}
              </div>
            </Section>

            {/* Steps */}
            <Section title="스텝 (steps)" badge={`${config.steps.length}개`}>
              <div className="space-y-3">
                {config.steps.map((step, i) => (
                  <StepEditor
                    key={`${step.id}-${i}`}
                    step={step}
                    index={i}
                    onChange={(s) => updateStep(i, s)}
                    onRemove={() => removeStep(i)}
                    onMove={(dir) => moveStep(i, dir)}
                    total={config.steps.length}
                  />
                ))}
              </div>
            </Section>

            {/* Result sections */}
            <Section
              title="결과 페이지 (resultPage.sections)"
              badge={`${config.resultPage.sections.length}개`}
            >
              <div className="space-y-3">
                {config.resultPage.sections.map((section, i) => (
                  <ResultSectionEditor
                    key={`${section.type}-${i}`}
                    section={section}
                    index={i}
                    onChange={(s) => updateSection(i, s)}
                    onRemove={() => removeSection(i)}
                    onMove={(dir) => moveSection(i, dir)}
                    total={config.resultPage.sections.length}
                  />
                ))}
              </div>
            </Section>

            {/* Decorations */}
            <Section title="데코레이션 (decorations)">
              <div className="space-y-3">
                {Object.entries(config.decorations).map(([key, val]) => (
                  <ImageField
                    key={key}
                    label={key}
                    value={val}
                    onChange={(v) => update("decorations", { ...config.decorations, [key]: v })}
                  />
                ))}
              </div>
            </Section>

            {/* Crisis list */}
            <Section title="위기 목록 (crisisList)" badge={`${config.crisisList.length}개`}>
              <CrisisListEditor
                items={config.crisisList}
                onChange={(items) => update("crisisList", items)}
              />
            </Section>

            {/* Time options */}
            <Section title="시간 옵션 (timeOptions)" badge={`${config.timeOptions.length}개`}>
              <TimeOptionsEditor
                options={config.timeOptions}
                onChange={(opts) => update("timeOptions", opts)}
              />
            </Section>

            {/* Sample data */}
            <Section title="샘플 데이터 (sampleData)">
              <ObjectEditor
                obj={config.sampleData as Record<string, unknown>}
                onChange={(v) => update("sampleData", v)}
              />
            </Section>

            {/* Ohaeng data */}
            <Section title="오행 데이터 (ohaengData)">
              <ObjectEditor
                obj={config.ohaengData as Record<string, unknown>}
                onChange={(v) => update("ohaengData", v)}
              />
            </Section>

            {/* Daeun data */}
            <Section title="대운 데이터 (daeunData)">
              <ObjectEditor
                obj={config.daeunData as Record<string, unknown>}
                onChange={(v) => update("daeunData", v)}
              />
            </Section>

            {/* Destiny partner */}
            <Section title="운명의 짝 (destinyPartner)">
              <ObjectEditor
                obj={config.destinyPartner as Record<string, unknown>}
                onChange={(v) => update("destinyPartner", v)}
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
