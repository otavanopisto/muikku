import { type LoaderFunction } from "react-router";
import { getAtomValue } from "./jotaiStore";
import { userAtom } from "./atoms/auth";
import {
  globalInitializedAtom,
  workspaceInitializedAtom,
} from "./atoms/shared";
import { globalInit, workspaceInit } from "./services/initialization";

/**
 * Global initialization loader
 */
export const environmentLoader: LoaderFunction = async () => {
  const isGlobalInitialized = getAtomValue(globalInitializedAtom);

  if (!isGlobalInitialized) {
    await globalInit();
  }

  return null;
};

/**
 * Home page loader (for unauthenticated users)
 */
export const homeLoader: LoaderFunction = async () => {
  const user = getAtomValue(userAtom);

  // If user is authenticated, redirect to dashboard
  if (user?.loggedIn) {
    throw new Response("", {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  return null;
};

/**
 * Dashboard loader (for authenticated users)
 */
export const dashboardLoader: LoaderFunction = async () => {
  const user = getAtomValue(userAtom);

  // If user is not authenticated, redirect to home
  if (!user?.loggedIn) {
    throw new Response("", { status: 302, headers: { Location: "/" } });
  }

  return null;
};

/**
 * Workspace initialization loader
 */
export const workspaceLoader: LoaderFunction = async ({ params }) => {
  const workspaceUrlName = params.workspaceUrlName;

  if (!workspaceUrlName) {
    throw new Error("Workspace URL name is required");
  }

  // Ensure global initialization is done first (includes auth check)
  const isGlobalInitialized = getAtomValue(globalInitializedAtom);
  if (!isGlobalInitialized) {
    await globalInit();
  }

  // Check if user is authenticated before proceeding with workspace initialization
  const user = getAtomValue(userAtom);
  if (!user?.loggedIn) {
    throw new Response("", { status: 302, headers: { Location: "/" } });
  }

  // Now initialize workspace-specific data
  const workspaceInitialized = getAtomValue(workspaceInitializedAtom);
  if (workspaceUrlName !== workspaceInitialized) {
    await workspaceInit(workspaceUrlName);
    // Note: We don't set the atom here since workspaceInit handles it
  }

  return null;
};

/**
 * Workspace home loader
 */
export const workspaceHomeLoader: LoaderFunction = async () => {
  // Authentication is already checked in workspaceLoader
  return null;
};

/**
 * Workspace settings loader
 */
export const workspaceSettingsLoader: LoaderFunction = async () => {
  // Authentication is already checked in workspaceLoader
  return null;
};
