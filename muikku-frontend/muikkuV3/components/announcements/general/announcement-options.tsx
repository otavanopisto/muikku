import Link from "~/components/general/link";
import * as React from "react";
import { Announcement } from "~/generated/client";
import { useDispatch } from "react-redux";
import Dropdown from "~/components/general/dropdown";
import { markOneAsRead } from "~/actions/announcements";

/**
 * AnnouncementOptionsProps
 */
interface AnnouncementOptionsProps {
  announcement: Announcement;
}

/**
 * AnnouncementOptions component
 * @param props props
 * @returns JSX.Element
 */
const AnnouncementOptions: React.FC<AnnouncementOptionsProps> = (props) => {
  const { announcement } = props;
  const dispatch = useDispatch();

  const handleSelfPinAnnouncement = (announcementId: number) => {
    console.log("Pin announcement with ID:", announcementId);
  };

  const handleMarkAnnouncementRead = (announcement: Announcement) => {
    dispatch(markOneAsRead(announcement));
  };

  const renderAnnouncementOptions = (
    announcement: Announcement
  ): React.ReactNode[] => [
    <Link
      key="pin"
      disabled={announcement.pinned}
      className="link link--full link--profile-dropdown"
      onClick={() => handleSelfPinAnnouncement(announcement.id)}
      role="menuitem"
    >
      <span className="link__icon icon-pin"></span>
      <span>Kiinnitä</span>
    </Link>,
    <Link
      key="pin2"
      disabled={!announcement.unread}
      className="link link--full link--profile-dropdown"
      onClick={() => handleMarkAnnouncementRead(announcement)}
      role="menuitem"
    >
      <span className="link__icon icon-envelope-open"></span>
      <span>Merkitse luetuksi</span>
    </Link>,
  ];
  return (
    <Dropdown
      modifier="item-list__item-dropdown item-list__item-dropdown--announcements"
      items={renderAnnouncementOptions(announcement)}
    >
      <span className="icon icon-cog"></span>
    </Dropdown>
  );
};

export default AnnouncementOptions;
