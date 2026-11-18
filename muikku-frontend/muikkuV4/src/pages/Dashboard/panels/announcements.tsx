import { Stack, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageAnnouncementsDataAtom } from "src/atoms/announcements";
import { Empty } from "~/src/components/Empty/empty";
import Panel, { type PanelItemBadge } from "~/src/components/Panel/Panel";
import { IconPin } from "@tabler/icons-react";
import { localize } from "~/src/locales/i18n";
import {
  toggleAnnouncementReadAtom,
  toggleAnnouncementPinnedAtom,
} from "src/atoms/announcements";
import { useSetAtom } from "jotai";
import type { Announcement } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * Converts a packed RGB integer into a CSS hex color.
 * @param color - Packed RGB integer from the API
 * @returns Hex color string
 */
function colorIntToHex(color: number) {
  const channel = (shift: number) =>
    ((color >> shift) & 255).toString(16).padStart(2, "0");

  return `#${channel(16)}${channel(8)}${channel(0)}`;
}

/**
 * Workspaces
 * @returns
 */
export function Announcements() {
  const announcements = useAtomValue(frontpageAnnouncementsDataAtom);
  const { t } = useTranslation(["announcements", "common"]);
  const setToggleRead = useSetAtom(toggleAnnouncementReadAtom);
  const setPinned = useSetAtom(toggleAnnouncementPinnedAtom);

  if (
    !announcements?.announcements ||
    announcements.announcements.length === 0
  ) {
    return <Empty title={t("labels.empty")} description={t("content.empty")} />;
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
        action: () => handleSetPinned(announcement.id),
      },
      {
        label: t(`actions.${readState}`, {
          ns: "announcements",
        }),
        action: () => handleMarkAsReadToggle(announcement.id),
      },
    ];
  };

  const generateAnnouncementIcons = (announcement: Announcement) => (
    <>
      {announcement.pinned && (
        <Tooltip label={t("labels.pinned")}>
          <IconPin color="pink" />
        </Tooltip>
      )}
      {announcement.pinnedToSelf && (
        <Tooltip label={t("labels.pinnedToSelf")}>
          <IconPin color="orange" />
        </Tooltip>
      )}
    </>
  );

  const generateAnnouncementBadges = (
    announcement: Announcement
  ): PanelItemBadge[] => {
    const workSpaceBadges = announcement.workspaces.map((workspace) => ({
      label: workspace.name,
      color: "blue.4",
    }));

    const categoriesBadges = announcement.categories.map((category) => ({
      label: category.category,
      color: colorIntToHex(category.color),
    }));

    return [...workSpaceBadges, ...categoriesBadges];
  };

  return (
    <Panel
      countIndicator={announcements?.unreadCount}
      indicatorTooltip="Unread count"
      title={t("label")}
    >
      <Stack>
        {announcements?.announcements.map((announcement) => (
          <Panel.Item
            itemId={announcement.id}
            key={announcement.id}
            title={announcement.caption}
            badges={generateAnnouncementBadges(announcement)}
            date={localize.date(announcement.created, "DD.MM.YYYY")}
            unseen={announcement.unread}
            icons={
              announcement.pinned || announcement.pinnedToSelf
                ? generateAnnouncementIcons(announcement)
                : undefined
            }
            itemActions={generateAnnouncementActions(announcement)}
          />
        ))}
      </Stack>
    </Panel>
  );
}
