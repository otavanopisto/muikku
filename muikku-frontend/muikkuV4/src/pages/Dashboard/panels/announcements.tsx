import { Stack, Tooltip, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageAnnouncementsDataAtom } from "src/atoms/announcements";
import { Empty } from "src/components/Empty";
import Panel from "~/src/components/Panel/Panel";
import { IconSpeakerphone, IconPin } from "@tabler/icons-react";
import { localize } from "~/src/locales/i18n";
import {
  toggleAnnouncementRead,
  toggleAnnouncementPinned,
} from "src/atoms/announcements";
import { useSetAtom } from "jotai";
import type { Announcement } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * Workspaces
 * @returns
 */
export function Announcements() {
  const announcements = useAtomValue(frontpageAnnouncementsDataAtom);
  const { t } = useTranslation();
  const setToggleRead = useSetAtom(toggleAnnouncementRead);
  const setPinned = useSetAtom(toggleAnnouncementPinned);

  if (!announcements?.announcements) {
    return <Empty title="No announcements found" />;
  }

  const handleMarkAsReadToggle = (announcementId: number) => {
    void setToggleRead(announcementId);
  };

  const handleSetPinned = (announcementId: number) => {
    void setPinned(announcementId);
  };

  const generateAnnouncementActions = (announcement: Announcement) => {
    const pinnedState = announcement.pinnedToSelf ? "unpin" : "pin";
    const readState = announcement.unread ? "setRead" : "setUnread";
    return [
      {
        label: t(`actions.${pinnedState}`, {
          ns: "announcements",
        }),
        action: (announcementId: number) => handleSetPinned(announcementId),
      },
      {
        label: t(`actions.${readState}`, {
          ns: "announcements",
        }),
        action: (announcementId: number) =>
          handleMarkAsReadToggle(announcementId),
      },
    ];
  };

  const generateAnnouncementIcons = (announcement: Announcement) => (
    <Group gap="0">
      {announcement.pinned && (
        <Tooltip label="Pinned">
          <IconPin color="pink" />
        </Tooltip>
      )}
      {announcement.pinnedToSelf && (
        <Tooltip label="Pinned to self" mr="xs">
          <IconPin color="orange" />
        </Tooltip>
      )}
    </Group>
  );

  return (
    <Panel
      countIndicator={announcements?.unreadCount}
      indicatorTooltip="Unread count"
      icon={<IconSpeakerphone />}
      title="Announcements"
    >
      <Stack>
        {announcements?.announcements.map((announcement) => (
          <Panel.Item
            itemId={announcement.id}
            key={announcement.id}
            title={announcement.caption}
            date={localize.date(announcement.created, "DD.MM.YYYY")}
            unseen={announcement.unread}
            icons={generateAnnouncementIcons(announcement)}
            itemActions={generateAnnouncementActions(announcement)}
          />
        ))}
      </Stack>
    </Panel>
  );
}
