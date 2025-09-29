import { getAtomValue } from "../../jotaiStore";
import { globalInitializedAtom } from "../../atoms/shared";
import { globalInit } from "../../services/initialization";
import type { MiddlewareFunction } from "react-router";

/**
 * Authentication middleware
 * Runs before any loaders to ensure proper initialization and authentication
 * @param _ - The _
 * @param next - The next middleware
 * @returns The next middleware
 */
export const authMiddleware: MiddlewareFunction = async (_, next) => {
  // Ensure global initialization is complete
  const isGlobalInitialized = getAtomValue(globalInitializedAtom);

  if (!isGlobalInitialized) {
    await globalInit();
  }

  // Continue to loaders
  await next();
};
