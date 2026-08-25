import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@ssu/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
  });
}
