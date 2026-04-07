import { loadServiceConfig } from "@/lib/configLoader";
import ServiceResultPage from "@/components/saju/ServiceResultPage";

export const revalidate = 3600;

export default async function ResultPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const config = await loadServiceConfig(serviceId);
  return <ServiceResultPage config={config} />;
}
