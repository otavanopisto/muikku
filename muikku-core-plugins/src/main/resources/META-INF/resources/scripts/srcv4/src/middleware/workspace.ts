import type { MiddlewareFunction } from "react-router";
import { getAtomValue } from "../jotaiStore";
import { workspaceInitializedAtom } from "../atoms/shared";
import { workspaceInit } from "../services/initialization";

/**
 * Workspace middleware
 * Runs after authMiddleware to check workspace-specific permissions
 */
export const workspaceMiddleware: MiddlewareFunction = async (
  { params },
  next
) => {
  const workspaceUrlName = params.workspaceUrlName;

  if (!workspaceUrlName) {
    throw new Error("Workspace URL name is required");
  }

  // Initialize workspace-specific data
  const workspaceInitialized = getAtomValue(workspaceInitializedAtom);
  if (workspaceUrlName !== workspaceInitialized) {
    await workspaceInit(workspaceUrlName);
  }

  // Continue to loaders
  await next();
};
