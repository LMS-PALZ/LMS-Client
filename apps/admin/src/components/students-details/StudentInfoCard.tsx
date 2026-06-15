import { StudentInfo } from "@ssu/types";

interface StudentInfoCardProps {
  info: StudentInfo;
}

export function StudentInfoCard({ info }: StudentInfoCardProps) {
  return (
    <div className="rounded-[24px] border border-[#E6EBF0] bg-white p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-[#7B8794]">Email address</p>

          <p className="mt-2 text-[14px] font-medium">{info?.email}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Phone number</p>

          <p className="mt-2 text-[14px] font-medium">{info?.phoneNumber}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Date of birth</p>

          <p className="mt-2 text-[14px] font-medium">07 july 2007</p>
        </div>

        <div>
          <p className="text-[#7B8794]">House address</p>

          <p className="mt-2 text-[14px] font-medium">11, bukko estate</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Cohort</p>

          <p className="mt-2 text-[14px] font-medium">{info?.cohortName}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Enrollment date</p>

          <p className="mt-2 text-[14px] font-medium">12, june 2026</p>
        </div>
      </div>
    </div>
  );
}
