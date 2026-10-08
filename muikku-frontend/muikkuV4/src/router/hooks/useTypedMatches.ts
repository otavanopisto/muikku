// src/hooks/useTypedMatches.ts
import { useMatches, type UIMatch } from "react-router";
import type { AppRouteHandle } from "src/router/types/routeHandle";

export type TypedUIMatch<TData = unknown> = UIMatch<TData, AppRouteHandle>;

/**
 * useMatches with our AppRouteHandle typing.
 */
export function useTypedMatches<TData = unknown>(): TypedUIMatch<TData>[] {
  return useMatches() as TypedUIMatch<TData>[];
}

/**
 * Deepest (leaf-most) match that defines `key` on handle.
 */
export function useDeepestHandleValue<K extends keyof AppRouteHandle>(
  key: K
): AppRouteHandle[K] | undefined {
  const matches = useTypedMatches();

  for (let i = matches.length - 1; i >= 0; i--) {
    const value = matches[i].handle?.[key];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}
