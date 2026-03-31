"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { CDN_BASE as CDN_URL } from "@/lib/cdn";

interface R2File {
  key: string;
  name: string;
  size: number;
  uploaded: string;
  contentType: string;
}

interface R2Folder {
  name: string;
  prefix: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(contentType: string, name: string) {
  if (contentType.startsWith("image/")) return true;
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(name);
}

function isVideo(contentType: string, name: string) {
  if (contentType.startsWith("video/")) return true;
  return /\.(mp4|webm|mov)$/i.test(name);
}

export default function FilesPage() {
  const [prefix, setPrefix] = useState("");
  const [folders, setFolders] = useState<R2Folder[]>([]);
  const [files, setFiles] = useState<R2File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const fetchFiles = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/r2/list?prefix=${encodeURIComponent(p)}`);
      const data = (await res.json()) as { folders: R2Folder[]; files: R2File[] };
      setFolders(data.folders ?? []);
      setFiles(data.files ?? []);
    } catch {
      showToast("파일 목록 로드 실패");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles(prefix);
  }, [prefix, fetchFiles]);

  const navigateTo = (p: string) => setPrefix(p);

  const breadcrumbs = prefix
    .split("/")
    .filter(Boolean)
    .reduce<{ name: string; prefix: string }[]>((acc, part) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].prefix : "";
      acc.push({ name: part, prefix: prev + part + "/" });
      return acc;
    }, []);

  const handleUpload = async (fileList: FileList | File[]) => {
    setUploading(true);
    const fd = new FormData();
    fd.set("prefix", prefix);
    for (const f of fileList) fd.append("files", f);

    try {
      const res = await fetch("/api/admin/r2/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { uploaded: string[] };
      showToast(`${data.uploaded?.length ?? 0}개 업로드 완료`);
      fetchFiles(prefix);
    } catch {
      showToast("업로드 실패");
    }
    setUploading(false);
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`"${key}" 를 삭제하시겠습니까?`)) return;
    try {
      await fetch("/api/admin/r2/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: [key] }),
      });
      showToast("삭제 완료");
      fetchFiles(prefix);
    } catch {
      showToast("삭제 실패");
    }
  };

  const copyUrl = (key: string) => {
    navigator.clipboard.writeText(`${CDN_URL}/${key}`);
    showToast("URL 복사됨");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleUpload(e.dataTransfer.files);
  };

  return (
    <div
      className="flex h-full flex-col"
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="font-pretendard text-xl font-bold text-gray-900">파일 관리</h1>
          {/* Breadcrumb */}
          <div className="mt-1 flex items-center gap-1 font-pretendard text-sm text-gray-500">
            <button onClick={() => navigateTo("")} className="hover:text-blue-600">
              root
            </button>
            {breadcrumbs.map((b) => (
              <span key={b.prefix} className="flex items-center gap-1">
                <span>/</span>
                <button onClick={() => navigateTo(b.prefix)} className="hover:text-blue-600">
                  {b.name}
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-pretendard text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : "파일 업로드"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {dragOver && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-blue-600/10">
            <div className="rounded-xl bg-white px-8 py-6 shadow-lg">
              <p className="font-pretendard text-lg font-semibold text-blue-600">
                여기에 파일을 놓으세요
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        ) : (
          <>
            {/* Folders */}
            {folders.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 font-pretendard text-xs font-semibold uppercase tracking-wider text-gray-400">
                  폴더
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {folders.map((f) => (
                    <button
                      key={f.prefix}
                      onClick={() => navigateTo(f.prefix)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-left transition hover:border-blue-300 hover:bg-blue-50"
                    >
                      <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="truncate font-pretendard text-sm text-gray-700">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Files */}
            {files.length > 0 && (
              <div>
                <h2 className="mb-3 font-pretendard text-xs font-semibold uppercase tracking-wider text-gray-400">
                  파일 ({files.length})
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {files.map((f) => (
                    <div
                      key={f.key}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-md"
                    >
                      {/* Thumbnail */}
                      <div className="flex h-32 items-center justify-center bg-gray-50">
                        {isImage(f.contentType, f.name) ? (
                          <img
                            src={`${CDN_URL}/${f.key}`}
                            alt={f.name}
                            className="h-full w-full object-contain p-1"
                            loading="lazy"
                          />
                        ) : isVideo(f.contentType, f.name) ? (
                          <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>

                      {/* Info */}
                      <div className="px-2 py-2">
                        <p className="truncate font-pretendard text-xs font-medium text-gray-700" title={f.name}>
                          {f.name}
                        </p>
                        <p className="font-pretendard text-xs text-gray-400">{formatSize(f.size)}</p>
                      </div>

                      {/* Actions overlay */}
                      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={() => copyUrl(f.key)}
                          className="rounded bg-white/90 p-1 shadow hover:bg-white"
                          title="URL 복사"
                        >
                          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(f.key)}
                          className="rounded bg-white/90 p-1 shadow hover:bg-red-50"
                          title="삭제"
                        >
                          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {folders.length === 0 && files.length === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-gray-400">
                <svg className="mb-2 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <p className="font-pretendard text-sm">비어있는 폴더</p>
                <p className="mt-1 font-pretendard text-xs">파일을 드래그하여 업로드하세요</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2 font-pretendard text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
