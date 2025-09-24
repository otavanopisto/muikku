import { type LoaderFunction } from "react-router";

/**
 * Global initialization loader
 */
export const environmentLoader: LoaderFunction = () => {
  return null;
};

/**
 * Home page loader (for unauthenticated users)
 */
export const homeLoader: LoaderFunction = () => {
  return null;
};

/**
 * Dashboard loader (for authenticated users)
 */
export const dashboardLoader: LoaderFunction = () => {
  return null;
};

/**
 * Workspace initialization loader
 */
export const workspaceLoader: LoaderFunction = () => {
  return null;
};

/**
 * Workspace home loader
 */
export const workspaceHomeLoader: LoaderFunction = () => {
  // Authentication is already checked in workspaceLoader
  return null;
};

/**
 * Workspace settings loader
 */
export const workspaceSettingsLoader: LoaderFunction = () => {
  // Authentication is already checked in workspaceLoader
  return null;
};
