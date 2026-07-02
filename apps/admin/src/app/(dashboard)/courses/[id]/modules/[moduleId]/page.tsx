import { adminPath } from "@ssu/config/portal-paths";
import { redirect } from "next/navigation";

interface CourseModuleRouteProps {
  params: Promise<{ id: string; moduleId: string }>;
}

export default async function CourseModuleRoute({
  params,
}: CourseModuleRouteProps) {
  const { id, moduleId } = await params;
  redirect(
    adminPath(
      `/courses/${id}/activities/new?moduleId=${moduleId}&type=live_session`,
    ),
  );
}
