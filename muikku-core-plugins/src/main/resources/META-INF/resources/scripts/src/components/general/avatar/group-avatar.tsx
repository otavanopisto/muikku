import * as React from "react";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";
import GroupAvatarUsers from "./group-avatar/group-avatar-users";
import { AvatarGroupUser } from "./group-avatar/group-avatar-user";

/**
 * AvatarProps
 */
export interface GroupAvatarProps {
  id: number | null;
  name: string;
  size?: string;
  groupAvatar?: "usergroup" | "workspace";
  groupMembers?: AvatarGroupUser[];
  groupMemberAction?: (userId: number) => React.JSX.Element;
  modifier?: string;
  showTooltip?: boolean;
}

/**
 * Avatar
 * @param props props
 * @returns React.JSX.Element
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

  return (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } ${groupAvatar ? "avatar-container--group" : ""} rs_skip_always`}
    >
      {" "}
      {groupMembers && groupMembers.length > 0 ? (
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
      )}
    </div>
  );
};
export default GroupAvatar;
