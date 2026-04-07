import type { Metadata } from "next";
import { loadServiceConfig } from "@/lib/configLoader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}): Promise<Metadata> {
  const { serviceId } = await params;
  const config = await loadServiceConfig(serviceId);
  return { title: config.service.meta.pageTitle };
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
