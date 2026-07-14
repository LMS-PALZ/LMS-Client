import { CalendarDay, isSameDay, isToday } from "./calendar-utils";

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate?: Date;
  onSelect: (date: Date) => void;
}

export function CalendarGrid({
  days,
  selectedDate,
  onSelect,
}: CalendarGridProps) {
  return (
    <div className="grid grid-cols-7 gap-y-2">
      {days.map((day) => {
        const selected = selectedDate && isSameDay(day.date, selectedDate);

        const today = isToday(day.date);

        return (
          <div key={day.date.toISOString()} className="flex justify-center">
            <button
              type="button"
              onClick={() => onSelect(day.date)}
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-medium transition-all duration-200",

                day.currentMonth ? "text-[#111827]" : "text-[#CBD5E1]",

                !selected && "hover:bg-[#EDF7F0]",

                today && !selected && "border-2 border-[#4E845F]",

                selected && "bg-[#4E845F] text-white",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day.day}
            </button>
          </div>
        );
      })}
    </div>
  );
}
