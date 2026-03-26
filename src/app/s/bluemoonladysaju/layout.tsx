import type { Metadata } from "next";
import config from "@/data/services/bluemoonladysaju.json";

export const metadata: Metadata = {
  title: config.meta.pageTitle,
};

export default function BluemoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
