export type ProgramApplicantStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | string;

export interface ProgramApplicant {
  id: string;
  programId: string;
  studentName: string;
  studentEmail: string;
  studentPhoneNumber?: string | null;
  motivation?: string | null;
  status: ProgramApplicantStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramApplicantsResponse {
  items: ProgramApplicant[];
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
