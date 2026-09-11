import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { AuthService } from "src/services/auth";
import type { UserPermissions } from "src/services/permissions";
import { WHOAMI_QUERY_KEY } from "src/queryClient";

/** Server cache for whoami — do not useAtomValue this in components. */
export const whoAmIQueryAtom = atomWithQuery(() => ({
  queryKey: WHOAMI_QUERY_KEY,
  queryFn: () => AuthService.checkAuthenticationStatus(),
  staleTime: Infinity,
  retry: false,
}));

/** App-facing user — derived from query data. */
export const userAtom = atom((get) => get(whoAmIQueryAtom).data ?? null);

export const isAuthenticatedAtom = atom(
  (get) => get(userAtom)?.loggedIn ?? false
);

/** True once the first whoami attempt has settled. */
export const authInitializedAtom = atom((get) => {
  const q = get(whoAmIQueryAtom);
  return q.isSuccess || q.isError;
});

// User profile atoms
export const userProfileAtom = atom((get) => get(userAtom)?.profile ?? null);
export const userRolesAtom = atom((get) => get(userAtom)?.roles ?? []);
export const userPermissionsAtom = atom(
  (get) => get(userAtom)?.permissions ?? ({} as UserPermissions)
);

/** Force refresh whoami (optional). */
export const refetchAuthAtom = atom(null, (get) => {
  void get(whoAmIQueryAtom).refetch();
});
