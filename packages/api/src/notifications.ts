import type { NotificationDto } from "@ssu/types";
import { mockNotifications } from "./mock/data";

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const notificationsApi = {
  list: async (): Promise<NotificationDto[]> => delay(mockNotifications),
};
