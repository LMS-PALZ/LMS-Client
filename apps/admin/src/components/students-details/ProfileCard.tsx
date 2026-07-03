"use client";

import { StudentProfile } from "@ssu/types";

interface StudentProfileCardProps {
  profile: StudentProfile;
}

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  return (
    <div className="flex items-center rounded-[24px] border border-[#E6EBF0] bg-[#F8FAF8] p-8">
      <div className="flex gap-2 flex-col items-center text-center">
        <img
          src={"/firstlogo.png"}
          alt={profile?.firstName}
          className="h-[40px] w-[40px] rounded-full object-cover"
        />
        <section>
          <h2 className="mt-3 text-[18px] font-semibold">
            {`${profile?.firstName} ${profile?.lastName}`}
          </h2>

          <p className="mt-2 text-[15px] text-[#6B7280]">
            {profile?.programTitle}
          </p>
        </section>
      </div>
    </div>
  );
}
