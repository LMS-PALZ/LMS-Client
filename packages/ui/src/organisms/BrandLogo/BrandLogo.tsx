import { cn } from "@ssu/utils";

export interface BrandLogoProps {
  className?: string;
  collapsed?: boolean;
  logoSrc?: string;
}

const EXPANDED_LOGO_CLASS =
  "h-11 w-auto max-w-[200px] object-contain object-left sm:h-[54px]";
const COLLAPSED_LOGO_CLASS =
  "h-9 w-auto max-w-[72px] object-contain object-left";

export function BrandLogo({
  className,
  collapsed = false,
  logoSrc = "/firstlogo.png",
}: BrandLogoProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        collapsed && "justify-center",
        className,
      )}
    >
      <img
        src={logoSrc}
        alt="Skill Scale Up"
        className={cn(
          "shrink-0",
          collapsed ? COLLAPSED_LOGO_CLASS : EXPANDED_LOGO_CLASS,
        )}
        width={collapsed ? 72 : 200}
        height={collapsed ? 36 : 54}
      />
    </div>
  );
}
