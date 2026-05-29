import { studentPath } from "@/lib/studentRoutes";
import { redirect } from "next/navigation";

export default function Page() {
  redirect(studentPath("/signup"));
}
