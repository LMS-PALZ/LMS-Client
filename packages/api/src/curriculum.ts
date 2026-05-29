import type { CurriculumWeek } from "@ssu/types";

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const mockCurriculum: CurriculumWeek[] = [
  {
    id: "w1",
    title: "Week 1",
    subtitle: "Introduction to SEO",
    lessons: [
      {
        id: "l1",
        title: "Client Communications Essentials",
        type: "live",
        scheduledAt: "10/10/26",
        completed: true,
        sessionId: "s1",
      },
      {
        id: "l2",
        title: "Understand Communications Essentials",
        type: "reading",
        completed: false,
      },
    ],
  },
  {
    id: "w2",
    title: "Week 2",
    subtitle: "Introduction to SEO",
    lessons: [],
  },
  {
    id: "w3",
    title: "Week 3",
    subtitle: "Introduction to SEO",
    lessons: [],
  },
  {
    id: "w4",
    title: "Week 4",
    subtitle: "Introduction to SEO",
    lessons: [],
  },
];

export const curriculumApi = {
  async list(): Promise<CurriculumWeek[]> {
    return delay(mockCurriculum);
  },
};
