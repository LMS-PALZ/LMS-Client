"use client";

import { StudentProfile } from "@ssu/types";

interface StudentProfileCardProps {
  profile: StudentProfile;
}

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  return (
    <div className="rounded-[24px] border border-[#E6EBF0] bg-white p-8">
      <div className="flex flex-col items-center text-center">
        <img
          src={profile.image}
          alt={profile.name}
          className="h-[70px] w-[70px] rounded-full object-cover"
        />

        <h2 className="mt-3 text-[18px] font-semibold">{profile.name}</h2>

        <p className="mt-2 text-[15px] text-[#6B7280]">{profile.programme}</p>
      </div>
    </div>
  );
}
