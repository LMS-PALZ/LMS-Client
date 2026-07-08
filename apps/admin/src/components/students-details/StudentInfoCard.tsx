import { StudentInfo } from "@ssu/types";

interface StudentInfoCardProps {
  info: StudentInfo;
}

function formatDob(day: string, month: string, year: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = months[parseInt(month) - 1] ?? month;
  return `${day} ${monthName}, ${year}`;
}

export function StudentInfoCard({ info }: StudentInfoCardProps) {
  return (
    <div className="rounded-[24px] border border-[#E6EBF0] bg-[#F8FAF8] p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <p className="text-md text-[13px]">address</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {info?.address}
          </p>
        </div>

        <div>
          <p className="text-md text-[13px]">Date of birth</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {formatDob(info?.dob?.day, info?.dob?.month, info?.dob?.year)}
          </p>
        </div>

        <div>
          <p className="text-md text-[13px]">Email address</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {info?.email}
          </p>
        </div>

        <div>
          <p className="text-md text-[13px]">Phone number</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {info?.phoneNumber}
          </p>
        </div>

        <div>
          <p className="text-md text-[13px]">Cohort</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {info?.cohortName}
          </p>
        </div>

        <div>
          <p className="text-md text-[13px]">Date registered</p>

          <p className="mt-2 text-[13px] font-medium text-[#7B8794]">
            {" "}
            {info?.enrollmentDate
              ? new Date(info.enrollmentDate).toLocaleDateString("en-GB")
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
