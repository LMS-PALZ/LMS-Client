import type { SVGProps } from "react";

export type IconPathDef = {
  d: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fillRule?: "evenodd" | "nonzero";
};

export interface IconDefinition {
  viewBox: string;
  paths: IconPathDef[];
  defaultFill?: string;
  defaultSize?: number;
}

export type SsuIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  fill?: string;
  title?: string;
};
