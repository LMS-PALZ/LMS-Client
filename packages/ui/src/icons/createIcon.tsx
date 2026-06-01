import { cn } from "@ssu/utils";
import type { IconDefinition, SsuIconProps } from "./types";

export function createIcon(definition: IconDefinition, displayName: string) {
  const Icon = ({
    size = definition.defaultSize ?? 16,
    fill,
    className,
    title,
    ...props
  }: SsuIconProps) => {
    const [vbW, vbH] = definition.viewBox.split(" ").slice(2).map(Number);
    const aspect = vbW / vbH;
    const width = size;
    const height = Math.round(size / aspect);

    return (
      <svg
        width={width}
        height={height}
        viewBox={definition.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        aria-hidden={title ? undefined : true}
        role={title ? "img" : undefined}
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {definition.paths.map((pathDef, index) => (
          <path
            key={index}
            d={pathDef.d}
            fill={
              pathDef.fill ?? fill ?? definition.defaultFill ?? "currentColor"
            }
            stroke={pathDef.stroke}
            strokeWidth={pathDef.strokeWidth}
            fillRule={pathDef.fillRule}
          />
        ))}
      </svg>
    );
  };

  Icon.displayName = displayName;
  return Icon;
}
