const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarWeekdays() {
  return (
    <div className="mb-3 grid grid-cols-7 rounded-2xl bg-[#F8FAFC] py-3">
      {WEEK_DAYS.map((day) => (
        <div
          key={day}
          className="flex justify-center text-sm font-semibold text-[#64748B]"
        >
          {day}
        </div>
      ))}
    </div>
  );
}
