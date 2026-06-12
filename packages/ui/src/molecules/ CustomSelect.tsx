"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CustomSelectProps } from "@ssu/types";

export function CustomSelect({
  placeholder,
  options,
  value,
  onChange,
  error,
  showErrorMessage = true,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-[52px] w-full items-center justify-between rounded-[14px] border bg-white px-4 text-left text-[15px] text-[#1D1D1D] outline-none transition-all duration-200 ${
          error ? "border-[#C62828]" : "border-[#D7E0EA] hover:border-[#B7C5D4]"
        }`}
      >
        <span className={value ? "text-[#1D1D1D]" : "text-[#A0AEC0]"}>
          {value || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`
            transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[60px] z-50 w-full overflow-hidden rounded-[18px] border border-[#EEF2F6] bg-white shadow-xl">
          <div className="max-h-[220px] overflow-y-auto py-2">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="flex w-full items-center px-4 py-3 text-left text-[15px] text-[#1D1D1D] transition hover:bg-[#F7F9FB]"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && showErrorMessage && (
        <div className="mt-3 flex items-center gap-2 text-[14px] text-[#C62828]">
          <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#C62828] text-[12px] font-semibold">
            i
          </div>

          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
