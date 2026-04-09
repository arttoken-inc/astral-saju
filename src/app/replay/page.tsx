import type { Metadata } from "next";
import { auth } from "@/auth";
import ReplayClient from "./ReplayClient";

export const metadata: Metadata = {
  title: "프리미엄 운세 결과 다시보기 | 청월당 사주",
};

export default async function ReplayPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <ReplayClient
      userName={user?.name ?? "사용자"}
      userEmail={user?.email ?? ""}
    />
  );
}
