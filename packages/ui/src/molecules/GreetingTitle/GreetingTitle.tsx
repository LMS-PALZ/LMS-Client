import { cn } from "@ssu/utils";

export interface GreetingTitleProps {
  children: string;
  className?: string;
}

export function GreetingTitle({ children, className }: GreetingTitleProps) {
  return (
    <h1
      className={cn(
        "text-center text-[26px] font-bold leading-tight text-neutral-900 sm:text-[28px] lg:text-[32px]",
        className,
      )}
    >
      {children}
    </h1>
  );
}
