"use client";

import { StudentProfile } from "@ssu/types";

interface StudentProfileCardProps {
  profile: StudentProfile;
}

export function StudentProfileCard({ profile }: StudentProfileCardProps) {
  return (
    <div className="flex items-center justify-between p-8">
      <div className="flex gap-2 flex-row items-center text-center">
        <img
          src={"/firstlogo.png"}
          alt={profile?.firstName}
          className="h-[40px] w-[40px] rounded-full object-cover"
        />
        <section>
          <span>
            <h2 className="mt-3 text-[18px] font-semibold">
              {`${profile?.firstName} ${profile?.lastName}`}
            </h2>
            <span>status</span>
          </span>

          <p className="mt-2 text-[15px] text-[#6B7280]">
            {profile?.programTitle}
          </p>
        </section>
      </div>
      <button className="text-[#4C7D5B]">suspend student</button>
    </div>
  );
}
