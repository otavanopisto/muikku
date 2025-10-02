import { type LoaderFunction } from "react-router";
import { getCurrentStudentAtom } from "../atoms/guider";
import { executeAtomAction } from "../jotaiStore";

/**
 * Global initialization loader
 */
export const environmentLoader: LoaderFunction = () => null;

/**
 * Home page loader (for unauthenticated users)
 */
export const homeLoader: LoaderFunction = () => null;

/**
 * Dashboard loader
 */
export const dashboardLoader: LoaderFunction = () => null;

/**
 * Communicator loader
 */
export const communicatorLoader: LoaderFunction = () => null;

/**
 * Guider loader
 */
export const guiderLoader: LoaderFunction = () => null;

/**
 * Guider student loader
 */
export const guiderStudentLoader: LoaderFunction = ({ params }) => {
  const { studentId } = params;

  if (!studentId) {
    throw new Error("Student ID is required");
  }

  void executeAtomAction(getCurrentStudentAtom, studentId);

  return null;
};

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
