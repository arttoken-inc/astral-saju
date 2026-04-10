"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import type {
  LoadedServiceConfig,
  Step,
  FormFieldDef,
  FormStep,
  ServiceScript,
} from "@/lib/serviceConfig";
import { resolveServiceImagePath } from "@/lib/configLoader";
import StepLayout, { PrevButton, CTAButton } from "./StepLayout";
import TextField from "./fields/TextField";
import BirthdateField from "./fields/BirthdateField";
import TimeSelectField from "./fields/TimeSelectField";
import ButtonGroupField from "./fields/ButtonGroupField";
import SelectField from "./fields/SelectField";
import TextareaField from "./fields/TextareaField";
import { cdnUrl } from "@/lib/cdn";

const TRANSITION_MS = 350;

/** Resolve an image path from service.json (relative to serviceId) */
function img(serviceId: string, path: string): string {
  return cdnUrl(resolveServiceImagePath(serviceId, path));
}

/** Preload an image and resolve when ready (or timeout) */
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    // Don't wait forever
    const timer = setTimeout(resolve, 2000);
    image.onload = () => { clearTimeout(timer); resolve(); };
    image.onerror = () => { clearTimeout(timer); resolve(); };
    image.src = src;
  });
}

/** Loading screen shown until hero content is ready */
function HeroLoadingScreen({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#111111] transition-opacity duration-500 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/20 border-t-white/80" />
    </div>
  );
}

/** Video with poster fallback — shows poster until video can play smoothly */
function HeroVideo({
  videoSrc,
  posterSrc,
  onPosterReady,
}: {
  videoSrc: string;
  posterSrc: string;
  onPosterReady: () => void;
}) {
  const posterRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  // Check if poster already loaded (cached/preloaded)
  useEffect(() => {
    if (posterRef.current?.complete && posterRef.current.naturalWidth > 0) {
      onPosterReady();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onReady = () => setVideoReady(true);
    if (v.readyState >= 3) { setVideoReady(true); return; }
    v.addEventListener("canplaythrough", onReady);
    return () => v.removeEventListener("canplaythrough", onReady);
  }, []);

  return (
    <div className="absolute inset-0 h-full w-full">
      <img
        ref={posterRef}
        src={posterSrc}
        alt="배경"
        className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${videoReady ? "opacity-0" : "opacity-100"}`}
        onLoad={onPosterReady}
      />
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </div>
  );
}

function SajuHeader() {
  return (
    <header className="inset-x-0 top-0 z-50 flex justify-center h-[3.75rem] absolute bg-transparent mx-auto max-w-md">
      <div className="flex w-full items-center justify-between px-5">
        <a className="flex items-center gap-2" href="/">
          <Image src="/logos/logo_with_white_typo.png" alt="logo" width={120} height={24} className="h-6 w-auto" priority />
        </a>
        <a className="flex h-7 w-7 items-center justify-center text-white" href="/mypage">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16 15H8C5.79086 15 4 16.7909 4 19V21H20V19C20 16.7909 18.2091 15 16 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </header>
  );
}

function resolveStepId(stepParam: string | null): string {
  if (!stepParam) return "home";
  return stepParam.replace("step_", "");
}

/** Get field label/placeholder from script.json, falling back to field key */
function fieldLabel(script: ServiceScript, fieldKey: string, prop: "label" | "placeholder" | "unknownLabel" | "calendarLabels"): string | [string, string] | undefined {
  const f = script.fields[fieldKey];
  if (!f) return prop === "label" ? fieldKey : undefined;
  return (f as unknown as Record<string, unknown>)[prop] as string | [string, string] | undefined;
}

function StepContent({ config }: { config: LoadedServiceConfig }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");

  const { service, script } = config;
  const serviceId = service.meta.serviceId;
  const baseUrl = `/s/${serviceId}`;
  const steps = service.steps;

  const [currentStepId, setCurrentStepId] = useState(() => resolveStepId(stepParam));
  const [opacity, setOpacity] = useState(1);
  const isTransitioning = useRef(false);

  const [heroLoading, setHeroLoading] = useState(true);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [unknownTime, setUnknownTime] = useState(false);

  useEffect(() => {
    const urlStepId = resolveStepId(stepParam);
    if (urlStepId !== currentStepId && !isTransitioning.current) {
      isTransitioning.current = true;

      // Preload first, then transition
      const nextStep = steps.find((s) => s.id === urlStepId);
      const preload = nextStep && "bgSrc" in nextStep
        ? preloadImage(img(serviceId, nextStep.bgSrc as string))
        : Promise.resolve();

      preload.then(() => {
        setOpacity(0);
        setTimeout(() => {
          setCurrentStepId(urlStepId);
          requestAnimationFrame(() => {
            setOpacity(1);
            isTransitioning.current = false;
          });
        }, TRANSITION_MS);
      });
    }
  }, [stepParam]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentStep = steps.find((s) => s.id === currentStepId) ?? steps[0];

  // Eagerly preload adjacent steps' background images
  useEffect(() => {
    const adjacentIds = [currentStep.next, "prev" in currentStep ? (currentStep as { prev?: string }).prev : undefined].filter(Boolean) as string[];
    for (const id of adjacentIds) {
      if (id === "result") continue;
      const step = steps.find((s) => s.id === id);
      if (step && "bgSrc" in step) {
        preloadImage(img(serviceId, step.bgSrc as string));
      }
    }
  }, [currentStepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get CTA text from script.json
  const stepScript = script.steps[currentStep.id];
  const ctaText = stepScript?.cta ?? "다음";

  const setField = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const goTo = async (stepId: string | undefined) => {
    if (!stepId || isTransitioning.current) return;
    isTransitioning.current = true;

    // For result page, just save and navigate
    if (stepId === "result") {
      setOpacity(0);
      await new Promise((r) => setTimeout(r, TRANSITION_MS));
      try {
        sessionStorage.setItem(
          `saju_form_${serviceId}`,
          JSON.stringify({ ...formData, calendarType }),
        );
      } catch { /* ignore */ }
      router.push(`${baseUrl}/result`);
      isTransitioning.current = false;
      return;
    }

    // Preload next image FIRST (while current step is still visible)
    const nextStep = steps.find((s) => s.id === stepId);
    if (nextStep && "bgSrc" in nextStep) {
      await preloadImage(img(serviceId, nextStep.bgSrc as string));
    }

    // Image ready → now do the quick fade transition
    setOpacity(0);
    await new Promise((r) => setTimeout(r, TRANSITION_MS));

    setCurrentStepId(stepId);
    const newUrl = stepId === "home" ? baseUrl : `${baseUrl}?step=step_${stepId}`;
    window.history.pushState(null, "", newUrl);
    requestAnimationFrame(() => {
      setOpacity(1);
      isTransitioning.current = false;
    });
  };

  const transitionStyle: React.CSSProperties = {
    opacity,
    transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
    willChange: "opacity",
  };

  // === HERO ===
  if (currentStep.type === "hero") {
    const step = currentStep;
    return (
      <div className="mx-auto h-[100dvh] min-h-[100dvh] w-full max-w-[480px] overflow-hidden text-white relative" style={transitionStyle}>
        <HeroLoadingScreen visible={heroLoading} />
        <SajuHeader />
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
          {step.bgType === "video" ? (
            <HeroVideo
              videoSrc={img(serviceId, step.bgSrc)}
              posterSrc={img(serviceId, step.bgPoster ?? "")}
              onPosterReady={() => setHeroLoading(false)}
            />
          ) : (
            <img
              src={img(serviceId, step.bgSrc)}
              alt="배경"
              className="absolute inset-0 h-full w-full object-cover"
              onLoad={() => setHeroLoading(false)}
            />
          )}
        </div>
        <div className="absolute inset-0 z-20 flex flex-col opacity-100">
          {step.topGradient && (
            <div className="pointer-events-none absolute left-0 right-0 top-0" style={{ height: step.topGradient.height, backgroundImage: `linear-gradient(180deg, ${step.topGradient.from} 0%, rgba(17,17,17,0) 100%)` }} />
          )}
          <div className="relative flex min-h-0 w-full flex-1">
            <div className="absolute inset-0 flex flex-col px-5 overflow-y-auto">
              <div className="absolute bottom-0 left-0 px-5 py-0 mx-auto flex w-full flex-1 flex-col justify-end pb-10">
                {step.titleImage && (
                  <div className="absolute bottom-[120px] left-0 right-0 z-10 flex justify-center px-5">
                    <div className="relative w-full">
                      <img src={img(serviceId, step.titleImage)} alt="Title" className="h-full w-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-30">
            <div className="absolute bottom-0 left-0 right-0 z-10 w-full px-5 pb-10">
              <div className="mx-auto flex w-full gap-3">
                <CTAButton onClick={() => goTo(step.next)}>{ctaText}</CTAButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === FULLSCREEN IMAGE ===
  if (currentStep.type === "fullscreen-image") {
    const step = currentStep;
    return (
      <StepLayout
        bgType="image"
        bgSrc={img(serviceId, step.bgSrc)}
        bottomGradient={step.bottomGradient}
        style={transitionStyle}
        buttons={
          <>
            {step.prev && <PrevButton onClick={() => goTo(step.prev)} />}
            <CTAButton onClick={() => goTo(step.next)}>{ctaText}</CTAButton>
          </>
        }
      >
        <div />
      </StepLayout>
    );
  }

  // === FORM ===
  if (currentStep.type === "form") {
    const step = currentStep as FormStep;
    const headerText = stepScript?.header;
    return (
      <StepLayout
        bgType="image"
        bgSrc={img(serviceId, step.bgSrc)}
        topGradient={step.topGradient}
        bottomGradient={step.bottomGradient}
        style={transitionStyle}
        stepIndicator={step.stepNumber ? { current: step.stepNumber, total: step.totalSteps } : undefined}
        headerContent={
          headerText ? (
            <div className="mt-5">
              <div className="relative flex items-center gap-3">
                <h2 className="relative flex items-center gap-3 font-pretendard text-lg font-semibold leading-[1] tracking-[-0.45px] [text-shadow:rgba(0,0,0,0.35)_0px_0px_6px] before:absolute before:left-[-12px] before:block before:h-4 before:w-[2px] before:rounded-full before:content-['']" style={{ "--step-header-accent": service.theme.primary } as React.CSSProperties}>
                  {script.character.name}
                </h2>
              </div>
              <p className="mt-2 whitespace-pre-line font-pretendard text-base leading-[1.5] tracking-[-0.4px] [text-shadow:rgba(0,0,0,0.25)_0px_0px_4px]">
                {headerText}
              </p>
            </div>
          ) : undefined
        }
        buttons={
          <>
            {step.prev && <PrevButton onClick={() => goTo(step.prev)} />}
            <CTAButton onClick={() => goTo(step.next)}>{ctaText}</CTAButton>
          </>
        }
      >
        <div className="relative z-[60] flex w-full flex-1 flex-col items-end justify-end">
          <div className="w-full space-y-8 px-1">
            {step.fields.map((field: FormFieldDef) => {
              if (field.showWhen) {
                const depValue = formData[field.showWhen.field];
                if (field.showWhen.values) {
                  if (!depValue || !field.showWhen.values.includes(depValue)) return null;
                } else if (field.showWhen.hasValue && !depValue) {
                  return null;
                }
              }

              const label = fieldLabel(script, field.key, "label") as string;
              const placeholder = fieldLabel(script, field.key, "placeholder") as string | undefined;

              switch (field.type) {
                case "text":
                  return <TextField key={field.key} label={label} placeholder={placeholder} maxLength={field.maxLength} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} />;
                case "birthdate":
                  return <BirthdateField key={field.key} label={label} placeholder={placeholder} calendarLabels={fieldLabel(script, field.key, "calendarLabels") as [string, string] | undefined} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} calendarType={calendarType} onCalendarChange={setCalendarType} />;
                case "time-select":
                  return <TimeSelectField key={field.key} label={label} unknownLabel={fieldLabel(script, field.key, "unknownLabel") as string | undefined} options={service.timeOptions} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} unknownTime={unknownTime} onUnknownChange={setUnknownTime} />;
                case "button-group":
                  return <ButtonGroupField key={field.key} label={label} options={field.options || []} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} primaryColor={service.theme.primary} />;
                case "select":
                  return <SelectField key={field.key} label={label} optional={field.optional} placeholder={placeholder} options={field.options || []} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} />;
                case "textarea":
                  return <TextareaField key={field.key} label={label} optional={field.optional} placeholder={placeholder} maxLength={field.maxLength} value={formData[field.key] || ""} onChange={(v) => setField(field.key, v)} />;
                default:
                  return null;
              }
            })}
          </div>
        </div>
      </StepLayout>
    );
  }

  return null;
}

export default function ServiceStepPage({ config }: { config: LoadedServiceConfig }) {
  return (
    <Suspense>
      <StepContent config={config} />
    </Suspense>
  );
}
