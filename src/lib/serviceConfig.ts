// === 스텝 관련 타입 ===

export interface GradientConfig {
  height: number;
  from?: string;
}

export interface StepHeader {
  character: string;
  question: string;
}

export interface ShowWhen {
  field: string;
  hasValue: boolean;
}

export interface FormField {
  key: string;
  type: "text" | "birthdate" | "time-select" | "button-group" | "select" | "textarea";
  label: string;
  placeholder?: string;
  maxLength?: number;
  options?: string[];
  optional?: boolean;
  calendarLabels?: [string, string];
  unknownLabel?: string;
  showWhen?: ShowWhen;
}

export interface StepBase {
  id: string;
  cta: string;
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
  header?: StepHeader;
  fields: FormField[];
}

export type Step = HeroStep | FullscreenImageStep | FormStep;

// === 결과 페이지 섹션 타입 ===

export interface TextOverlay {
  content: string;
  style: Record<string, string>;
}

export interface ImageSection {
  type: "image";
  image: string;
  className?: string;
}

export interface ImageWithTextSection {
  type: "image-with-text";
  image: string;
  className?: string;
  texts: TextOverlay[];
}

export interface ImagePairSection {
  type: "image-pair";
  images: string[];
  className?: string;
}

export interface SajuTableSection {
  type: "saju-table";
  className?: string;
  bubbleImage: string;
  bubbleWidth: string;
}

export interface DaeunTableSection {
  type: "daeun-table";
  className?: string;
  bubbleImages: string[];
  bubbleWidths: string[];
}

export interface OhaengSectionConfig {
  type: "ohaeng";
  className?: string;
  bubbleImage: string;
  bubbleWidth: string;
}

export interface DestinyPartnerSection {
  type: "destiny-partner";
  title: string;
  className?: string;
}

export interface WealthGraphSection {
  type: "wealth-graph";
  className?: string;
  speechBubble: string;
  title: string;
}

export interface CrisisListSection {
  type: "crisis-list";
  title: string;
  className?: string;
}

export interface SpeechBubbleSection {
  type: "speech-bubble";
  text: string;
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
  | ImageSection
  | ImageWithTextSection
  | ImagePairSection
  | SajuTableSection
  | DaeunTableSection
  | OhaengSectionConfig
  | DestinyPartnerSection
  | WealthGraphSection
  | CrisisListSection
  | SpeechBubbleSection
  | PaymentGateSection
  | SpacerSection;

// === 데이터 타입 ===

export interface SipseongItem {
  hanja: string;
  hangul: string;
}

export interface SajuData {
  name: string;
  nameShort: string;
  birthDate: string;
  birthTime: string;
  cheongan: string[];
  jiji: string[];
  sipseongTop: SipseongItem[];
  sipseongBottom: SipseongItem[];
  sibiUnseong: SipseongItem[];
  sinsal: SipseongItem[];
  guin: string[];
}

export interface OhaengRatio {
  name: string;
  hanja: string;
  value: number;
  status: string;
  color: string;
}

export interface OhaengData {
  distribution: number[];
  ratio: OhaengRatio[];
  yongshin: { name: string; img: string };
  heeshin: { name: string; img: string };
  gishin: { name: string; img: string };
  strength: { ilgan: string; level: string };
}

export interface DaeunData {
  years: number[];
  ages: number[];
  startAge: number;
  cycle: number;
}

export interface DestinyPartnerData {
  job: string;
  appearance: string[];
  personality: string[];
  traits: string[];
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
  maskedWealthGraph: string;
  dreamPerson: string;
}

// === 서비스 설정 전체 ===

export interface ServiceConfig {
  meta: {
    serviceId: string;
    characterName: string;
    serviceTitle: string;
    pageTitle: string;
  };
  colors: {
    primary: string;
    cardBorder: string;
    cardBg: string;
    cardAccent: string;
    resultBg: string;
  };
  steps: Step[];
  resultPage: {
    sections: ResultSection[];
  };
  sampleData: SajuData;
  ohaengData: OhaengData;
  daeunData: DaeunData;
  destinyPartner: DestinyPartnerData;
  crisisList: string[];
  timeOptions: TimeOption[];
  decorations: Decorations;
}
