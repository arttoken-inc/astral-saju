import { loadLandingConfig } from "@/lib/configLoader";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await loadLandingConfig();
  return <HomeClient config={config} />;
}
