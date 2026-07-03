import { AssessmentClient } from "@/views/AssessmentDetailClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  console.log("Assessment id:", id);

  return <AssessmentClient assessmentId={id} />;
}
