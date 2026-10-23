import { QueryClient } from "@tanstack/react-query";

// Shared query client for the application
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Shared query keys for the application
export const WHOAMI_QUERY_KEY = ["auth", "whoami"] as const;
export const LOCALE_QUERY_KEY = ["locale"] as const;
export const FRONTPAGE_ANNOUNCEMENTS_QUERY_KEY = [
  "frontpage",
  "announcements",
] as const;

// Absences query keys
export const FRONTPAGE_ABSENCES_QUERY_KEY = ["frontpage", "absences"] as const;

// Tasks query keys
export const FRONTPAGE_TASKS_QUERY_KEY = ["frontpage", "tasks"] as const;
export const CREATOR_TASKS_QUERY_KEY = ["creator", "tasks"] as const;
export const RECIPIENT_TASKS_QUERY_KEY = ["recipient", "tasks"] as const;

// Shared query keys for the workspace.
export const workspaceBasicInfoQueryKey = (urlName: string) =>
  ["workspace", "basicInfo", urlName] as const;
export const workspacePermissionsQueryKey = (workspaceId: number) =>
  ["workspace", "permissions", workspaceId] as const;
export const workspaceCanSignupQueryKey = (workspaceId: number) =>
  ["workspace", "canSignup", workspaceId] as const;
