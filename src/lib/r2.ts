import { getCloudflareContext } from "@opennextjs/cloudflare";
import { auth } from "@/auth";

declare global {
  interface CloudflareEnv {
    R2: R2Bucket;
  }
}

export async function getR2(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.R2;
}

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? "";
  if (!adminEmails.includes(email)) {
    throw new Error("Unauthorized");
  }
  return session;
}
