import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

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
  } = props;

  const category = React.useMemo(() => {
    if (userCategory) return userCategory;
    if (id) {
      return id > 10 ? (id % 10) + 1 : id;
    }
    // This is a nullcheck. Makes the avatar readable (and colourful!) if the id is "null"
    return Math.floor(Math.random() * 10 + 1);
  }, [id, userCategory]);

  return hasImage ? (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      <img
        src={getUserImageUrl(id)}
        alt=""
        aria-label={avatarAriaLabel}
        className={`avatar avatar-img ${size ? "avatar--" + size : ""} ${
          modifier ? "avatar--" + modifier : ""
        }`}
      />
      <div
        className={`avatar avatar--category-${category} ${
          size ? "avatar--" + size : ""
        } ${modifier ? "avatar--" + modifier : ""}`}
      >
        {firstName[0]}
      </div>
    </div>
  ) : (
    <div
      className={`avatar-container ${size ? "avatar-container--" + size : ""} ${groupAvatar ? "avatar-container--" + groupAvatar : ""} ${
        modifier ? "avatar-container--" + modifier : ""
      } rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      {groupAvatar ? (
        <div
          className={`avatar avatar--group ${
            size ? "avatar--" + size : ""
          } ${groupAvatar ? "avatar--" + groupAvatar : ""} ${modifier ? "avatar--" + modifier : ""} `}
        >
          <span
            className={`avatar__decoration icon icon-${groupAvatar === "usergroup" ? "users" : "books"}`}
          ></span>
          <span className="avatar__text">{firstName}</span>
        </div>
      ) : (
        <div
          className={`avatar avatar--category-${category} ${
            size ? "avatar--" + size : ""
          } ${groupAvatar ? "avatar--" + groupAvatar : ""} ${modifier ? "avatar--" + modifier : ""} `}
        >
          {firstName[0]}
        </div>
      )}
    </div>
  );
};

export default Avatar;
