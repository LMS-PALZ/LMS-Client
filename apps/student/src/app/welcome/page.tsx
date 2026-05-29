"use client";

import { Button } from "@ssu/ui";
import { Briefcase, FolderClosed, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

const welcomeHighlights = [
  {
    title: "Employable Skills",
    description:
      "You’ll gain market-relevant skills aligned with today’s digital and vocational opportunities.",
    icon: Briefcase,
  },
  {
    title: "Life Skills",
    description:
      "Build discipline, leadership, and edival intelligence to support personal and professional growth.",
    icon: Heart,
  },
  {
    title: "Portfolio Projects",
    description:
      "Work on real projects you can confidently showcase to employers and clients.",
    icon: FolderClosed,
  },
];

export default function Page() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-6 py-10 sm:px-8 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[820px] flex-col items-center justify-center text-center ">
        <div className="mb-10 w-[120px] sm:mb-12">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
          />
        </div>

        <h1 className="mb-2 text-[20px] font-bold  text-[#1F2937] sm:text-[25px]">
          You’re in.
        </h1>
        <p className="mx-auto mb-8 max-w-[500px] font-semibold sm:text-[17px] text-sm  text-[#495057]">
          Welcome to the Skill Scale-up Program. Few things to know about your
          journey.
        </p>

        <section className="w-full max-w-[500px] rounded-[12px] bg-[#FAFBFD] px-7 py-6 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-9">
          <div className="space-y-10">
            {welcomeHighlights.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-[#64748B]" />
                </div>
                <div>
                  <h2 className="mb-3 text-sm font-bold text-[#1F2937] sm:text-[17px]">
                    {title}
                  </h2>
                  <p className="max-w-[500px] text-sm leading-[1.6] text-[#4B5563] sm:text-[15px]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="mt-10 h-[60px] rounded-full px-10 text-[15px] text-[var(--color-surface)] sm:min-w-[210px]"
          onClick={() => router.push("/home")}
        >
          Let&apos;s get started
        </Button>
      </div>
    </main>
  );
}
