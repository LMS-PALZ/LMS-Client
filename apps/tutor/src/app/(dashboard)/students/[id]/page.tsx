import { StudentDetailsClient } from "@/components/students-details/StudentDetailsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StudentDetailsClient id={id} />;
}
