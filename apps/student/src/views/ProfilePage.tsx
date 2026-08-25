"use client";

import { useSession, useStudentProfile } from "@ssu/queries";
import { isStudentProfileComplete } from "@ssu/api";
import { AlertBanner, CardSkeleton, PageHeader } from "@ssu/ui";

export function ProfilePage() {
  const { data: user } = useSession();
  const profileQuery = useStudentProfile();

  const profile = profileQuery.data;
  const complete = isStudentProfileComplete(profile);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" />

      {profileQuery.isLoading ? (
        <CardSkeleton lines={4} className="min-h-[200px]" />
      ) : profileQuery.isError ? (
        <AlertBanner variant="error">
          Could not load your profile. Please try again later.
        </AlertBanner>
      ) : (
        <div className="rounded-2xl border bg-white p-6 shadow-card space-y-6">
          <section>
            <h2 className="text-h3 font-bold text-neutral-900">Account</h2>
            <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
              <div>
                <dt className="text-neutral-500">Name</dt>
                <dd className="font-medium text-neutral-900">
                  {user ? `${user.firstName} ${user.lastName}`.trim() : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Email</dt>
                <dd className="font-medium text-neutral-900">
                  {user?.email ?? "-"}
                </dd>
              </div>
            </dl>
          </section>

          <section>
            <h2 className="text-h3 font-bold text-neutral-900">
              Profile details
            </h2>
            {!complete ? (
              <p className="mt-2 text-body text-neutral-600">
                Your profile setup is incomplete. You can complete it from the
                dashboard when prompted, or continue using the app.
              </p>
            ) : (
              <dl className="mt-4 grid gap-3 text-small sm:grid-cols-2">
                <div>
                  <dt className="text-neutral-500">Gender</dt>
                  <dd className="font-medium capitalize text-neutral-900">
                    {profile?.gender?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Employment</dt>
                  <dd className="font-medium capitalize text-neutral-900">
                    {profile?.employment_status?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Date of birth</dt>
                  <dd className="font-medium text-neutral-900">
                    {profile?.dob
                      ? `${profile.dob.day}/${profile.dob.month}/${profile.dob.year}`
                      : "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Location</dt>
                  <dd className="font-medium text-neutral-900">
                    {[profile?.city, profile?.state]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-neutral-500">Address</dt>
                  <dd className="font-medium text-neutral-900">
                    {profile?.address ?? "-"}
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {profile?.photo?.url && (
            <section>
              <h2 className="text-h3 font-bold text-neutral-900">Photo</h2>
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo.url}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
