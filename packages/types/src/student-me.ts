export interface StudentMeStudent {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  status?: string;
  isVerified?: boolean;
  profileUploaded?: boolean;
  program?: string;
}

export interface StudentMeProgram {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  category?: string;
  programType?: string;
  priceAmount?: number;
  priceCurrency?: string;
  cohortName?: string;
  cohortCode?: string;
  cohortStartDate?: string;
  cohortEndDate?: string;
  /** Normalized aliases used by classroom UI. */
  startDate?: string;
  endDate?: string;
  capacity?: number;
  status?: string;
  assignedTutorIds?: string[];
  duration?: string;
  isLiveNow?: boolean;
  liveLesson?: StudentMeLiveLesson | null;
}

export interface StudentMeLiveLesson {
  programId: string;
  programTitle: string;
  lessonId: string;
  lessonTitle: string;
  startsAt: string;
  durationMinutes?: number;
  liveSessionUrl?: string | null;
  zoomJoinUrl?: string | null;
}

export type StudentMeLiveGeneralProgram = StudentMeLiveLesson;

export interface StudentMe {
  student?: StudentMeStudent | null;
  profile?: unknown;
  program?: StudentMeProgram | null;
  generalPrograms: StudentMeProgram[];
  liveGeneralPrograms: StudentMeLiveGeneralProgram[];
  hasLiveGeneralProgram: boolean;
}
