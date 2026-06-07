"use client";

import { StudentDetails } from "@/components/students-details/studentdetail";

import {
  studentInfo,
  studentProfile,
  completionData,
  cumulativeScoreData,
  attendanceData,
} from "@ssu/api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <StudentDetails
      profile={studentProfile}
      info={studentInfo}
      completion={completionData}
      cumulativeScore={cumulativeScoreData}
      attendance={attendanceData}
      onRevokeAccess={() => console.log("revoke", id)}
    />
  );
}
