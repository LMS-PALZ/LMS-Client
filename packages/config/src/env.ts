export type AppEnvironment = "local" | "staging" | "production";

export function getStagingUrl(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_STAGING_URL);
}

export function getProductionUrl(): string | undefined {
  return trimEnv(process.env.NEXT_PUBLIC_PRODUCTION_URL);
}

export function getAppEnvironment(): AppEnvironment {
  const explicit = trimEnv(process.env.NEXT_PUBLIC_APP_ENV);
  if (
    explicit === "staging" ||
    explicit === "production" ||
    explicit === "local"
  ) {
    return explicit;
  }
  if (process.env.NODE_ENV === "development") return "local";
  if (process.env.CONTEXT === "production") return "production";
  return "staging";
}

export function getSiteUrl(): string | undefined {
  const override = trimEnv(process.env.NEXT_PUBLIC_SITE_URL);
  if (override) return override;

  const env = getAppEnvironment();
  if (env === "production") return getProductionUrl();
  if (env === "staging") return getStagingUrl();

  return trimEnv(process.env.URL) ?? trimEnv(process.env.DEPLOY_PRIME_URL);
}

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}
