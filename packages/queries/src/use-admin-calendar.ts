import { listAdminProgramClassrooms } from "@ssu/api";
import { useQuery } from "@tanstack/react-query";
import { buildAdminCalendarEvents } from "@/lib/calendar/mappers";

export const adminCalendarKeys = {
  all: ["admin-calendar"] as const,
};

export function useAdminCalendar() {
  return useQuery({
    queryKey: adminCalendarKeys.all,
    queryFn: async () => {
      const res = await listAdminProgramClassrooms();
      if (!res.ok) throw new Error(res.message);

      return {
        events: buildAdminCalendarEvents(res.data),
        programCount: res.data.length,
      };
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
