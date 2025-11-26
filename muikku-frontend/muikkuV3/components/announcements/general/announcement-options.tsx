import Link from "~/components/general/link";
import * as React from "react";
import { Announcement } from "~/generated/client";
import { useDispatch } from "react-redux";
import Dropdown from "~/components/general/dropdown";
import { markOneAsRead, pinAnnouncementForSelf } from "~/actions/announcements";
import { useTranslation } from "react-i18next";
import { IconButton } from "~/components/general/button";

/**
 * AnnouncementOptionsProps
 */
interface AnnouncementOptionsProps {
  announcement: Announcement;
}

/**
 * AnnouncementOptionItem
 */
interface AnnouncementOptionItem {
  id: string;
  onClick: (onClose: () => void) => void;
  icon: string;
  label: string;
  disabled?: boolean;
}

/**
 * AnnouncementOptions component
 * @param props props
 * @returns JSX.Element
 */
const AnnouncementOptions: React.FC<AnnouncementOptionsProps> = (props) => {
  const { announcement } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation("messaging");

  /**
   * handleSelfPinAnnouncement
   * @param announcement announcement to pin
   * @param onClose onClose function
   */
  const handleSelfPinAnnouncement = (
    announcement: Announcement,
    onClose: () => void
  ) => {
    dispatch(pinAnnouncementForSelf(announcement));
    onClose();
  };

  /**
   * handleMarkAnnouncementRead
   * @param announcement announcement to mark as read
   * @param onClose onClose function
   */
  const handleMarkAnnouncementRead = (
    announcement: Announcement,
    onClose: () => void
  ) => {
    dispatch(markOneAsRead(announcement));
    onClose();
  };

  const items: AnnouncementOptionItem[] = [
    {
      id: "pinAnnouncement",
      /**
       * onClick
       * @param onClose onClose function
       */
      onClick: (onClose: () => void) =>
        handleSelfPinAnnouncement(announcement, onClose),
      icon: "icon-pin",
      label: announcement.pinnedToSelf ? t("actions.unpin") : t("actions.pin"),
    },
    {
      id: "markAnnouncementRead",
      /**
       * onClick
       * @param onClose onClose function
       */
      onClick: (onClose: () => void) =>
        handleMarkAnnouncementRead(announcement, onClose),
      icon: "icon-envelope-open",
      disabled: !announcement.unread,
      label: t("actions.markAsRead"),
    },
  ];

  /**
   * renderAnnouncementOption
   * @param item announcement option item
   * @param onClose onClose function
   * @returns JSX.Element
   */
  const renderAnnouncementOption = (
    item: AnnouncementOptionItem,
    onClose: () => void
  ) => (
    <Link
      key={item.id}
      disabled={item.disabled}
      className="link link--full link--profile-dropdown"
      onClick={() => item.onClick(onClose)}
      role="menuitem"
    >
      <span className={`link__icon ${item.icon}`}></span>
      <span>{item.label}</span>
    </Link>
  );

  return (
    <Dropdown
      modifier="item-list__item-dropdown item-list__item-dropdown--announcements"
      items={items.map(
        (item) => (onClose: () => void) =>
          renderAnnouncementOption(item, onClose)
      )}
    >
      <IconButton icon="more_vert" />
    </Dropdown>
  );
};

export default AnnouncementOptions;
