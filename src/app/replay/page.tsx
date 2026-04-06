import { redirect } from "next/navigation";

export default function ReplayPage() {
  redirect("/auth/login?from=replay");
}
