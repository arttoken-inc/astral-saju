import type { Metadata } from "next";
import { loadServiceConfig } from "@/lib/configLoader";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadServiceConfig("bluemoonladysaju");
  return { title: config.meta.pageTitle };
}

export default function BluemoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
