"use client";

interface WelcomeCardProps {
  progress?: number;
}

export default function WelcomeCard({ progress = 0 }: WelcomeCardProps) {
  return (
    <div className="rounded-[25px] bg-[#FFE0C6] p-5 md:py-5 md:px-6">
      <div>
        <h2 className="text-[17px] font-bold  text-[#1D1D1D]">
          Welcome to SSU
        </h2>

        <p className="mt-2 max-w-[300px] text-[17px] font-semibold leading-[25px] text-[#495057]">
          You’re enrolled in web development. Let’s learn great things today!
        </p>
      </div>
      <div className="mt-8 flex md:flex-row flex-col items-center gap-2 md:items-end md:justify-start">
        <div className="relative flex flex-col items-center justify-center">
          <svg
            width={240}
            height={120}
            viewBox="0 0 240 140"
            className="overflow-visible"
          >
            <path
              d="M20 120 A100 100 0 0 1 220 120"
              fill="none"
              stroke="#E8EDF3"
              strokeWidth={16}
              strokeLinecap="round"
            />

            <path
              d="M20 120 A100 100 0 0 1 220 120"
              fill="none"
              stroke="#F39A2E"
              strokeWidth={16}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - progress}
              className="transition-all duration-500 ease-in-out"
            />
          </svg>

          <div className="absolute top-[52%] flex -translate-y-1/2 flex-col items-center">
            <span className="text-[30px] font-semibold leading-none text-[#1D1D1D]">
              {progress}%
            </span>
          </div>

          <div className="flex w-full max-w-[190px] items-center justify-between">
            <span className="text-sm text-[#5B5B5B]">0</span>

            <span className="text-sm text-[#5B5B5B]">100</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-2">
          <div className="h-3 w-3 rounded-full bg-[#F39A2E]" />

          <p className="text-[12px] text-[#4A4A4A]">
            This is your overall score
          </p>
        </div>
      </div>
    </div>
  );
}
