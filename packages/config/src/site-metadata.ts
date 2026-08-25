import type { Metadata } from "next";
import { getSiteUrl } from "./env";

export type AppPortal = "student" | "admin";

const BRAND = "Skill Scale Up";
const DEFAULT_OG_IMAGE = "/firstlogo.png";
const DEFAULT_OG_WIDTH = 207;
const DEFAULT_OG_HEIGHT = 150;

export const STUDENT_SIGNUP_OG_IMAGE = "/og-signup.png";
export const STUDENT_SIGNUP_OG_WIDTH = 1200;
export const STUDENT_SIGNUP_OG_HEIGHT = 630;

const PORTAL_TITLE: Record<AppPortal, string> = {
  student: "Student Dashboard",
  admin: "Admin Dashboard",
};

const PORTAL_DESCRIPTION: Record<AppPortal, string> = {
  student:
    "Register for a program, join live classes, connect Google Classroom, submit assessments, and track your learning progress.",
  admin:
    "Manage registered users, review trainer applications, configure training programs, and publish platform announcements.",
};

export const STUDENT_SIGNUP_METADATA = {
  title: `Sign Up — ${BRAND}`,
  description:
    "Apply to Skill Scale Up training programs. Create your account, choose your cohort, and start your learning journey with live classes and expert mentors.",
  image: STUDENT_SIGNUP_OG_IMAGE,
  imageWidth: STUDENT_SIGNUP_OG_WIDTH,
  imageHeight: STUDENT_SIGNUP_OG_HEIGHT,
  path: "/",
} as const;

function resolveMetadataBase(): URL | undefined {
  const raw = getSiteUrl();
  if (!raw) return undefined;
  try {
    return new URL(raw);
  } catch {
    return undefined;
  }
}

type ShareMetadataInput = {
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  path?: string;
};

function buildShareMetadata(input: ShareMetadataInput): Metadata {
  const metadataBase = resolveMetadataBase();
  const image = input.image ?? DEFAULT_OG_IMAGE;
  const imageWidth = input.imageWidth ?? DEFAULT_OG_WIDTH;
  const imageHeight = input.imageHeight ?? DEFAULT_OG_HEIGHT;
  const imageAlt = input.imageAlt ?? `${BRAND} logo`;
  const canonicalPath = input.path ?? "/";
  const openGraphUrl =
    metadataBase != null
      ? new URL(canonicalPath, metadataBase).toString()
      : undefined;
  const useLargeCard = imageWidth >= 600 && imageHeight >= 315;

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: { absolute: input.title },
    description: input.description,
    alternates: openGraphUrl ? { canonical: openGraphUrl } : undefined,
    openGraph: {
      title: input.title,
      description: input.description,
      siteName: BRAND,
      url: openGraphUrl,
      images: [
        {
          url: image,
          width: imageWidth,
          height: imageHeight,
          alt: imageAlt,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: useLargeCard ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

export function createStudentSignupMetadata(): Metadata {
  return buildShareMetadata({
    title: STUDENT_SIGNUP_METADATA.title,
    description: STUDENT_SIGNUP_METADATA.description,
    image: STUDENT_SIGNUP_METADATA.image,
    imageWidth: STUDENT_SIGNUP_METADATA.imageWidth,
    imageHeight: STUDENT_SIGNUP_METADATA.imageHeight,
    imageAlt: `${BRAND} — student registration`,
    path: STUDENT_SIGNUP_METADATA.path,
  });
}

export function createSiteMetadata(portal: AppPortal): Metadata {
  const title = PORTAL_TITLE[portal];
  const description = PORTAL_DESCRIPTION[portal];

  return {
    ...buildShareMetadata({ title, description }),
    applicationName: BRAND,
    title: {
      default: title,
      template: `%s | ${BRAND}`,
    },
    icons: {
      icon: [{ url: DEFAULT_OG_IMAGE, type: "image/png" }],
      apple: [{ url: DEFAULT_OG_IMAGE, type: "image/png" }],
      shortcut: DEFAULT_OG_IMAGE,
    },
  };
}
