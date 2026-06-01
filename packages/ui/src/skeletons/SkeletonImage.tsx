import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface SkeletonImageProps {
  aspectRatio?: "video" | "banner" | "square" | "auto";
  className?: string;
}

const aspectMap = {
  video: "aspect-video",
  banner: "aspect-[3/1]",
  square: "aspect-square",
  auto: "h-40",
};

export function SkeletonImage({
  aspectRatio = "banner",
  className,
}: SkeletonImageProps) {
  return (
    <Skeleton
      className={cn("w-full rounded-xl", aspectMap[aspectRatio], className)}
      aria-hidden
    />
  );
}
