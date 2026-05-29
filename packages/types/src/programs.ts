export interface AvailableProgram {
  id: string;
  name: string;
  applicationFee: number;
  /** Cohort code from API (e.g. `FE-2026-C1`). */
  cohortId?: string;
  /** Program slug accepted by signup when id is not used. */
  slug?: string;
}
