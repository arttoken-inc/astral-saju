import { loadServiceConfig } from "@/lib/configLoader";
import ServiceStepPage from "@/components/saju/ServiceStepPage";

export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const config = await loadServiceConfig(serviceId);
  return <ServiceStepPage config={config} />;
}
