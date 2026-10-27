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

/**
 * htmlToPlainText - Convert HTML to plain text
 * @param html - HTML string
 * @returns Plain text
 */
export function htmlToPlainText(html: string) {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n");
  const text = new DOMParser().parseFromString(withBreaks, "text/html").body
    .textContent;
  return (text ?? "").replace(/\n{3,}/g, "\n\n").trim();
}
