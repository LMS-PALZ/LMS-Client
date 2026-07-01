export type ProgramStatus = "draft" | "published" | string;

export interface AdminProgram {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  priceAmount: number;
  priceCurrency: string;
  cohortName?: string;
  cohortCode?: string;
  cohortStartDate?: string;
  cohortEndDate?: string;
  capacity?: number;
  status: ProgramStatus;
  assignedTutorIds: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProgramListResponse {
  items: AdminProgram[];
  pagination: {
    page: number;
    limit: number;
    offset: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateProgramPayload {
  title: string;
  description: string;
  category?: string;
  priceAmount: number;
  priceCurrency?: string;
  cohortName?: string;
  cohortCode?: string;
  cohortStartDate?: string;
  cohortEndDate?: string;
  capacity: number;
  status?: ProgramStatus;
  assignedTutorIds?: string[];
}

export interface UpdateProgramStatusPayload {
  status: ProgramStatus;
}
