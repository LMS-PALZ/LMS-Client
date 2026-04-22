import * as React from "react";
import { cn } from "@ssu/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  className,
  orientation = "horizontal",
  ...props
}: DividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? "w-full border-t border-neutral-200"
          : "h-full border-l border-neutral-200",
        className,
      )}
      {...props}
    />
  );
}
