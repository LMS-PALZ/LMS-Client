import Link from "next/link";
import { Button } from "../../atoms/Button";

interface AppStatusPageProps {
  title: string;
  description: string;
  homeHref: string;
  homeLabel?: string;
  onRetry?: () => void;
}

export function AppStatusPage({
  title,
  description,
  homeHref,
  homeLabel = "Back to home",
  onRetry,
}: AppStatusPageProps) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-full max-w-md rounded-[20px] border border-[#EEF2F6] bg-white px-8 py-10 shadow-sm">
        <h1 className="text-[22px] font-semibold text-[#1D1D1D]">{title}</h1>
        <p className="mt-3 text-[14px] leading-6 text-[#6B7280]">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRetry ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onRetry}
              className="h-11 rounded-full px-6"
            >
              Try again
            </Button>
          ) : null}
          <Link
            href={homeHref}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#4C7D5B] px-6 text-[14px] font-semibold text-white hover:bg-[#3d6549]"
          >
            {homeLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
