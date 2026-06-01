function isUnifiedDeploy(): boolean {
  return process.env.NEXT_PUBLIC_PORTAL_MODE === "unified";
}

function normalize(path: string): string {
  if (path === "") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function adminPath(path: string = ""): string {
  const segment = normalize(path);
  if (isUnifiedDeploy()) return `/admin${segment}`;
  return segment === "" ? "/" : segment;
}

export function tutorPath(path: string = ""): string {
  const segment = normalize(path);
  if (isUnifiedDeploy()) return `/tutor${segment}`;
  return segment === "" ? "/" : segment;
}
