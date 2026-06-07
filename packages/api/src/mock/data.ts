import type {
  AssignmentListItem,
  CourseSummary,
  LiveSessionItem,
  NotificationDto,
  AttendanceRecord,
  StudentInfo,
  StudentProfile,
  Student,
  StudentStat,
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

import type {} from "@ssu/types";

export const studentProfile: StudentProfile = {
  name: "Obiageli Anya",
  programme: "Web Development",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
};

export const studentInfo: StudentInfo = {
  email: "obiageli@email.com",

  phone: "+234 812 345 6789",

  dob: "14 March 2002",

  address: "12 Awolowo Road, Ikoyi, Lagos",

  cohort: "Cohort 3",

  enrollmentDate: "10 May 2026",

  idDocumentUrl: "/documents/id-card.pdf",
};

export const completionData = {
  percentage: 17,
  completed: 6,
  total: 16,
};

export const cumulativeScoreData = {
  percentage: 42,
  completed: 42,
  total: 100,

  description: "A cumulative score of 70% is required for graduation.",
};

export const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    title: "HTML Introduction",
    date: "12 May 2026 • 10:00am",
    week: "Week 1",
    status: "present",
  },

  {
    id: "2",
    title: "HTML Introduction",
    date: "12 May 2026 • 10:00am",
    week: "Week 2",
    status: "present",
  },

  {
    id: "3",
    title: "HTML Forms",
    date: "14 May 2026 • 10:00am",
    week: "Week 3",
    status: "present",
  },

  {
    id: "4",
    title: "CSS Layouts",
    date: "19 May 2026 • 10:00am",
    week: "Week 4",
    status: "absent",
  },

  {
    id: "5",
    title: "CSS Positioning",
    date: "21 May 2026 • 10:00am",
    week: "Week 5",
    status: "present",
  },

  {
    id: "6",
    title: "CSS Typography",
    date: "23 May 2026 • 10:00am",
    week: "Week 6",
    status: "absent",
  },
];

export const studentStats: StudentStat[] = [
  {
    id: "1",
    title: "Total enrolled",
    value: 427,
    description: "Across 5 program",
  },

  {
    id: "2",
    title: "Active this week",
    value: 364,
    description: "85% of all students",
  },

  {
    id: "3",
    title: "Flagged Students",
    value: 4,
    description: "Missed 3+ live classes",
  },
];

export const students: Student[] = [
  {
    id: "1",
    first_name: "Tunde",
    last_name: "Musa",
    initials: "TM",
    avatarColor: "bg-green-300",

    programme: "Content Creation",

    progress: 24,

    attendance: {
      attended: 8,
      total: 8,
    },

    status: "good-standing",
  },

  {
    id: "2",
    first_name: "Kelechi",
    last_name: "Eze",
    initials: "KE",
    avatarColor: "bg-slate-200",

    programme: "Content Creation",

    progress: 24,

    attendance: {
      attended: 8,
      total: 8,
    },

    status: "good-standing",
  },

  {
    id: "3",
    first_name: "Funke",
    last_name: "Obi",
    initials: "FO",
    avatarColor: "bg-sky-400",

    programme: "Digital Marketing",

    progress: 24,

    attendance: {
      attended: 8,
      total: 8,
    },

    status: "good-standing",
  },

  {
    id: "4",
    first_name: "Adaeze",
    last_name: "Ugwu",
    initials: "AU",
    avatarColor: "bg-red-400",

    programme: "Data Analysis",

    progress: 24,

    attendance: {
      attended: 8,
      total: 8,
    },

    status: "good-standing",
  },

  {
    id: "5",
    first_name: "Bola",
    last_name: "Idowu",
    initials: "BI",
    avatarColor: "bg-slate-200",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 5,
      total: 8,
    },

    status: "flagged",
  },

  {
    id: "6",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "6",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "7",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "8",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "9",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "10",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "11",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
  {
    id: "12",
    first_name: "Zara",
    last_name: "Nwosu",
    initials: "ZN",
    avatarColor: "bg-red-400",

    programme: "UI/UX Design",

    progress: 24,

    attendance: {
      attended: 3,
      total: 8,
    },

    status: "access-revoked",
  },
];
