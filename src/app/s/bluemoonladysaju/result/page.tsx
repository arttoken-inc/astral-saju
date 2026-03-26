import config from "@/data/services/bluemoonladysaju.json";
import ServiceResultPage from "@/components/saju/ServiceResultPage";
import type { ServiceConfig } from "@/lib/serviceConfig";

export default function ResultPage() {
  return <ServiceResultPage config={config as unknown as ServiceConfig} />;
}
