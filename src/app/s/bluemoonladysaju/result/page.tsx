import { loadServiceConfig } from "@/lib/configLoader";
import ServiceResultPage from "@/components/saju/ServiceResultPage";

export const dynamic = "force-dynamic";

export default async function ResultPage() {
  const config = await loadServiceConfig("bluemoonladysaju");
  return <ServiceResultPage config={config} />;
}
