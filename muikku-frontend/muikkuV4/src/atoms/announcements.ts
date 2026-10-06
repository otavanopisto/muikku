import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getAnnouncerApi } from "~/api";
import type { GetAnnouncementsRequest } from "~/generated/client";

const announcerApi = getAnnouncerApi();

export const frontpageAnnouncementsQueryAtom = atomWithQuery(() => {
  const params: GetAnnouncementsRequest = {
    hideEnvironmentAnnouncements: false,
    hideWorkspaceAnnouncements: false,
    hideGroupAnnouncements: false,
    onlyMine: true,
    maxResults: 10,
  };

  return {
    queryKey: ["frontpage", "announcements"],
    queryFn: () => announcerApi.getAnnouncements(params),
  };
});

export const frontpageAnnouncementsDataAtom = atom(
  (get) => get(frontpageAnnouncementsQueryAtom).data
);
