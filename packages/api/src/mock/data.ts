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
    title: "Responsive Layouts with CSS Grid & Flexbox",
    courseName: "HTML & CSS Foundations",
    startsAt: new Date(Date.now() + 3600000).toISOString(),
    isLive: true,
    meetingUrl: "https://meet.google.com/nfk-vzbi-yhm",
    description:
      "Live workshop on semantic HTML, Flexbox, and CSS Grid for responsive landing pages.",
  },
  {
    id: "s2",
    title: "React Components & useState",
    courseName: "React & Component Design",
    startsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    isLive: false,
  },
  {
    id: "s3",
    title: "REST APIs & Deployment Walkthrough",
    courseName: "APIs, Auth & Deployment",
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    isLive: false,
  },
];

export const mockAssignments: AssignmentListItem[] = [
  {
    id: "a1",
    title: "Build a Responsive Landing Page",
    courseId: "c1",
    courseName: "HTML & CSS Foundations",
    moduleLabel: "Layout & Responsive CSS",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    status: "not-started",
  },
  {
    id: "a3",
    title: "Component Library Mini-Project",
    courseId: "c1",
    courseName: "React & Component Design",
    moduleLabel: "React Fundamentals",
    dueAt: new Date(Date.now() + 86400000).toISOString(),
    status: "not-started",
  },
  {
    id: "a4",
    title: "Interactive Form with Validation",
    courseId: "c1",
    courseName: "JavaScript & the DOM",
    moduleLabel: "DOM & Events",
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
