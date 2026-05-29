import { cn } from "@ssu/utils";

export interface BrandLogoProps {
  className?: string;
  collapsed?: boolean;
  logoSrc?: string;
}

export function BrandLogo({
  className,
  collapsed = false,
  logoSrc = "/logo.png",
}: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      <img
        src={logoSrc}
        alt="Skill Scale Up"
        className="h-9 w-9 shrink-0 object-contain"
        width={36}
        height={36}
      />
      {!collapsed && (
        <span className="text-small font-bold leading-tight text-brand-green truncate">
          SKILL SCALE UP
        </span>
      )}
    </div>
  );
}
