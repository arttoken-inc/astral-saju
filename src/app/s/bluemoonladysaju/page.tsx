import config from "@/data/services/bluemoonladysaju.json";
import ServiceStepPage from "@/components/saju/ServiceStepPage";
import type { ServiceConfig } from "@/lib/serviceConfig";

export default function Page() {
  return <ServiceStepPage config={config as unknown as ServiceConfig} />;
}
