export {
  classroomProgram,
  getClassroomCourseById,
  getClassroomSessionCourseId,
  getClassroomWeeksForCourse,
  getDefaultMeetUrl,
  getDefaultRecordingEmbedUrl,
  isRecordingAvailable,
} from "./classroom";

export type {
  ClassroomCourseDetail,
  ClassroomCourseItem,
  ClassroomLesson,
  ClassroomLessonType,
  ClassroomProgram,
  ClassroomResource,
  ClassroomWeek,
  SessionPhase,
} from "./classroom";

import { getDefaultMeetUrl } from "./classroom";

export const DEFAULT_MEET_LINK = getDefaultMeetUrl();
