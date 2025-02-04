import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";

/**
 * AvatarProps
 */
export interface AvatarProps {
  hasImage: boolean;
  id: number | null;
  firstName: string;
  size?: string;
  groupAvatar?: "usergroup" | "workspace";
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
  const {
    id,
    userCategory,
    hasImage,
    firstName,
    size,
    modifier,
    avatarAriaLabel,
    avatarAriaHidden,
    groupAvatar,
    showTooltip,
  } = props;

  const category = React.useMemo(() => {
    if (userCategory) return userCategory;
    if (id) {
      return id > 10 ? (id % 10) + 1 : id;
    }
    // This is a nullcheck. Makes the avatar readable (and colourful!) if the id is "null"
    return Math.floor(Math.random() * 10 + 1);
  }, [id, userCategory]);

  const avatarContent = hasImage ? (
    <img
      src={getUserImageUrl(id)}
      alt=""
      aria-label={avatarAriaLabel}
      className={`avatar avatar-img ${size ? "avatar--" + size : ""} ${
        modifier ? "avatar--" + modifier : ""
      }`}
    />
  ) : (
    <div
      className={`avatar avatar--category-${category} ${
        size ? "avatar--" + size : ""
      } ${groupAvatar ? "avatar--" + groupAvatar : ""} ${modifier ? "avatar--" + modifier : ""} `}
    >
      {firstName[0]}
    </div>
  );

  return (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } ${groupAvatar ? "avatar-container--group" : ""} rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      {groupAvatar ? (
        <div
          className={`avatar avatar--group ${
            size ? "avatar--" + size : ""
          } ${"avatar--" + groupAvatar} ${modifier ? "avatar--" + modifier : ""} `}
        >
          <span
            className={`avatar__decoration icon icon-${groupAvatar === "usergroup" ? "users" : "books"}`}
          ></span>
          <span className="avatar__text">{firstName}</span>
        </div>
      ) : showTooltip ? (
        <Dropdown openByHover key="avatar" content={firstName}>
          {avatarContent}
        </Dropdown>
      ) : (
        avatarContent
      )}
    </div>
  );
};

export default Avatar;
