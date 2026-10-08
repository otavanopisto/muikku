// src/router/types/routeHandle.ts
import type { NavigationItem } from "~/src/navigation/navigation";

/**
 * Secondary navigation handle configuration.
 */
export interface SecondaryNavHandleConfig {
  title: string;
  subTitle?: string;
  items: NavigationItem[];
  customWidth?: number;
  type?: "environment" | "workspace";
}

/**
 * Shared route handle. Extend as needed (aside, breadcrumbs, …).
 * Keep optional keys so routes without chrome stay clean.
 */
export interface AppRouteHandle {
  secondaryNav?: SecondaryNavHandleConfig;
  // aside?: { title?: string }; // later, if you want
}
