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
    title: "Social Media Strategy: Viral Campaigns",
    courseName: "Social Media Strategy: Viral Campaigns",
    startsAt: new Date(Date.now() + 3600000).toISOString(),
    isLive: true,
    meetingUrl: "https://meet.google.com/nfk-vzbi-yhm",
    description:
      "Students are introduced to the basics of UI and UX, the difference between them, and why product design is important. They will also learn about the 5 stages of design thinking (Empathize, Define, Ideate, Prototype, Test).",
  },
  {
    id: "s2",
    title: "Social Media Strategy: Viral Campaigns",
    courseName: "Social Media Strategy: Viral Campaigns",
    startsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    isLive: false,
  },
  {
    id: "s3",
    title: "Social Media Strategy: Viral Campaigns",
    courseName: "Social Media Strategy: Viral Campaigns",
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    isLive: false,
  },
];

export const mockAssignments: AssignmentListItem[] = [
  {
    id: "a1",
    title: "Social Media Strategy: Viral Campaigns",
    courseId: "c1",
    courseName: "Web Foundations",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    status: "not-started",
  },
  {
    id: "a3",
    title: "Social Media Strategy: Viral Campaigns",
    courseId: "c1",
    courseName: "Web Foundations",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    status: "not-started",
  },
  {
    id: "a4",
    title: "Social Media Strategy: Viral Campaigns",
    courseId: "c1",
    courseName: "Web Foundations",
    dueAt: new Date(Date.now() - 3600000).toISOString(),
    status: "overdue",
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
    message: "Your assignment for 6th May has been graded.",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "n2",
    message:
      "This is to inform you that there won't be a live class on 9/05/2026",
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
  },
];
