"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface ServiceItem {
  id: string;
  name: string;
  source: "r2" | "bundled";
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newId, setNewId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = (await res.json()) as { services: ServiceItem[] };
      setServices(data.services);
    } catch {
      setError("서비스 목록을 불러올 수 없습니다");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreate = async () => {
    if (!newId.trim() || !newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: newId.trim(), serviceTitle: newTitle.trim() }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "생성 실패");
        setCreating(false);
        return;
      }
      setShowCreate(false);
      setNewId("");
      setNewTitle("");
      await loadServices();
    } catch {
      setError("서비스 생성 중 오류 발생");
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-pretendard text-xl font-bold text-gray-900">서비스 관리</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700"
        >
          + 새 서비스
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-pretendard text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-pretendard text-lg font-bold text-gray-900">
              새 서비스 만들기
            </h2>
            <div className="space-y-4">
              <label className="block">
                <span className="font-pretendard text-xs font-medium text-gray-500">
                  서비스 ID (영문 소문자, 숫자, 하이픈)
                </span>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-saju-service"
                  className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="font-pretendard text-xs font-medium text-gray-500">
                  서비스 제목
                </span>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="나만의 사주 서비스"
                  className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 font-pretendard text-sm text-gray-900 focus:border-blue-400 focus:outline-none"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreate(false);
                  setNewId("");
                  setNewTitle("");
                  setError(null);
                }}
                className="rounded-lg px-4 py-2 font-pretendard text-sm text-gray-600 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !newId.trim() || !newTitle.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/admin/services/${s.id}`}
            className="rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-pretendard text-base font-semibold text-gray-900">
                {s.name}
              </h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.source === "r2"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {s.source === "r2" ? "R2" : "번들"}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-gray-400">{s.id}</p>
            <p className="mt-3 font-pretendard text-xs text-blue-600">편집하기 &rarr;</p>
          </Link>
        ))}

        {services.length === 0 && (
          <div className="col-span-full rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="font-pretendard text-sm text-gray-400">
              등록된 서비스가 없습니다. 새 서비스를 만들어보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
