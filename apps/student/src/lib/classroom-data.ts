import type { ReactNode } from "react";

export const DEFAULT_MEET_LINK = "https://meet.google.com/nfk-vzbi-yhm";

export type SessionPhase = "live" | "upcoming" | "ended";

export type ClassroomLessonType = "live" | "recording" | "reading";

export interface ClassroomLesson {
  id: string;
  title: string;
  type: ClassroomLessonType;
  subtitle: string;
  completed?: boolean;
  description?: string;
  content?: ReactNode;
}

export interface ClassroomWeek {
  id: string;
  label: string;
  topic: string;
  expanded?: boolean;
  lessons: ClassroomLesson[];
}

export interface ClassroomCourseItem {
  id: string;
  title: string;
  courseLabel: string;
  syllabusCount: number;
}

export interface ClassroomCourseDetail {
  id: string;
  title: string;
  sessionLabel: string;
  sessionDuration: string;
  imageUrl: string;
  overview: string;
  recordingSummary: string;
  sessionPhase: SessionPhase;
  meetUrl: string;
  resources: Array<{
    id: string;
    title: string;
    meta: string;
  }>;
}

export interface ClassroomProgram {
  id: string;
  title: string;
  description: string;
  contentCount: string;
  duration: string;
  startDate: string;
  endDate: string;
  liveSession: {
    sessionId: string;
    courseId: string;
    title: string;
    time: string;
    date: string;
    phase: SessionPhase;
  };
  courseItems: ClassroomCourseItem[];
}

export const classroomProgram: ClassroomProgram = {
  id: "web-development",
  title: "Web Development",
  description:
    "You will learn how to build user-facing interfaces for websites and applications, focusing on layout, interaction, and usability.",
  contentCount: "4 courses",
  duration: "16 weeks",
  startDate: "10th May, 2026",
  endDate: "10th Oct, 2026",
  liveSession: {
    sessionId: "s1",
    courseId: "viral-campaigns",
    title: "Social Media Strategy: Viral Campaigns",
    time: "10:00am",
    date: "10/12",
    phase: "live",
  },
  courseItems: [
    {
      id: "viral-campaigns",
      title: "Social Media Strategy: Viral Campaigns",
      courseLabel: "Course 1",
      syllabusCount: 4,
    },
    {
      id: "client-essentials",
      title: "Social Media Strategy: Viral Campaigns",
      courseLabel: "Course 2",
      syllabusCount: 4,
    },
    {
      id: "community-growth",
      title: "Social Media Strategy: Viral Campaigns",
      courseLabel: "Course 3",
      syllabusCount: 4,
    },
    {
      id: "campaign-analytics",
      title: "Social Media Strategy: Viral Campaigns",
      courseLabel: "Course 4",
      syllabusCount: 4,
    },
  ],
};

export const classroomWeeks: ClassroomWeek[] = [
  {
    id: "week-1",
    label: "Week 1",
    topic: "Introduction to SEO",
    expanded: true,
    lessons: [
      {
        id: "l1",
        title: "Client Communications Essentials",
        subtitle: "Live Session - 10/10/26",
        type: "live",
        completed: true,
      },
      {
        id: "l2",
        title: "Client Communications Essentials",
        subtitle: "Live Session - 10/10/26",
        type: "live",
        completed: true,
      },
      {
        id: "l3",
        title: "Client Communications Essentials",
        subtitle: "Live Session - 10/10/26",
        type: "live",
        completed: true,
      },
      {
        id: "l4",
        title: "Client Communications Essentials",
        subtitle: "Live Session - 10/10/26",
        type: "live",
        completed: true,
      },
      {
        id: "l5",
        title: "Understand Communications Essentials",
        subtitle: "Reading",
        type: "reading",
      },
    ],
  },
  {
    id: "week-2",
    label: "Week 2",
    topic: "Introduction to SEO",
    lessons: [],
  },
  {
    id: "week-3",
    label: "Week 3",
    topic: "Introduction to SEO",
    lessons: [],
  },
  {
    id: "week-4",
    label: "Week 4",
    topic: "Introduction to SEO",
    lessons: [],
  },
];

export const classroomCourseDetails: ClassroomCourseDetail[] = [
  {
    id: "viral-campaigns",
    title: "Social Media Strategy: Viral Campaigns",
    sessionLabel: "LIVE SESSION",
    sessionDuration: "1:20:10",
    imageUrl: "/logo.png",
    overview:
      "Explanation: Students are introduced to the basics of UI and UX, the difference between them, and why product design is important. They will also learn about the 5 stages of design thinking (Empathize, Define, Ideate, Prototype, Test).",
    recordingSummary:
      "Recording: Rewatch the full class session to revisit the instructor's walkthrough, examples, and discussion points at your own pace.",
    sessionPhase: "live",
    meetUrl: DEFAULT_MEET_LINK,
    resources: [
      { id: "r1", title: "Week 1 Slide Deck", meta: "PDF • 4.2 MB" },
      { id: "r2", title: "Class Recording Notes", meta: "DOC • 280 KB" },
      { id: "r3", title: "Recommended Reading Links", meta: "Link Collection" },
    ],
  },
  {
    id: "client-essentials",
    title: "Social Media Strategy: Viral Campaigns",
    sessionLabel: "SESSION",
    sessionDuration: "Completed",
    imageUrl: "/logo.png",
    overview:
      "Explanation: This class explores the foundations of client communication, expectation management, and professional collaboration.",
    recordingSummary:
      "Recording: Replay the lesson to review client case studies, workflows, and communication templates.",
    sessionPhase: "ended",
    meetUrl: DEFAULT_MEET_LINK,
    resources: [
      {
        id: "r1",
        title: "Client Communication Worksheet",
        meta: "PDF • 1.6 MB",
      },
    ],
  },
  {
    id: "community-growth",
    title: "Social Media Strategy: Viral Campaigns",
    sessionLabel: "UPCOMING",
    sessionDuration: "-",
    imageUrl: "/logo.png",
    overview:
      "Explanation: Students learn the principles of building engaged online communities and measuring healthy growth.",
    recordingSummary:
      "Recording: Watch the tutor's practical examples on audience nurturing and retention.",
    sessionPhase: "upcoming",
    meetUrl: DEFAULT_MEET_LINK,
    resources: [
      { id: "r1", title: "Community Audit Template", meta: "XLSX • 420 KB" },
    ],
  },
  {
    id: "campaign-analytics",
    title: "Social Media Strategy: Viral Campaigns",
    sessionLabel: "UPCOMING",
    sessionDuration: "-",
    imageUrl: "/logo.png",
    overview:
      "Explanation: Students are introduced to campaign metrics, reporting practices, and how to interpret performance dashboards.",
    recordingSummary:
      "Recording: Review the analytics setup demo and reporting examples from the session.",
    sessionPhase: "upcoming",
    meetUrl: DEFAULT_MEET_LINK,
    resources: [
      { id: "r1", title: "Analytics Dashboard Guide", meta: "PDF • 2.1 MB" },
    ],
  },
];

export function getClassroomCourseById(id: string) {
  return classroomCourseDetails.find((course) => course.id === id) ?? null;
}

export function getClassroomSessionCourseId(sessionId: string): string | null {
  if (sessionId === classroomProgram.liveSession.sessionId) {
    return classroomProgram.liveSession.courseId;
  }
  const course = classroomCourseDetails.find((c) => c.id === sessionId);
  return course?.id ?? null;
}

export function isRecordingAvailable(phase: SessionPhase): boolean {
  return phase === "ended";
}
