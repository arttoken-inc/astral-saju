"use client";

import { useState, useEffect, useCallback, use } from "react";
import type {
  ServiceConfig,
  ServiceScript,
  Step,
  ResultSection,
  FormFieldDef,
  DynamicImageRule,
} from "@/lib/serviceConfig";
import { CDN_BASE as CDN_URL } from "@/lib/cdn";

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
  return /\.(png|jpe?g|gif|webp|svg|ico|mp4|webm|mov)$/i.test(v);
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
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
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
  label, value, onChange, multiline, mono, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; mono?: boolean; placeholder?: string;
}) {
  const cls = `mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 ${mono ? "font-mono text-xs" : "font-pretendard text-sm"} text-gray-900 focus:border-blue-400 focus:outline-none`;
  return (
    <label className="block">
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          rows={4} placeholder={placeholder} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="color" value={value.startsWith("#") ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-gray-200" />
      <div>
        <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
        <span className="ml-2 font-mono text-xs text-gray-400">{value}</span>
      </div>
    </label>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      <div className="mt-1 flex items-start gap-3">
        {value && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
            {/\.(mp4|webm|mov)$/i.test(value) ? (
              <video src={cdnSrc(value)} className="h-full w-full object-cover" muted />
            ) : (
              <img src={cdnSrc(value)} alt={label} className="h-full w-full object-contain" loading="lazy" />
            )}
          </div>
        )}
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder="이미지 경로"
          className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none" />
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 block w-32 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none" />
    </label>
  );
}

function JsonField({ label, value, onChange }: { label: string; value: unknown; onChange: (v: unknown) => void }) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [err, setErr] = useState(false);

  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);

  return (
    <label className="block">
      <span className="font-pretendard text-xs font-medium text-gray-500">{label}</span>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            onChange(JSON.parse(e.target.value));
            setErr(false);
          } catch {
            setErr(true);
          }
        }}
        rows={Math.min(12, text.split("\n").length + 1)}
        className={`mt-1 block w-full rounded-md border ${err ? "border-red-300" : "border-gray-200"} bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none`}
      />
    </label>
  );
}

// ---------------------------------------------------------------------------
// Generic object editor
// ---------------------------------------------------------------------------

function ObjectEditor({
  obj, onChange, imageKeys,
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
          return <ImageField key={key} label={key} value={String(val ?? "")} onChange={(v) => set(key, v)} />;
        }
        if (typeof val === "string") {
          return <StringField key={key} label={key} value={val} onChange={(v) => set(key, v)} multiline={val.includes("\n") || val.length > 80} />;
        }
        if (typeof val === "number") {
          return <NumberField key={key} label={key} value={val} onChange={(v) => set(key, v)} />;
        }
        if (typeof val === "boolean") {
          return (
            <label key={key} className="flex items-center gap-2">
              <input type="checkbox" checked={val} onChange={(e) => set(key, e.target.checked)} className="rounded border-gray-300" />
              <span className="font-pretendard text-xs font-medium text-gray-500">{key}</span>
            </label>
          );
        }
        return <JsonField key={key} label={key} value={val} onChange={(v) => set(key, v)} />;
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab button
// ---------------------------------------------------------------------------

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 font-pretendard text-sm font-medium transition ${
        active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Move/Remove buttons
// ---------------------------------------------------------------------------

function ItemControls({ index, total, onMove, onRemove }: {
  index: number; total: number;
  onMove: (dir: -1 | 1) => void; onRemove: () => void;
}) {
  return (
    <div className="flex gap-1">
      <button onClick={() => onMove(-1)} disabled={index === 0}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30" title="위로">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <button onClick={() => onMove(1)} disabled={index === total - 1}
        className="rounded p-1 text-gray-400 hover:bg-gray-100 disabled:opacity-30" title="아래로">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <button onClick={onRemove} className="rounded p-1 text-red-400 hover:bg-red-50" title="삭제">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step editor
// ---------------------------------------------------------------------------

const STEP_TYPE_COLORS: Record<string, string> = {
  hero: "bg-purple-100 text-purple-700",
  "fullscreen-image": "bg-green-100 text-green-700",
  form: "bg-blue-100 text-blue-700",
};

function StepEditor({ step, index, onChange, onRemove, onMove, total }: {
  step: Step; index: number; onChange: (s: Step) => void;
  onRemove: () => void; onMove: (dir: -1 | 1) => void; total: number;
}) {
  return (
    <Section title={`#${index + 1} ${step.id}`} badge={step.type}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STEP_TYPE_COLORS[step.type] ?? "bg-gray-100 text-gray-600"}`}>
          {step.type}
        </span>
        <div className="ml-auto">
          <ItemControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>
      <ObjectEditor
        obj={step as unknown as Record<string, unknown>}
        onChange={(updated) => onChange(updated as unknown as Step)}
        imageKeys={["bgSrc", "bgPoster", "titleImage"]}
      />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Result section editor
// ---------------------------------------------------------------------------

const SECTION_TYPE_COLORS: Record<string, string> = {
  "webtoon-panel": "bg-teal-100 text-teal-700",
  "image-sequence": "bg-cyan-100 text-cyan-700",
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

function ResultSectionEditor({ section, index, onChange, onRemove, onMove, total }: {
  section: ResultSection; index: number; onChange: (s: ResultSection) => void;
  onRemove: () => void; onMove: (dir: -1 | 1) => void; total: number;
}) {
  return (
    <Section title={`#${index + 1} ${section.type}`} badge={section.type}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SECTION_TYPE_COLORS[section.type] ?? "bg-gray-100 text-gray-600"}`}>
          {section.type}
        </span>
        <div className="ml-auto">
          <ItemControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>
      <ObjectEditor
        obj={section as unknown as Record<string, unknown>}
        onChange={(updated) => onChange(updated as unknown as ResultSection)}
        imageKeys={["image", "bubbleImage"]}
      />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Form field editor (for form steps)
// ---------------------------------------------------------------------------

function FormFieldEditor({ field, onChange, onRemove }: {
  field: FormFieldDef; onChange: (f: FormFieldDef) => void; onRemove: () => void;
}) {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs text-gray-600">{field.key}</span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{field.type}</span>
          <button onClick={onRemove} className="text-red-400 hover:text-red-600">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <StringField label="key" value={field.key} onChange={(v) => onChange({ ...field, key: v })} />
        <label className="block">
          <span className="font-pretendard text-xs font-medium text-gray-500">type</span>
          <select value={field.type} onChange={(e) => onChange({ ...field, type: e.target.value as FormFieldDef["type"] })}
            className="mt-1 block w-full rounded-md border border-gray-200 bg-white px-3 py-2 font-pretendard text-sm focus:border-blue-400 focus:outline-none">
            {["text", "birthdate", "time-select", "button-group", "select", "textarea"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      {field.options && (
        <div className="mt-2">
          <StringField label="options (줄바꿈으로 구분)" value={field.options.join("\n")}
            onChange={(v) => onChange({ ...field, options: v.split("\n").filter(Boolean) })} multiline />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dynamic image rule editor
// ---------------------------------------------------------------------------

function DynamicImageEditor({ rules, onChange }: {
  rules: Record<string, DynamicImageRule>;
  onChange: (rules: Record<string, DynamicImageRule>) => void;
}) {
  const entries = Object.entries(rules);

  return (
    <div className="space-y-4">
      {entries.map(([key, rule]) => (
        <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-sm font-semibold text-gray-700">{key}</span>
            <button
              onClick={() => {
                const next = { ...rules };
                delete next[key];
                onChange(next);
              }}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <StringField label="pattern" value={rule.pattern} mono
            onChange={(v) => onChange({ ...rules, [key]: { ...rule, pattern: v } })} />
          <div className="mt-2">
            <StringField label="fallback" value={rule.fallback || ""} mono
              onChange={(v) => onChange({ ...rules, [key]: { ...rule, fallback: v || undefined } })} />
          </div>
          <div className="mt-2">
            <JsonField label="variables" value={rule.variables}
              onChange={(v) => onChange({ ...rules, [key]: { ...rule, variables: v as DynamicImageRule["variables"] } })} />
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newKey = `image${entries.length + 1}`;
          onChange({ ...rules, [newKey]: { pattern: "", variables: {} } });
        }}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 동적 이미지 규칙 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prompt editor
// ---------------------------------------------------------------------------

function PromptEditor({ prompts, onChange }: {
  prompts: ServiceConfig["prompts"];
  onChange: (p: ServiceConfig["prompts"]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-pretendard text-sm font-semibold text-gray-700">미리보기 (preview)</h4>
        <div className="space-y-3">
          <StringField label="system" value={prompts.preview.system}
            onChange={(v) => onChange({ ...prompts, preview: { ...prompts.preview, system: v } })} multiline />
          <StringField label="user" value={prompts.preview.user}
            onChange={(v) => onChange({ ...prompts, preview: { ...prompts.preview, user: v } })} multiline />
        </div>
      </div>
      <div>
        <h4 className="mb-2 font-pretendard text-sm font-semibold text-gray-700">풀 분석 (fullAnalysis)</h4>
        <div className="space-y-3">
          <StringField label="system" value={prompts.fullAnalysis.system}
            onChange={(v) => onChange({ ...prompts, fullAnalysis: { ...prompts.fullAnalysis, system: v } })} multiline />
          <StringField label="user" value={prompts.fullAnalysis.user}
            onChange={(v) => onChange({ ...prompts, fullAnalysis: { ...prompts.fullAnalysis, user: v } })} multiline />
          <JsonField label="outputSchema" value={prompts.fullAnalysis.outputSchema}
            onChange={(v) => onChange({ ...prompts, fullAnalysis: { ...prompts.fullAnalysis, outputSchema: v as Record<string, unknown> } })} />
        </div>
      </div>
      {prompts.compatibility !== undefined && (
        <div>
          <h4 className="mb-2 font-pretendard text-sm font-semibold text-gray-700">궁합 (compatibility)</h4>
          <div className="space-y-3">
            <StringField label="system" value={prompts.compatibility?.system || ""}
              onChange={(v) => onChange({ ...prompts, compatibility: { system: v, user: prompts.compatibility?.user || "" } })} multiline />
            <StringField label="user" value={prompts.compatibility?.user || ""}
              onChange={(v) => onChange({ ...prompts, compatibility: { system: prompts.compatibility?.system || "", user: v } })} multiline />
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Time options editor
// ---------------------------------------------------------------------------

function TimeOptionsEditor({ options, onChange }: {
  options: { value: string; label: string; disabled?: boolean }[];
  onChange: (opts: { value: string; label: string; disabled?: boolean }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="text" value={opt.value}
            onChange={(e) => { const n = [...options]; n[i] = { ...n[i], value: e.target.value }; onChange(n); }}
            placeholder="value"
            className="w-24 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 font-mono text-xs text-gray-700 focus:border-blue-400 focus:outline-none" />
          <input type="text" value={opt.label}
            onChange={(e) => { const n = [...options]; n[i] = { ...n[i], label: e.target.value }; onChange(n); }}
            placeholder="label"
            className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none" />
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={!!opt.disabled}
              onChange={(e) => { const n = [...options]; n[i] = { ...n[i], disabled: e.target.checked || undefined }; onChange(n); }}
              className="rounded border-gray-300" />
            <span className="text-xs text-gray-400">비활성</span>
          </label>
          <button onClick={() => onChange(options.filter((_, j) => j !== i))}
            className="rounded p-1 text-red-400 hover:bg-red-50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...options, { value: "", label: "" }])}
        className="font-pretendard text-xs text-blue-600 hover:underline">
        + 옵션 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Script editor sub-components
// ---------------------------------------------------------------------------

function ScriptStepsEditor({ steps, onChange }: {
  steps: Record<string, { cta: string; header?: string }>;
  onChange: (s: Record<string, { cta: string; header?: string }>) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(steps).map(([key, val]) => (
        <div key={key} className="rounded-md border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-600">{key}</span>
            <button onClick={() => { const n = { ...steps }; delete n[key]; onChange(n); }}
              className="text-red-400 hover:text-red-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <StringField label="cta" value={val.cta} onChange={(v) => onChange({ ...steps, [key]: { ...val, cta: v } })} />
            <StringField label="header" value={val.header || ""} onChange={(v) => onChange({ ...steps, [key]: { ...val, header: v || undefined } })} />
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          const newKey = prompt("스텝 ID를 입력하세요:");
          if (newKey) onChange({ ...steps, [newKey]: { cta: "다음" } });
        }}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 스텝 스크립트 추가
      </button>
    </div>
  );
}

function ScriptFieldsEditor({ fields, onChange }: {
  fields: Record<string, { label: string; placeholder?: string; calendarLabels?: [string, string]; unknownLabel?: string }>;
  onChange: (f: typeof fields) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(fields).map(([key, val]) => (
        <div key={key} className="rounded-md border border-gray-100 bg-gray-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs text-gray-600">{key}</span>
            <button onClick={() => { const n = { ...fields }; delete n[key]; onChange(n); }}
              className="text-red-400 hover:text-red-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <StringField label="label" value={val.label} onChange={(v) => onChange({ ...fields, [key]: { ...val, label: v } })} />
            <StringField label="placeholder" value={val.placeholder || ""} onChange={(v) => onChange({ ...fields, [key]: { ...val, placeholder: v || undefined } })} />
          </div>
          {val.calendarLabels && (
            <div className="mt-2">
              <StringField label="calendarLabels (쉼표 구분)" value={val.calendarLabels.join(",")}
                onChange={(v) => onChange({ ...fields, [key]: { ...val, calendarLabels: v.split(",").slice(0, 2) as [string, string] } })} />
            </div>
          )}
          {val.unknownLabel !== undefined && (
            <div className="mt-2">
              <StringField label="unknownLabel" value={val.unknownLabel || ""}
                onChange={(v) => onChange({ ...fields, [key]: { ...val, unknownLabel: v || undefined } })} />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={() => {
          const newKey = prompt("필드 키를 입력하세요:");
          if (newKey) onChange({ ...fields, [newKey]: { label: newKey } });
        }}
        className="font-pretendard text-xs text-blue-600 hover:underline"
      >
        + 필드 스크립트 추가
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type ActiveTab = "service" | "script" | "json";

export default function ServiceEditorPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = use(params);
  const [service, setService] = useState<ServiceConfig | null>(null);
  const [script, setScript] = useState<ServiceScript | null>(null);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("service");
  const [jsonText, setJsonText] = useState("");
  const [jsonTarget, setJsonTarget] = useState<"service" | "script">("service");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`);
      const data = (await res.json()) as {
        source: string;
        service: ServiceConfig;
        script: ServiceScript | null;
      };
      setService(data.service);
      setScript(data.script);
      setSource(data.source);
      setJsonText(JSON.stringify(data.service, null, 2));
    } catch {
      showToast("설정 로드 실패");
    }
    setLoading(false);
  }, [serviceId]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Sync jsonText when switching json target
  useEffect(() => {
    if (activeTab === "json") {
      const target = jsonTarget === "service" ? service : script;
      setJsonText(JSON.stringify(target, null, 2));
    }
  }, [jsonTarget, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!service) return;
    setSaving(true);
    try {
      let svcToSave = service;
      let scrToSave = script;

      if (activeTab === "json") {
        const parsed = JSON.parse(jsonText);
        if (jsonTarget === "service") svcToSave = parsed;
        else scrToSave = parsed;
      }

      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: svcToSave,
          script: scrToSave,
        }),
      });
      if (!res.ok) throw new Error();
      showToast("저장 완료");
      setSource("r2");

      // Sync state
      if (activeTab === "json") {
        const parsed = JSON.parse(jsonText);
        if (jsonTarget === "service") setService(parsed);
        else setScript(parsed);
      }
    } catch {
      showToast("저장 실패");
    }
    setSaving(false);
  };

  const updateService = <K extends keyof ServiceConfig>(key: K, val: ServiceConfig[K]) => {
    if (!service) return;
    setService({ ...service, [key]: val });
  };

  const updateScript = <K extends keyof ServiceScript>(key: K, val: ServiceScript[K]) => {
    if (!script) return;
    setScript({ ...script, [key]: val });
  };

  // Step helpers
  const updateStep = (i: number, step: Step) => {
    if (!service) return;
    const steps = [...service.steps];
    steps[i] = step;
    updateService("steps", steps);
  };
  const moveStep = (i: number, dir: -1 | 1) => {
    if (!service) return;
    const steps = [...service.steps];
    const t = i + dir;
    if (t < 0 || t >= steps.length) return;
    [steps[i], steps[t]] = [steps[t], steps[i]];
    updateService("steps", steps);
  };
  const removeStep = (i: number) => {
    if (!service || !confirm("이 스텝을 삭제하시겠습니까?")) return;
    updateService("steps", service.steps.filter((_, j) => j !== i));
  };

  // Section helpers
  const updateSection = (i: number, section: ResultSection) => {
    if (!service) return;
    const sections = [...service.resultPage.sections];
    sections[i] = section;
    updateService("resultPage", { ...service.resultPage, sections });
  };
  const moveSection = (i: number, dir: -1 | 1) => {
    if (!service) return;
    const sections = [...service.resultPage.sections];
    const t = i + dir;
    if (t < 0 || t >= sections.length) return;
    [sections[i], sections[t]] = [sections[t], sections[i]];
    updateService("resultPage", { ...service.resultPage, sections });
  };
  const removeSection = (i: number) => {
    if (!service || !confirm("이 섹션을 삭제하시겠습니까?")) return;
    updateService("resultPage", {
      ...service.resultPage,
      sections: service.resultPage.sections.filter((_, j) => j !== i),
    });
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!service) {
    return <div className="p-6 font-pretendard text-gray-500">서비스를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <div className="flex items-center gap-3">
            <a href="/admin/services" className="font-pretendard text-sm text-gray-400 hover:text-blue-600">
              &larr; 목록
            </a>
            <h1 className="font-pretendard text-xl font-bold text-gray-900">
              {service.meta.serviceTitle || serviceId}
            </h1>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              source === "r2" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
            }`}>
              {source === "r2" ? "R2 저장됨" : "번들 (기본값)"}
            </span>
            <span className="font-pretendard text-xs text-gray-400">{serviceId}</span>
            <a href={`/s/${serviceId}`} target="_blank" rel="noopener noreferrer"
              className="font-pretendard text-xs text-blue-500 hover:underline">
              미리보기 &nearr;
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
          <div className="flex gap-1">
            <TabButton active={activeTab === "service"} onClick={() => setActiveTab("service")}>
              service.json
            </TabButton>
            <TabButton active={activeTab === "script"} onClick={() => setActiveTab("script")}>
              script.json
            </TabButton>
            <TabButton active={activeTab === "json"} onClick={() => {
              setActiveTab("json");
              setJsonText(JSON.stringify(jsonTarget === "service" ? service : script, null, 2));
            }}>
              JSON
            </TabButton>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? "저장 중..." : "R2에 저장"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "json" ? (
          <div>
            <div className="mb-3 flex gap-2">
              <TabButton active={jsonTarget === "service"} onClick={() => setJsonTarget("service")}>
                service.json
              </TabButton>
              <TabButton active={jsonTarget === "script"} onClick={() => setJsonTarget("script")}>
                script.json
              </TabButton>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="h-[calc(100vh-250px)] w-full rounded-lg border border-gray-200 bg-white p-4 font-mono text-xs text-gray-800 focus:border-blue-400 focus:outline-none"
              spellCheck={false}
            />
          </div>
        ) : activeTab === "service" ? (
          <div className="mx-auto max-w-3xl space-y-4">
            {/* Meta */}
            <Section title="기본 정보 (meta)" defaultOpen>
              <div className="grid gap-3 sm:grid-cols-2">
                <StringField label="serviceId" value={service.meta.serviceId}
                  onChange={(v) => updateService("meta", { ...service.meta, serviceId: v })} />
                <StringField label="serviceTitle" value={service.meta.serviceTitle}
                  onChange={(v) => updateService("meta", { ...service.meta, serviceTitle: v })} />
                <StringField label="pageTitle" value={service.meta.pageTitle}
                  onChange={(v) => updateService("meta", { ...service.meta, pageTitle: v })} />
                <NumberField label="price" value={service.meta.price || 0}
                  onChange={(v) => updateService("meta", { ...service.meta, price: v })} />
                <StringField label="description" value={service.meta.description || ""}
                  onChange={(v) => updateService("meta", { ...service.meta, description: v })} multiline />
                <StringField label="version" value={service.meta.version || ""}
                  onChange={(v) => updateService("meta", { ...service.meta, version: v })} />
              </div>
              {/* Thumbnails */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h4 className="mb-3 font-pretendard text-xs font-semibold text-gray-500">썸네일 (랜딩페이지용)</h4>
                <div className="space-y-3">
                  <ImageField label="banner (캐러셀 배너)" value={service.meta.thumbnails?.banner || ""}
                    onChange={(v) => updateService("meta", { ...service.meta, thumbnails: { ...service.meta.thumbnails, banner: v || undefined } })} />
                  <ImageField label="card (추천/카테고리 카드)" value={service.meta.thumbnails?.card || ""}
                    onChange={(v) => updateService("meta", { ...service.meta, thumbnails: { ...service.meta.thumbnails, card: v || undefined } })} />
                  <ImageField label="rankBadge (순위 뱃지)" value={service.meta.thumbnails?.rankBadge || ""}
                    onChange={(v) => updateService("meta", { ...service.meta, thumbnails: { ...service.meta.thumbnails, rankBadge: v || undefined } })} />
                </div>
              </div>
            </Section>

            {/* Character */}
            <Section title="캐릭터 (character)">
              <div className="grid gap-3 sm:grid-cols-2">
                <StringField label="id" value={service.character.id}
                  onChange={(v) => updateService("character", { ...service.character, id: v })} />
                <StringField label="name" value={service.character.name}
                  onChange={(v) => updateService("character", { ...service.character, name: v })} />
                <StringField label="displayName" value={service.character.displayName}
                  onChange={(v) => updateService("character", { ...service.character, displayName: v })} />
                <ImageField label="avatar" value={service.character.avatar || ""}
                  onChange={(v) => updateService("character", { ...service.character, avatar: v })} />
                <StringField label="tone" value={service.character.tone || ""}
                  onChange={(v) => updateService("character", { ...service.character, tone: v })} multiline />
              </div>
            </Section>

            {/* Theme */}
            <Section title="테마 (theme)">
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.entries(service.theme) as [string, string][]).map(([key, val]) => (
                  key === "font"
                    ? <StringField key={key} label={key} value={val} onChange={(v) => updateService("theme", { ...service.theme, [key]: v })} />
                    : <ColorField key={key} label={key} value={val} onChange={(v) => updateService("theme", { ...service.theme, [key]: v })} />
                ))}
              </div>
            </Section>

            {/* Prompts */}
            <Section title="LLM 프롬프트 (prompts)">
              <PromptEditor prompts={service.prompts} onChange={(p) => updateService("prompts", p)} />
            </Section>

            {/* Dynamic images */}
            <Section title="동적 이미지 (dynamicImages)" badge={`${Object.keys(service.dynamicImages).length}개`}>
              <DynamicImageEditor rules={service.dynamicImages} onChange={(r) => updateService("dynamicImages", r)} />
            </Section>

            {/* Steps */}
            <Section title="스텝 (steps)" badge={`${service.steps.length}개`}>
              <div className="space-y-3">
                {service.steps.map((step, i) => (
                  <StepEditor key={`${step.id}-${i}`} step={step} index={i}
                    onChange={(s) => updateStep(i, s)}
                    onRemove={() => removeStep(i)}
                    onMove={(dir) => moveStep(i, dir)}
                    total={service.steps.length} />
                ))}
                <button
                  onClick={() => {
                    const newStep: Step = {
                      id: `step${service.steps.length + 1}`,
                      type: "fullscreen-image",
                      bgSrc: "",
                      next: "result",
                    };
                    updateService("steps", [...service.steps, newStep]);
                  }}
                  className="font-pretendard text-xs text-blue-600 hover:underline"
                >
                  + 스텝 추가
                </button>
              </div>
            </Section>

            {/* Result sections */}
            <Section title="결과 페이지 섹션" badge={`${service.resultPage.sections.length}개`}>
              <div className="space-y-3">
                {service.resultPage.sections.map((section, i) => (
                  <ResultSectionEditor key={`${section.type}-${i}`} section={section} index={i}
                    onChange={(s) => updateSection(i, s)}
                    onRemove={() => removeSection(i)}
                    onMove={(dir) => moveSection(i, dir)}
                    total={service.resultPage.sections.length} />
                ))}
                <div className="flex gap-2">
                  <select id="newSectionType"
                    className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 font-pretendard text-xs focus:border-blue-400 focus:outline-none">
                    {["webtoon-panel", "image-sequence", "saju-table", "daeun-table", "ohaeng", "speech-bubble", "destiny-partner", "wealth-graph", "crisis-list", "payment-gate", "spacer"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = (document.getElementById("newSectionType") as unknown as HTMLSelectElement).value;
                      const newSection = { type: sel } as ResultSection;
                      updateService("resultPage", {
                        ...service.resultPage,
                        sections: [...service.resultPage.sections, newSection],
                      });
                    }}
                    className="font-pretendard text-xs text-blue-600 hover:underline"
                  >
                    + 섹션 추가
                  </button>
                </div>
              </div>
            </Section>

            {/* Payment bar */}
            <Section title="결제 바 (paymentBar)">
              <div className="grid gap-3 sm:grid-cols-2">
                <StringField label="triggerAfter" value={service.resultPage.paymentBar.triggerAfter}
                  onChange={(v) => updateService("resultPage", {
                    ...service.resultPage,
                    paymentBar: { ...service.resultPage.paymentBar, triggerAfter: v },
                  })} />
                <div className="flex gap-2">
                  <NumberField label="h" value={service.resultPage.paymentBar.countdown.h}
                    onChange={(v) => updateService("resultPage", {
                      ...service.resultPage,
                      paymentBar: { ...service.resultPage.paymentBar, countdown: { ...service.resultPage.paymentBar.countdown, h: v } },
                    })} />
                  <NumberField label="m" value={service.resultPage.paymentBar.countdown.m}
                    onChange={(v) => updateService("resultPage", {
                      ...service.resultPage,
                      paymentBar: { ...service.resultPage.paymentBar, countdown: { ...service.resultPage.paymentBar.countdown, m: v } },
                    })} />
                  <NumberField label="s" value={service.resultPage.paymentBar.countdown.s}
                    onChange={(v) => updateService("resultPage", {
                      ...service.resultPage,
                      paymentBar: { ...service.resultPage.paymentBar, countdown: { ...service.resultPage.paymentBar.countdown, s: v } },
                    })} />
                </div>
              </div>
            </Section>

            {/* Decorations */}
            <Section title="데코레이션 (decorations)">
              <div className="space-y-3">
                {(Object.entries(service.decorations) as [string, string][]).map(([key, val]) => (
                  <ImageField key={key} label={key} value={val}
                    onChange={(v) => updateService("decorations", { ...service.decorations, [key]: v } as ServiceConfig["decorations"])} />
                ))}
              </div>
            </Section>

            {/* Time options */}
            <Section title="시간 옵션 (timeOptions)" badge={`${service.timeOptions.length}개`}>
              <TimeOptionsEditor options={service.timeOptions}
                onChange={(opts) => updateService("timeOptions", opts)} />
            </Section>
          </div>
        ) : (
          /* Script tab */
          <div className="mx-auto max-w-3xl space-y-4">
            {script ? (
              <>
                {/* Character */}
                <Section title="캐릭터 (character)" defaultOpen>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <StringField label="id" value={script.character.id}
                      onChange={(v) => updateScript("character", { ...script.character, id: v })} />
                    <StringField label="name" value={script.character.name}
                      onChange={(v) => updateScript("character", { ...script.character, name: v })} />
                    <StringField label="displayName" value={script.character.displayName}
                      onChange={(v) => updateScript("character", { ...script.character, displayName: v })} />
                  </div>
                </Section>

                {/* Steps script */}
                <Section title="스텝 스크립트 (steps)" badge={`${Object.keys(script.steps).length}개`}>
                  <ScriptStepsEditor steps={script.steps}
                    onChange={(s) => updateScript("steps", s)} />
                </Section>

                {/* Fields script */}
                <Section title="필드 라벨 (fields)" badge={`${Object.keys(script.fields).length}개`}>
                  <ScriptFieldsEditor fields={script.fields}
                    onChange={(f) => updateScript("fields", f)} />
                </Section>

                {/* Result texts */}
                <Section title="결과 텍스트 (result)" badge={`${Object.keys(script.result).length}개`}>
                  <JsonField label="result" value={script.result}
                    onChange={(v) => updateScript("result", v as ServiceScript["result"])} />
                </Section>

                {/* Titles */}
                <Section title="섹션 타이틀 (titles)" badge={`${Object.keys(script.titles).length}개`}>
                  <div className="space-y-3">
                    {Object.entries(script.titles).map(([key, val]) => (
                      <StringField key={key} label={key} value={val}
                        onChange={(v) => updateScript("titles", { ...script.titles, [key]: v })} />
                    ))}
                    <button
                      onClick={() => {
                        const newKey = prompt("타이틀 키를 입력하세요:");
                        if (newKey) updateScript("titles", { ...script.titles, [newKey]: "" });
                      }}
                      className="font-pretendard text-xs text-blue-600 hover:underline"
                    >
                      + 타이틀 추가
                    </button>
                  </div>
                </Section>

                {/* Payment */}
                <Section title="결제 텍스트 (payment)">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <StringField label="discountLabel" value={script.payment.discountLabel}
                      onChange={(v) => updateScript("payment", { ...script.payment, discountLabel: v })} />
                    <StringField label="button" value={script.payment.button}
                      onChange={(v) => updateScript("payment", { ...script.payment, button: v })} />
                  </div>
                </Section>
              </>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="font-pretendard text-sm text-gray-400">
                  script.json이 없습니다.
                </p>
                <button
                  onClick={() => setScript({
                    character: { id: "default", name: "", displayName: "" },
                    steps: {},
                    fields: {},
                    result: {},
                    titles: {},
                    payment: { discountLabel: "", button: "" },
                  })}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700"
                >
                  script.json 생성
                </button>
              </div>
            )}
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
