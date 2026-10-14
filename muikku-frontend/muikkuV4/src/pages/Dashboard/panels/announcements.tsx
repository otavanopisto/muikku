import { Stack, Button, Menu } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageAnnouncementsDataAtom } from "src/atoms/announcements";
import { Empty } from "src/components/Empty";
import Panel, { type PanelMenuItem } from "~/src/components/Panel/Panel";
import { IconSpeakerphone } from "@tabler/icons-react";
import { localize } from "~/src/locales/i18n";
import {
  toggleAnnouncementRead,
  toggleAnnouncementPinned,
} from "src/atoms/announcements";
import { useSetAtom } from "jotai";
/**
 * Workspaces
 * @returns
 */
export function Announcements() {
  const announcements = useAtomValue(frontpageAnnouncementsDataAtom);

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

  const announcementActions: PanelMenuItem[] = [
    {
      label: "TODO: Localize pinned",
      action: (announcementId: number) => handleSetPinned(announcementId),
    },
    {
      label: "TODO: Localize mark as read",
      action: (announcementId: number) =>
        handleMarkAsReadToggle(announcementId),
    },
  ];

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
            itemActions={announcementActions}
          />
        ))}
      </Stack>
    </Panel>
  );
}
