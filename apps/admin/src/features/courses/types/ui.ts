export type CourseDetailTab = "students" | "modules" | "cohorts";

export type CourseBuilderStep = 1 | 2;

export interface ModalControlProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ApplicantStatusDisplay {
  label: string;
  className: string;
}
