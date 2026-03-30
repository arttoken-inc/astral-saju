import type { Metadata } from "next";
import { auth, signOut } from "@/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin | 청월당",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex h-[100dvh] bg-gray-50">
      <aside className="flex w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <a href="/" className="font-pretendard text-lg font-bold text-gray-900">
            청월당 Admin
          </a>
        </div>

        <AdminNav />

        <div className="mt-auto border-t border-gray-200 p-4">
          <div className="mb-2 truncate font-pretendard text-sm text-gray-600">
            {user?.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="font-pretendard text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
