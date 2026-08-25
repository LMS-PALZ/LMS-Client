import {
  clearStudentAuth,
  isAuthErrorMessage,
  isAuthExpiredError,
} from "@ssu/api";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryClientConfig,
} from "@tanstack/react-query";
import axios from "axios";
import { holdSignOutDuringLiveSession } from "./live-session-guard";
import { mutationToast } from "./notify";

let isHandlingExpiry = false;
let interceptorInstalled = false;
let warnedDuringLiveSession = false;

function handleSessionExpired(loginPath: string) {
  if (typeof window === "undefined" || isHandlingExpiry) return;

  const signOut = () => {
    isHandlingExpiry = true;
    clearStudentAuth();
    mutationToast.info("Your session has expired. Please sign in again.");
    window.location.assign(loginPath);
  };

  if (holdSignOutDuringLiveSession(signOut)) {
    if (!warnedDuringLiveSession) {
      warnedDuringLiveSession = true;
      mutationToast.info(
        "Your session expired, but you can stay in this class. You will be asked to sign in again once it ends.",
      );
    }
    return;
  }

  signOut();
}

function shouldForceLogout(error: unknown): boolean {
  if (isAuthExpiredError(error)) return true;
  if (error instanceof Error && isAuthErrorMessage(error.message)) return true;
  return false;
}

export function setupSessionExpiryHandler(loginPath: string) {
  if (typeof window === "undefined" || interceptorInstalled) return;
  interceptorInstalled = true;

  axios.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (shouldForceLogout(error)) {
        handleSessionExpired(loginPath);
      }
      return Promise.reject(error);
    },
  );
}

type AuthAwareQueryClientConfig = Omit<
  QueryClientConfig,
  "queryCache" | "mutationCache"
>;

export function createAuthAwareQueryClient(
  loginPath: string,
  config?: AuthAwareQueryClientConfig,
) {
  const onError = (error: unknown) => {
    if (shouldForceLogout(error)) {
      handleSessionExpired(loginPath);
    }
  };

  return new QueryClient({
    ...config,
    defaultOptions: {
      queries: {
        staleTime: 1000 * 30,
        retry: (failureCount, error) => {
          if (shouldForceLogout(error)) return false;
          return failureCount < 1;
        },
        ...config?.defaultOptions?.queries,
      },
      mutations: {
        ...config?.defaultOptions?.mutations,
      },
    },
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
  });
}
