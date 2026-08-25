import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface SkeletonCircleProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function SkeletonCircle({
  size = "md",
  className,
}: SkeletonCircleProps) {
  return (
    <Skeleton
      className={cn("rounded-full", sizeMap[size], className)}
      aria-hidden
    />
  );
}
