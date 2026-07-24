import { useMemo } from "react";
import { useParams, useResolvedPath, useMatch } from "react-router";
import type { To, Params } from "react-router";

/**
 * Custom hook to determine if a link is active based on the current path.
 * @param link - The link to check.
 * @param exactMatch - Whether to match the exact path.
 * @returns An object containing the link and whether it is active.
 */
export function useNavLinkMatch(
  link: To | ((params: Params) => To),
  exactMatch = false
) {
  const params = useParams();

  const to = useMemo(
    () => (typeof link === "function" ? link(params) : link),
    [link, params]
  );

  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: exactMatch });

  return { to, isActive: match !== null };
}
