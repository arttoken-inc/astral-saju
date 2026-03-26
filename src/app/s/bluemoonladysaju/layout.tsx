import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "청월아씨 정통사주 - 청월당 프리미엄 사주 웹툰 | 청월당 사주",
};

export default function BluemoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
