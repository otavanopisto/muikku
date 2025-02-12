import * as React from "react";
import "~/sass/elements/avatar.scss";
import UserAvatar, { UserAvatarProps } from "./subtypes/user";
import GroupAvatar from "./subtypes/group";
/**
 * AvatarProps
 */
export interface AvatarProps {
  hasImage: boolean;
  id: number | null;
  name: string;
  size?: string;
  groupAvatar?: "usergroup" | "workspace";
  groupMembers?: UserAvatarProps[];
  userCategory?: number;
  avatarAriaLabel?: string;
  modifier?: string;
  showTooltip?: boolean;
  avatarAriaHidden?: boolean;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const Avatar = (props: AvatarProps) => {
  const { size, modifier, avatarAriaHidden, groupAvatar } = props;

  return (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } ${groupAvatar ? "avatar-container--group" : ""} rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      {groupAvatar ? <GroupAvatar {...props} /> : <UserAvatar {...props} />}
    </div>
  );
};

export default Avatar;
