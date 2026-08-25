"use client";

import { cn } from "@ssu/utils";
import { PanelLeft } from "lucide-react";
import { useState } from "react";

export interface BrandLogoProps {
  className?: string;
  collapsed?: boolean;
  logoSrc?: string;
  collapsedLogoSrc?: string;
  onExpand?: () => void;
}

const EXPANDED_LOGO_CLASS =
  "h-11 w-auto max-w-[200px] object-contain sm:h-[54px]";

const COLLAPSED_LOGO_CLASS = "h-9 w-auto max-w-[72px] object-contain";

export function BrandLogo({
  className,
  collapsed = false,
  logoSrc = "/firstlogo.png",
  collapsedLogoSrc = "/secondlogo.png",
}: BrandLogoProps) {
  const [hovered, setHovered] = useState(false);

  if (!collapsed) {
    return (
      <div className={cn("flex items-center", className)}>
        <img
          src={logoSrc}
          alt="Skill Scale Up"
          className={cn(EXPANDED_LOGO_CLASS, "transition-all duration-300")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center",
        className,
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={collapsedLogoSrc}
        alt="Skill Scale Up"
        className={cn(
          COLLAPSED_LOGO_CLASS,
          "absolute transition-all duration-200",
          hovered ? "scale-75 opacity-0" : "scale-100 opacity-100",
        )}
      />

      <PanelLeft
        className={cn(
          "absolute h-5 w-5 text-neutral-600 transition-all duration-300",
          hovered ? "scale-100 opacity-100" : "scale-75 opacity-0",
        )}
      />
    </div>
  );
}
