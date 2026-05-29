import { cn } from "@ssu/utils";
import { Clock, Video } from "lucide-react";

export interface RecordingListItemProps {
  title: string;
  expiresInDays: number;
  className?: string;
  onClick?: () => void;
}

export function RecordingListItem({
  title,
  expiresInDays,
  className,
  onClick,
}: RecordingListItemProps) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-xl border bg-white p-4 text-left",
        onClick && "hover:bg-neutral-50 cursor-pointer",
        className,
      )}
    >
      <div className="rounded-lg bg-neutral-100 p-3">
        <Video className="h-6 w-6 text-neutral-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-h4 font-semibold text-neutral-900 truncate">
          {title}
        </p>
        <p className="flex items-center gap-1 text-small text-neutral-500 mt-1">
          <Clock className="h-4 w-4" />
          Expires in {expiresInDays} days
        </p>
      </div>
    </Wrapper>
  );
}
