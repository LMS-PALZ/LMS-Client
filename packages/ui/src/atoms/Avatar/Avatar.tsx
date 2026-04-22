import { cn, getInitials } from "@ssu/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-micro",
  md: "h-10 w-10 text-small",
  lg: "h-14 w-14 text-body",
};

export function Avatar({
  src,
  alt,
  firstName,
  lastName,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(firstName, lastName);
  const s = sizeMap[size];

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? `${firstName} ${lastName}`}
        className={cn(
          "rounded-full object-cover ring-2 ring-white bg-neutral-100 shrink-0",
          s,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-green-100 text-brand-green font-semibold ring-2 ring-white shrink-0",
        s,
        className,
      )}
      aria-hidden={alt ? undefined : true}
    >
      {initials}
    </div>
  );
}
