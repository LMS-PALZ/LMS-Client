import { FileText, Radio } from "lucide-react";

export function ActivityIcon({ lessonType }: { lessonType: string }) {
  const className = "h-[18px] w-[18px] shrink-0 text-[#4C7D5B]";
  if (lessonType === "live_session") {
    return <Radio className={className} aria-hidden />;
  }
  return <FileText className={className} aria-hidden />;
}
