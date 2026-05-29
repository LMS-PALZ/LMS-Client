import { cn } from "@ssu/utils";
import { Button } from "../../atoms/Button";

export interface ConnectGoogleBannerProps {
  onConnect: () => void;
  className?: string;
}

export function ConnectGoogleBanner({
  onConnect,
  className,
}: ConnectGoogleBannerProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-brand-green-200 bg-brand-green-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
        className,
      )}
    >
      <div>
        <p className="text-h4 font-semibold text-brand-green">
          Connect Google Classroom
        </p>
        <p className="text-small text-neutral-600 mt-1">
          Link your Google account to sync courses and assignments.
        </p>
      </div>
      <Button variant="primary" onClick={onConnect}>
        Connect Google
      </Button>
    </div>
  );
}
