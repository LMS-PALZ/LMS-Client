import type { ReactNode } from "react";
import { cn } from "@ssu/utils";
import { cloneElement, isValidElement } from "react";
import { Label } from "../../atoms/Label";

export interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  description?: string;
}

export function FormField({
  id,
  label,
  error,
  children,
  className,
  description,
}: FormFieldProps) {
  const childWithError = isValidElement(children)
    ? cloneElement(children, { error: !!error || undefined } as any)
    : children;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      {description && (
        <p className="text-small text-neutral-500">{description}</p>
      )}
      {childWithError}
      {error && (
        <p className="text-small text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
