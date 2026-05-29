import { createSiteMetadata } from "@ssu/config/site-metadata";
import { PlusJakartaFontLinks } from "@ssu/ui";
import type { ReactNode } from "react";
import { AppProviders } from "@/providers";
import "./globals.css";

export const metadata = createSiteMetadata("admin");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PlusJakartaFontLinks />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
