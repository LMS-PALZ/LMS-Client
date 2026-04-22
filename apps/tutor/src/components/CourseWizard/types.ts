export interface CourseModuleDraft {
  id: string;
  title: string;
  type: "live" | "recorded" | "reading";
  description: string;
}
