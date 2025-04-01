import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";
import Dropdown from "~/components/general/dropdown";

/**
 * UserAvatarProps
 */
export interface UserAvatarProps {
  action?: (userId: number) => JSX.Element;
  hasImage: boolean;
  id: number | null;
  name: string;
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
  modifier?: string;
  showTooltip?: boolean;
  avatarAriaHidden?: boolean;
}

/**
 * UserAvatar
 * @param props props
 * @returns JSX.Element
 */
const UserAvatar = (props: UserAvatarProps) => {
  const {
    id,
    userCategory,
    hasImage,
    name,
    size,
    modifier,
    avatarAriaLabel,
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
      } ${modifier ? "avatar--" + modifier : ""} `}
    >
      {name[0]}
    </div>
  );

  return showTooltip ? (
    <Dropdown openByHover key="avatar" content={name}>
      {avatarContent}
    </Dropdown>
  ) : (
    avatarContent
  );
};

export default UserAvatar;
