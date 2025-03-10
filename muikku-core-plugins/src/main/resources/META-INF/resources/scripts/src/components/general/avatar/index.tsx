import * as React from "react";
import "~/sass/elements/avatar.scss";
import UserAvatar from "./subtypes/user";
import { AvatarGroupUser } from "./subtypes/group-components/user";
import GroupAvatar from "./subtypes/group";

/**
 * AvatarEntity
 */
export interface AvatarEntity {
  id: number | null;
  name: string;
  hasImage: boolean;
  showTooltip?: boolean;
  groupAvatar?: "usergroup" | "workspace";
  groupMembers?: AvatarGroupUser[];
  groupMemberAction?: (userId: number) => JSX.Element;
}

/**
 * AvatarProps
 */
interface AvatarProps extends AvatarEntity {
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
  modifier?: string;
  groupAvatarModifier?: string;
  userAvatarModifier?: string;
  avatarAriaHidden?: boolean;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const Avatar = (props: AvatarProps) => {
  const {
    hasImage,
    id,
    name,
    size,
    groupAvatar,
    groupMembers,
    groupMemberAction,
    userCategory,
    avatarAriaLabel,
    modifier,
    groupAvatarModifier,
    userAvatarModifier,
    showTooltip,
    avatarAriaHidden,
  } = props;

  return (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } ${groupAvatar ? "avatar-container--group" : ""} rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      {groupAvatar ? (
        <GroupAvatar
          id={id}
          name={name}
          size={size}
          groupAvatar={groupAvatar}
          groupMembers={groupMembers}
          groupMemberAction={groupMemberAction}
          modifier={groupAvatarModifier}
          showTooltip={showTooltip}
        />
      ) : (
        <UserAvatar
          id={id}
          name={name}
          size={size}
          hasImage={hasImage}
          userCategory={userCategory}
          modifier={userAvatarModifier}
          avatarAriaLabel={avatarAriaLabel}
          showTooltip={showTooltip}
        />
      )}
    </div>
  );
};

export default Avatar;
