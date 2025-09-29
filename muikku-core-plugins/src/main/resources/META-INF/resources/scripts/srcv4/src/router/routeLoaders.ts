import { type LoaderFunction } from "react-router";

/**
 * Global initialization loader
 */
export const environmentLoader: LoaderFunction = () => null;

/**
 * Home page loader (for unauthenticated users)
 */
export const homeLoader: LoaderFunction = () => null;

/**
 * Dashboard loader (for authenticated users)
 */
export const dashboardLoader: LoaderFunction = () => null;

export const communicatorLoader: LoaderFunction = () => null;

/**
 * Workspace initialization loader
 */
export const workspaceLoader: LoaderFunction = () => null;

/**
 * Workspace home loader
 */
export const workspaceHomeLoader: LoaderFunction = () => null;

/**
 * Workspace settings loader
 */
export const workspaceSettingsLoader: LoaderFunction = () => null;
