import type { User } from "~/generated/client";

/**
 * getUserImageUrl
 * @param user user
 * @param type type
 * @param version version
 */
export function getUserImageUrl(
  user: User | number,
  type?: number | string,
  version?: number
) {
  let id: number;
  if (typeof user === "number") {
    id = user;
  } else {
    id = user.id;
  }
  return `/rest/user/files/user/${id}/identifier/profile-image-${
    type ?? 96
  }?v=${version ?? 1}`;
}
