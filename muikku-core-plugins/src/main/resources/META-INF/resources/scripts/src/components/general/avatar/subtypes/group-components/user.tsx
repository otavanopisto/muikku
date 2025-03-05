import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

/**
 * AvatarGroupUser
 */
export interface AvatarGroupUser {
  hasImage: boolean;
  id: number | null;
  name: string;
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
  modifier?: string;
  avatarAriaHidden?: boolean;
}

/**
 * GroupAvatarUserProps
 */
interface GroupAvatarUserProps extends AvatarGroupUser {
  action?: (userId: number) => JSX.Element;
}

/**
 * GroupAvatarUser
 * @param props props
 * @returns JSX.Element
 */
const GroupAvatarUser = (props: GroupAvatarUserProps) => {
  const {
    id,
    userCategory,
    hasImage,
    name,
    size,
    modifier,
    action,
    avatarAriaLabel,
    avatarAriaHidden,
  } = props;

  const category = React.useMemo(() => {
    if (userCategory) return userCategory;
    if (id) {
      return id > 10 ? (id % 10) + 1 : id;
    }
    // This is a nullcheck. Makes the avatar readable (and colourful!) if the id is "null"
    return Math.floor(Math.random() * 10 + 1);
  }, [id, userCategory]);

  return (
    <div className="avatar__group-user">
      <div
        className={`avatar-container ${size ? "avatar-container--" + size : ""} ${
          modifier ? "avatar-container--" + modifier : ""
        }`}
        aria-hidden={avatarAriaHidden}
      >
        {hasImage && (
          <img
            src={getUserImageUrl(id)}
            alt=""
            aria-label={avatarAriaLabel}
            className={`avatar avatar-img ${size ? "avatar--" + size : ""} ${
              modifier ? "avatar--" + modifier : ""
            }`}
          />
        )}
        <div
          className={`avatar avatar--category-${category} ${
            size ? "avatar--" + size : ""
          } ${modifier ? "avatar--" + modifier : ""} `}
        >
          {name[0]}
        </div>
      </div>
      <div className="avatar__group-user-text">{name}</div>
      <div className="avatar__group-user-actions">{action(id)}</div>
    </div>
  );
};

export default GroupAvatarUser;
