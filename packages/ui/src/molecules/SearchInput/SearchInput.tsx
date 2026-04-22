"use client";

import { cn } from "@ssu/utils";
import { Search, X } from "lucide-react";
import * as React from "react";
import { Input } from "../../atoms/Input";

export interface SearchInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    const v = typeof value === "string" ? value : "";
    const showClear = v.length > 0;

    return (
      <div className={cn("relative", className)}>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <Input
          ref={ref}
          className="pl-9 pr-9"
          value={value}
          onChange={onChange}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
