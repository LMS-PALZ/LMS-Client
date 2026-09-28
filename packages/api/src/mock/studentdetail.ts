import type {
  AdminStudentDetails,
  AttendanceRecord,
  StudentInfo,
  StudentProfile,
} from "@ssu/types";

export const studentProfile: StudentProfile = {
  firstName: "Obiageli",
  lastName: "Anya",
  programTitle: "Web Development",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  status: "active",
};

export const studentInfo: StudentInfo = {
  email: "obiageli@email.com",
  phoneNumber: "+234 812 345 6789",
  cohortName: "Cohort 3",
  enrollmentDate: "2026-05-10T00:00:00.000Z",
  progressPercent: 17,
  overallCompletion: { week: 6, totalWeeks: 16 },
  cumulativeScore: 42,
};

export const completionData = {
  progressPercent: 17,
  completed: 6,
  total: 16,
};

export const cumulativeScoreData = {
  progressPercent: 42,
  completed: 42,
  total: 100,
  description: "A cumulative score of 70% is required for graduation.",
};

export const attendanceData: AttendanceRecord[] = [
  {
    id: "1",
    title: "HTML Introduction",
    date: "12 May 2026, 10:00",
    week: "Week 1",
    status: "present",
  },
  {
    id: "2",
    title: "HTML Forms",
    date: "14 May 2026, 10:00",
    week: "Week 3",
    status: "present",
  },
  {
    id: "3",
    title: "CSS Layouts",
    date: "19 May 2026, 10:00",
    week: "Week 4",
    status: "absent",
  },
];

export const mockAdminStudentDetails: AdminStudentDetails = {
  id: "1",
  firstName: studentProfile.firstName,
  lastName: studentProfile.lastName,
  email: studentInfo.email,
  phoneNumber: studentInfo.phoneNumber,
  programTitle: studentProfile.programTitle,
  cohortName: studentInfo.cohortName,
  enrollmentDate: studentInfo.enrollmentDate,
  status: "active",
  progressPercent: 17,
  overallCompletion: { week: 6, totalWeeks: 16 },
  cumulativeScore: 42,
  sessionAttendance: attendanceData,
  image: studentProfile.image,
};
