import type {
  AssignmentListItem,
  CourseSummary,
  LiveSessionItem,
  NotificationDto,
} from "@ssu/types";

export const mockCourses: CourseSummary[] = [
  {
    id: "c1",
    title: "Web Foundations",
    trainerName: "Terry Trainer",
    progressPercent: 42,
  },
  {
    id: "c2",
    title: "Data Literacy",
    trainerName: "Terry Trainer",
    progressPercent: 100,
  },
];

export const mockSessions: LiveSessionItem[] = [
  {
    id: "s1",
    title: "Live Q&A",
    courseName: "Web Foundations",
    startsAt: new Date(Date.now() + 3600000).toISOString(),
    isLive: false,
  },
];

export const mockAssignments: AssignmentListItem[] = [
  {
    id: "a1",
    title: "Module 1 reflection",
    courseId: "c1",
    courseName: "Web Foundations",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    status: "not-started",
  },
  {
    id: "a2",
    title: "Capstone draft",
    courseId: "c2",
    courseName: "Data Literacy",
    dueAt: new Date(Date.now() - 86400000).toISOString(),
    status: "overdue",
  },
];

export const mockNotifications: NotificationDto[] = [
  {
    id: "n1",
    message: "Your submission was graded.",
    createdAt: new Date().toISOString(),
    read: false,
  },
];
