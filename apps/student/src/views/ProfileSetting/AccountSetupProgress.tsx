interface AccountSetupProgressProps {
  step: number;
}

export function AccountSetupProgress({ step }: AccountSetupProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`
            h-[8px] rounded-full transition-all duration-300
            ${step === item ? "w-[24px] bg-[#F39A2E]" : "w-[8px] bg-[#E5E7EB]"}
          `}
        />
      ))}
    </div>
  );
}
