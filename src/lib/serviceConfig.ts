// ═══════════════════════════════════════════════════════════════
// service.json 타입 — 서비스 플로우, 테마, 프롬프트, 동적이미지
// ═══════════════════════════════════════════════════════════════

// === 스텝 관련 타입 ===

export interface GradientConfig {
  height: number;
  from?: string;
}

export interface ShowWhen {
  field: string;
  hasValue?: boolean;     // true면 값이 있기만 하면 표시
  values?: string[];      // 특정 값 중 하나에 매칭될 때만 표시
}

export interface FormFieldDef {
  key: string;
  type: "text" | "birthdate" | "time-select" | "button-group" | "select" | "textarea";
  maxLength?: number;
  options?: string[];
  optional?: boolean;
  showWhen?: ShowWhen;
}

export interface StepBase {
  id: string;
  prev?: string;
  next?: string;
}

export interface HeroStep extends StepBase {
  type: "hero";
  bgType: "video" | "image";
  bgSrc: string;
  bgPoster?: string;
  titleImage?: string;
  topGradient?: GradientConfig;
}

export interface FullscreenImageStep extends StepBase {
  type: "fullscreen-image";
  bgSrc: string;
  bottomGradient?: GradientConfig;
}

export interface FormStep extends StepBase {
  type: "form";
  stepNumber: number;
  totalSteps: number;
  bgSrc: string;
  topGradient?: GradientConfig;
  bottomGradient?: GradientConfig;
  fields: FormFieldDef[];
}

export type Step = HeroStep | FullscreenImageStep | FormStep;

// === 결과 페이지 섹션 타입 ===

export interface WebtoonPanelSection {
  type: "webtoon-panel";
  image?: string;
  scriptKey?: string; // script.json의 result.{key} 참조
  className?: string;
}

export interface ImageSequenceSection {
  type: "image-sequence";
  images: string[];
  className?: string;
}

export interface SajuTableSection {
  type: "saju-table";
  className?: string;
}

export interface DaeunTableSection {
  type: "daeun-table";
  className?: string;
}

export interface OhaengSectionConfig {
  type: "ohaeng";
  className?: string;
}

export interface SpeechBubbleSection {
  type: "speech-bubble";
  scriptKey?: string; // script.json 참조
  className?: string;
}

export interface DestinyPartnerSection {
  type: "destiny-partner";
  imageKey?: string; // dynamicImages 참조
  className?: string;
}

export interface WealthGraphSection {
  type: "wealth-graph";
  imageKey?: string; // dynamicImages 참조
  scriptKey?: string; // script.json 참조
  className?: string;
}

export interface CrisisListSection {
  type: "crisis-list";
  className?: string;
}

export interface PaymentGateSection {
  type: "payment-gate";
  image: string;
  aspectRatio: string;
  buttonPosition: { top: string; height: string; px: string };
}

export interface SpacerSection {
  type: "spacer";
  className?: string;
}

export type ResultSection =
  | WebtoonPanelSection
  | ImageSequenceSection
  | SajuTableSection
  | DaeunTableSection
  | OhaengSectionConfig
  | SpeechBubbleSection
  | DestinyPartnerSection
  | WealthGraphSection
  | CrisisListSection
  | PaymentGateSection
  | SpacerSection;

// === 동적 이미지 ===

export interface DynamicImageVariable {
  source: string; // "input.gender", "saju.dayMaster.korean", etc.
  map?: Record<string, string>; // 값 매핑 (예: "남성" → "FEMALE")
}

export interface DynamicImageRule {
  pattern: string; // "result/characters/{gender}_{ilgan}_{strength}.png"
  variables: Record<string, DynamicImageVariable>;
  fallback?: string;
}

// === LLM 프롬프트 ===

export interface PromptTemplate {
  system: string;
  user: string;
}

export interface PromptConfig {
  preview: PromptTemplate;
  fullAnalysis: PromptTemplate & {
    outputSchema: Record<string, unknown>;
  };
  compatibility?: PromptTemplate | null;
}

// === 서비스 설정 (service.json) ===

export interface ServiceThumbnails {
  banner?: string;     // 캐러셀 배너 이미지 (예: banner.png)
  card?: string;       // 추천/카테고리 카드 이미지 (예: card.png)
  rankBadge?: string;  // 랭킹 뱃지 이미지
}

export interface ServiceMeta {
  serviceId: string;
  version?: string;
  serviceTitle: string;
  pageTitle: string;
  price?: number;
  description?: string;
  thumbnails?: ServiceThumbnails;
}

export interface CharacterDef {
  id: string;
  name: string;
  displayName: string;
  avatar?: string;
  tone?: string;
}

export interface ThemeConfig {
  primary: string;
  cardBorder: string;
  cardBg: string;
  cardAccent: string;
  resultBg: string;
  font?: string;
}

export interface PaymentBarConfig {
  triggerAfter: string; // 이 섹션 타입 이후에 노출
  countdown: { h: number; m: number; s: number };
}

export interface TimeOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Decorations {
  leftCloud: string;
  rightCloud: string;
  fiveCircle: string;
  fiveCircleLegend: string;
  strengthDiagram: string;
}

export interface ServiceConfig {
  meta: ServiceMeta;
  character: CharacterDef;
  theme: ThemeConfig;
  prompts: PromptConfig;
  dynamicImages: Record<string, DynamicImageRule>;
  steps: Step[];
  resultPage: {
    sections: ResultSection[];
    paymentBar: PaymentBarConfig;
  };
  decorations: Decorations;
  timeOptions: TimeOption[];
}

// ═══════════════════════════════════════════════════════════════
// script.json 타입 — 대사, 텍스트, 라벨
// ═══════════════════════════════════════════════════════════════

export interface TextOverlay {
  text: string;
  position: Record<string, string>; // CSS position props
}

export interface StepScript {
  cta: string;
  header?: string;
}

export interface FieldScript {
  label: string;
  placeholder?: string;
  calendarLabels?: [string, string];
  unknownLabel?: string;
}

export interface ServiceScript {
  character: {
    id: string;
    name: string;
    displayName: string;
  };

  steps: Record<string, StepScript>;

  fields: Record<string, FieldScript>;

  result: Record<string, TextOverlay[] | string>;

  titles: Record<string, string>;

  payment: {
    discountLabel: string;
    button: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// 런타임 통합 타입 — 로더가 service + script를 합쳐서 전달
// ═══════════════════════════════════════════════════════════════

export interface LoadedServiceConfig {
  service: ServiceConfig;
  script: ServiceScript;
}
