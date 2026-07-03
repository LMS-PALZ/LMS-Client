import { FormFieldSkeleton, Skeleton } from "@ssu/ui";

export function AdminActivityFormSkeleton() {
  return (
    <section className="space-y-6" role="status" aria-label="Loading activity">
      <Skeleton className="h-4 w-48 rounded-md" aria-hidden />
      <div className="space-y-4 rounded-[18px] border border-[#EEF2F6] bg-white p-6">
        <FormFieldSkeleton />
        <FormFieldSkeleton inputClassName="h-24 w-full rounded-[12px]" />
        <FormFieldSkeleton />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldSkeleton />
          <FormFieldSkeleton />
        </div>
        <FormFieldSkeleton inputClassName="h-32 w-full rounded-[12px]" />
      </div>
    </section>
  );
}
