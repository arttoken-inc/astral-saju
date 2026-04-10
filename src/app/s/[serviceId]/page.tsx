import { preload } from "react-dom";
import { loadServiceConfig } from "@/lib/configLoader";
import { resolveServiceImagePath } from "@/lib/configLoader";
import { cdnUrl } from "@/lib/cdn";
import ServiceStepPage from "@/components/saju/ServiceStepPage";

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const config = await loadServiceConfig(serviceId);

  // Preload hero images so the browser fetches them before JS hydrates
  const heroStep = config.service.steps.find((s) => s.type === "hero");
  if (heroStep) {
    const img = (p: string) => cdnUrl(resolveServiceImagePath(serviceId, p));
    if ("bgPoster" in heroStep && heroStep.bgPoster) {
      preload(img(heroStep.bgPoster as string), { as: "image" });
    }
    if ("titleImage" in heroStep && heroStep.titleImage) {
      preload(img(heroStep.titleImage as string), { as: "image" });
    }
  }

  return <ServiceStepPage config={config} />;
}
