import { atom } from "jotai";
import { atomWithQuery, atomWithMutation } from "jotai-tanstack-query";
import { getAnnouncerApi } from "~/api";
import type { GetAnnouncementsRequest } from "~/generated/client";
import {
  queryClient,
  FRONTPAGE_ANNOUNCEMENTS_QUERY_KEY,
} from "src/queryClient";

const announcerApi = getAnnouncerApi();

export const frontpageAnnouncementsQueryAtom = atomWithQuery(() => {
  const params: GetAnnouncementsRequest = {
    maxResults: 10,
  };

  return {
    queryKey: FRONTPAGE_ANNOUNCEMENTS_QUERY_KEY,
    queryFn: async () => {
      try {
        return await announcerApi.getAnnouncements(params);
      } catch (error) {
        throw new Error("Failed to get announcements");
      }
    },
  };
});

export const frontpageAnnouncementsDataAtom = atom(
  (get) => get(frontpageAnnouncementsQueryAtom).data
);

export const toggleAnnouncementRead = atom(
  null,
  async (_get, _set, announcementId: number) => {
    try {
      await announcerApi.markAnnouncementAsRead({
        announcementId,
      });

      const currentAnnouncements = _get(frontpageAnnouncementsDataAtom);

      if (!currentAnnouncements) {
        return;
      }

      const announcementIndex = currentAnnouncements.announcements.findIndex(
        (announcement) => announcement.id === announcementId
      );

      if (announcementIndex === -1) {
        return;
      }

      const newAnnouncements = [...currentAnnouncements.announcements];
      const announcementUnreadState =
        newAnnouncements[announcementIndex].unread;

      newAnnouncements[announcementIndex].unread = !announcementUnreadState;

      queryClient.setQueryData(FRONTPAGE_ANNOUNCEMENTS_QUERY_KEY, {
        ...currentAnnouncements,
        announcements: newAnnouncements,
        unreadCount:
          currentAnnouncements.unreadCount + (announcementUnreadState ? -1 : 1),
      });
    } catch (error) {
      throw new Error("Failed to toggle announcement read");
    }
  }
);

export const toggleAnnouncementPinned = atom(
  null,
  async (_get, _set, announcementId: number) => {
    try {
      const recipient = await announcerApi.pinAnnouncement({
        announcementId,
      });

      const currentAnnouncements = _get(frontpageAnnouncementsDataAtom);

      if (!currentAnnouncements) {
        return;
      }

      queryClient.setQueryData(FRONTPAGE_ANNOUNCEMENTS_QUERY_KEY, {
        ...currentAnnouncements,
        announcements: currentAnnouncements.announcements.map((announcement) =>
          announcement.id === announcementId
            ? { ...announcement, pinnedToSelf: recipient.pinned }
            : announcement
        ),
      });
    } catch (error) {
      throw new Error("Failed to set announcement pinned");
    }
  }
);
