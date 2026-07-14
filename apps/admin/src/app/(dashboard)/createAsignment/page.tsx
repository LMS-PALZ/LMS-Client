import { redirect } from "next/navigation";

/** Back-compat for the old PascalCase path. */
export default function CreateAssignmentLegacyRedirect() {
  redirect("/createassignment");
}
