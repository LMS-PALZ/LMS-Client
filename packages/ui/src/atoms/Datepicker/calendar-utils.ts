export interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
}

export function getCalendarDays(month: Date): CalendarDay[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const firstDay = new Date(year, monthIndex, 1);

  const lastDay = new Date(year, monthIndex + 1, 0);

  const firstWeekDay = firstDay.getDay();

  const daysInMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  const days: CalendarDay[] = [];

  for (let i = firstWeekDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, monthIndex - 1, prevMonthLastDay - i),
      day: prevMonthLastDay - i,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(year, monthIndex, day),
      day,
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (days.length < 42) {
    days.push({
      date: new Date(year, monthIndex + 1, nextDay),
      day: nextDay,
      currentMonth: false,
    });

    nextDay++;
  }

  return days;
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getFullYear()}`;
}

export function previousMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function nextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function isToday(date: Date) {
  const today = new Date();

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}
