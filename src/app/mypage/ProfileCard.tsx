"use client";

import { useEffect, useState, useCallback } from "react";
import { cdnUrl } from "@/lib/cdn";
import ProfileEditDialog from "./ProfileEditDialog";

const TIME_LABELS: Record<string, string> = {
  unknown: "시간모름", joja: "조자시", chuk: "축시", in: "인시",
  myo: "묘시", jin: "진시", sa: "사시", oh: "오시",
  mi: "미시", shin: "신시", yu: "유시", sul: "술시",
  hae: "해시", yaja: "야자시",
};

interface Profile {
  email: string;
  name: string | null;
  displayName: string | null;
  birthdate: string | null;
  birthtime: string | null;
  gender: string | null;
  calendarType: string;
  sajuBadge: string | null;
}

export default function ProfileCard({ userName }: { userName?: string | null }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfile = useCallback(() => {
    fetch("/api/profile")
      .then((r) => r.json() as Promise<Profile>)
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (data: {
    displayName: string;
    birthdate: string;
    birthtime: string;
    gender: string;
    calendarType: string;
  }) => {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    fetchProfile();
  };

  const displayName = profile?.displayName || profile?.name || userName || "사용자";
  const hasProfile = profile?.birthdate && profile?.gender;
  const calendarLabel = profile?.calendarType === "lunar" ? "음력" : "양력";
  const timeLabel = profile?.birthtime ? TIME_LABELS[profile.birthtime] : null;
  const isTimeUnknown = !profile?.birthtime || profile.birthtime === "unknown";

  return (
    <>
      {/* 힌트 박스 - 시간 미입력일 때만 표시 */}
      {(!hasProfile || isTimeUnknown) && (
        <div className="mt-4 rounded-[0.25rem] bg-[#F1F1F1] px-3 py-2">
          <span className="font-pretendard text-xs font-bold text-[#2D4A71]">
            {!hasProfile
              ? "💡 프로필을 설정하고 맞춤 사주 결과를 받아보세요!"
              : "💡 태어난 시를 입력하고 더 정확한 결과를 받아보세요!"}
          </span>
        </div>
      )}

      {/* 프로필 카드 */}
      <div className="mt-4 rounded-2xl border border-[#E1E1E1] p-6">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="h-[6.25rem] w-[6.25rem] shrink-0 overflow-hidden rounded-full border border-[#E1E1E1]">
            <img
              src={cdnUrl("profile/default_profile.png")}
              alt="프로필"
              className="h-full w-full object-cover"
            />
          </div>

          {/* 프로필 정보 */}
          <div className="min-w-0">
            {loading ? (
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-pretendard text-2xl font-bold text-[#424242]">
                    {displayName}
                  </span>
                  {profile?.sajuBadge && (
                    <span className="rounded-lg bg-[#F0F8FF] px-2 py-1.5 font-pretendard text-xs font-bold text-[#424242]">
                      # {profile.sajuBadge}
                    </span>
                  )}
                </div>
                {hasProfile ? (
                  <>
                    <div className="mt-1 flex items-center gap-2 font-pretendard text-sm font-normal text-[#424242]">
                      <span>{profile.birthdate} [{calendarLabel}]</span>
                      <span className="border-r border-[#A1A1A1]" />
                      <span>{profile.gender}</span>
                    </div>
                    {isTimeUnknown ? (
                      <div className="mt-0.5 font-pretendard text-sm text-[#A1A1A1]">
                        시간모름
                      </div>
                    ) : (
                      <div className="mt-0.5 font-pretendard text-sm text-[#A1A1A1]">
                        {timeLabel}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="mt-1 font-pretendard text-sm text-[#A1A1A1]">
                    프로필을 설정해주세요
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 프로필 편집 버튼 */}
        <button
          onClick={() => setEditOpen(true)}
          className="mt-6 h-12 w-full cursor-pointer rounded-[0.625rem] bg-[#F1F1F1] font-pretendard text-base font-normal text-[#424242]"
        >
          프로필 편집
        </button>
      </div>

      {/* 프로필 편집 다이얼로그 */}
      <ProfileEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
        initial={{
          displayName: profile?.displayName || profile?.name || userName,
          birthdate: profile?.birthdate,
          birthtime: profile?.birthtime,
          gender: profile?.gender,
          calendarType: profile?.calendarType,
        }}
      />
    </>
  );
}
