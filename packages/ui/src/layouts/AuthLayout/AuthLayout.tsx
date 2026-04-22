import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn("min-h-screen grid lg:grid-cols-2", className)}>
      <div className="hidden lg:flex bg-brand-green relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[300px] border-l-transparent border-b-[300px] border-b-white" />
          <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[400px] border-r-transparent border-t-[400px] border-t-brand-green-900" />
          <div className="absolute top-1/2 right-12 w-0 h-0 border-l-[200px] border-l-transparent border-b-[200px] border-b-brand-amber opacity-60" />
        </div>
        <div className="relative z-10">
          <div className="text-white font-bold text-h2">Skill Scale Up</div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-h3 font-medium leading-relaxed">
            &quot;Build the skill,
            <br />
            scale the career.&quot;
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
