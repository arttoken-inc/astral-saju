import { loadServiceConfig } from "@/lib/configLoader";
import ServiceResultPage from "@/components/saju/ServiceResultPage";

export const revalidate = 3600;

export default async function ResultPage() {
  const config = await loadServiceConfig("bluemoonladysaju");
  return <ServiceResultPage config={config} />;
}
