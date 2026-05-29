import { cn } from "@ssu/utils";

export interface GreetingTitleProps {
  children: string;
  className?: string;
}

export function GreetingTitle({ children, className }: GreetingTitleProps) {
  return (
    <h1
      className={cn(
        "text-center text-h1 md:text-display font-bold text-neutral-900",
        className,
      )}
    >
      {children}
    </h1>
  );
}
