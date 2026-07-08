import type { AdminProgram, ProgramClassroomModule } from "@ssu/types";
import { listAdminPrograms } from "./admin-programs";
import { getProgramClassroomModules } from "./program-classroom";

export interface AdminProgramClassroomSnapshot {
  program: AdminProgram;
  modules: ProgramClassroomModule[];
}

async function listAllAdminPrograms() {
  const items: AdminProgram[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const res = await listAdminPrograms({ page, limit: 50 });
    if (!res.ok) {
      return { ok: false as const, message: res.message };
    }

    items.push(...res.data.items);
    hasNextPage = res.data.pagination.hasNextPage;
    page += 1;

    if (page > 20) break;
  }

  return { ok: true as const, data: items };
}

export async function listAdminProgramClassrooms() {
  const programsRes = await listAllAdminPrograms();
  if (!programsRes.ok) {
    return { ok: false as const, message: programsRes.message };
  }

  const snapshots = await Promise.all(
    programsRes.data.map(async (program) => {
      const modulesRes = await getProgramClassroomModules(program.id);
      return {
        program,
        modules: modulesRes.ok ? modulesRes.data : [],
      } satisfies AdminProgramClassroomSnapshot;
    }),
  );

  return {
    ok: true as const,
    data: snapshots,
    message: "",
  };
}
