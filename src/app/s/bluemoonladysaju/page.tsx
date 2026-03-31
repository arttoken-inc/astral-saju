import { loadServiceConfig } from "@/lib/configLoader";
import ServiceStepPage from "@/components/saju/ServiceStepPage";

export const revalidate = 3600;

export default async function Page() {
  const config = await loadServiceConfig("bluemoonladysaju");
  return <ServiceStepPage config={config} />;
}
