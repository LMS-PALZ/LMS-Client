import type { AttendanceRecord, StudentInfo, StudentProfile } from "@ssu/types";

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
