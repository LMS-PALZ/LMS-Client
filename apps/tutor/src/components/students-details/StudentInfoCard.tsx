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

          <p className="mt-2 text-[14px] font-medium">
            {formatDob(info?.dob?.day, info?.dob?.month, info?.dob?.year)}
          </p>
        </div>

        <div>
          <p className="text-[#7B8794]">House address</p>

          <p className="mt-2 text-[14px] font-medium">{info?.address}</p>
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
