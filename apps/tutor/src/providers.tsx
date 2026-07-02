"use client";

import { tutorPath } from "@ssu/config/portal-paths";
import {
  createAuthAwareQueryClient,
  setupSessionExpiryHandler,
} from "@ssu/queries";
import { AppToaster } from "@ssu/ui";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";

const LOGIN_PATH = tutorPath("/login");

export function AppProviders({ children }: { children: ReactNode }) {
  const [client] = useState(() => createAuthAwareQueryClient(LOGIN_PATH));

  useEffect(() => {
    setupSessionExpiryHandler(LOGIN_PATH);
  }, []);

  return (
    <QueryClientProvider client={client}>
      {children}
      <AppToaster />
    </QueryClientProvider>
  );
}
