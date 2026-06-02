export function isProfileSetupBypassed(): boolean {
  return process.env.NEXT_PUBLIC_BYPASS_PROFILE_SETUP === "true";
}
