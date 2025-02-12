import * as React from "react";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";
import UserAvatar, { UserAvatarProps } from "./user";

/**
 * AvatarProps
 */
export interface GroupAvatarProps {
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
const GroupAvatar = (props: GroupAvatarProps) => {
  const { name, size, modifier, showTooltip, groupMembers, groupAvatar } =
    props;

  const groupAvatarMembers =
    groupMembers &&
    groupMembers.map((member) => <UserAvatar key={member.id} {...member} />);

  const avatarBase = (
    <div
      className={`avatar avatar--group ${
        size ? "avatar--" + size : ""
      } ${"avatar--" + groupAvatar} ${modifier ? "avatar--" + modifier : ""} `}
    >
      <span
        className={`avatar__decoration icon icon-${groupAvatar === "usergroup" ? "users" : "books"}`}
      ></span>
      <span className="avatar__text">{name}</span>
    </div>
  );

  const avatar = showTooltip ? (
    <Dropdown openByHover key="avatar" content={name}>
      {avatarBase}
    </Dropdown>
  ) : (
    avatarBase
  );

  return groupMembers && groupMembers.length > 0 ? (
    <Dropdown content={groupAvatarMembers}>{avatar}</Dropdown>
  ) : (
    avatar
  );
};

export default GroupAvatar;
