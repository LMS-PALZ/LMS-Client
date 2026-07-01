export interface ProgramClassroomModule {
  id: string;
  title: string;
  description?: string;
  weekLabel?: string;
  moduleType?: string;
  lessonCount: number;
  order?: number;
}

export interface ProgramClassroomSummary {
  id?: string;
  title?: string;
  description?: string;
  modules: ProgramClassroomModule[];
}
