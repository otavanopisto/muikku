import { atom } from "jotai";
import { AuthService, type User } from "~/src/services/auth";

// User state
export const userAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

// Authentication flow states
export const authLoadingAtom = atom<boolean>(false);
export const authErrorAtom = atom<string | null>(null);
export const authInitializedAtom = atom<boolean>(false);

// User metadata
export const userProfileAtom = atom((get) => get(userAtom)?.profile || null);
export const userRolesAtom = atom((get) => get(userAtom)?.roles || []);
export const userPermissionsAtom = atom(
  (get) => get(userAtom)?.permissions || []
);

/**
 * Initialize the authentication status atom action
 */
export const initializeAuthStatusAtom = atom(null, async (get, set) => {
  // If the auth status is already initialized, return
  if (get(authInitializedAtom)) return;

  // Initialize the auth status
  const user = await AuthService.checkAuthenticationStatus();
  set(userAtom, user);
});

// Derived authentication states
// export const isStudentAtom = atom((get) =>
//   get(userRolesAtom).includes("STUDENT")
// );
// export const isTeacherAtom = atom((get) =>
//   get(userRolesAtom).includes("TEACHER")
// );
// export const isAdminAtom = atom((get) => get(userRolesAtom).includes("ADMIN"));
