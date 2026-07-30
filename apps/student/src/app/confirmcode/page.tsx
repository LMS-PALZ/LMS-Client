import { Suspense } from "react";
import { ConfirmCodePage } from "@/views/confirmcodepage";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConfirmCodePage />
    </Suspense>
  );
}
