import type { Metadata } from "next";

export type AppPortal = "student" | "admin" | "tutor";

const BRAND = "Skill Scale Up";
const OG_IMAGE = "/firstlogo.png";
const OG_IMAGE_WIDTH = 207;
const OG_IMAGE_HEIGHT = 150;

const PORTAL_TITLE: Record<AppPortal, string> = {
  student: "Student Dashboard",
  admin: "Admin Dashboard",
  tutor: "Tutor Dashboard",
};

const PORTAL_DESCRIPTION: Record<AppPortal, string> = {
  student:
    "Register for a program, join live classes, connect Google Classroom, submit assessments, and track your learning progress.",
  admin:
    "Manage registered users, review trainer applications, configure training programs, and publish platform announcements.",
  tutor:
    "Publish courses, schedule live sessions, review and grade assignment submissions, and manage your tutor profile.",
};

function resolveMetadataBase(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

/** Shared favicon, Open Graph, and Twitter metadata for each Next.js app. */
export function createSiteMetadata(portal: AppPortal): Metadata {
  const title = PORTAL_TITLE[portal];
  const description = PORTAL_DESCRIPTION[portal];
  const metadataBase = resolveMetadataBase();

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: {
      default: title,
      template: `%s | ${BRAND}`,
    },
    description,
    applicationName: BRAND,
    icons: {
      icon: [{ url: OG_IMAGE, type: "image/png" }],
      apple: [{ url: OG_IMAGE, type: "image/png" }],
      shortcut: OG_IMAGE,
    },
    openGraph: {
      title,
      description,
      siteName: BRAND,
      images: [
        {
          url: OG_IMAGE,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: `${BRAND} logo`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
