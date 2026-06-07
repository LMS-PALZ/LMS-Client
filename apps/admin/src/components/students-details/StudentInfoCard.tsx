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

          <p className="mt-2 text-[14px] font-medium">{info.email}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Phone number</p>

          <p className="mt-2 text-[14px] font-medium">{info.phone}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Date of birth</p>

          <p className="mt-2 text-[14px] font-medium">{info.dob}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">House address</p>

          <p className="mt-2 text-[14px] font-medium">{info.address}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Cohort</p>

          <p className="mt-2 text-[14px] font-medium">{info.cohort}</p>
        </div>

        <div>
          <p className="text-[#7B8794]">Enrollment date</p>

          <p className="mt-2 text-[14px] font-medium">{info.enrollmentDate}</p>
        </div>
      </div>
    </div>
  );
}
