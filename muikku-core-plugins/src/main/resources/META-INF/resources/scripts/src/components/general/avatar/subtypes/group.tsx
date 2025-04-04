import * as React from "react";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";
import GroupAvatarUsers from "./group-components/group-avatar-users";
import { AvatarGroupUser } from "./group-components/group-avatar-user";

/**
 * AvatarProps
 */
export interface GroupAvatarProps {
  id: number | null;
  name: string;
  size?: string;
  groupAvatar?: "usergroup" | "workspace";
  groupMembers?: AvatarGroupUser[];
  groupMemberAction?: (userId: number) => JSX.Element;
  modifier?: string;
  showTooltip?: boolean;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const GroupAvatar = (props: GroupAvatarProps) => {
  const {
    name,
    size,
    modifier,
    showTooltip,
    groupMembers,
    groupAvatar,
    groupMemberAction,
  } = props;

  const avatarBase = (
    <div
      className={`avatar avatar--group ${groupMembers ? "avatar--group-members" : ""} ${
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
    <Dropdown
      modifier="group-members"
      content={
        <GroupAvatarUsers users={groupMembers} action={groupMemberAction} />
      }
    >
      {avatar}
    </Dropdown>
  ) : (
    avatar
  );
};
export default GroupAvatar;
