import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

/**
 * AvatarProps
 */
interface AvatarProps {
  hasImage: boolean;
  id: number | null;
  firstName: string;
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
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

  return hasImage ? (
    <div
      className={`avatar-container ${
        props.size ? "avatar-container--" + size : ""
      } rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      <img
        src={getUserImageUrl(id)}
        alt=""
        aria-label={avatarAriaLabel}
        className={`avatar avatar-img ${size ? "avatar--" + size : ""}`}
      />
      <div
        className={`avatar avatar--category-${category} ${
          size ? "avatar--" + size : ""
        }`}
      >
        {firstName[0]}
      </div>
    </div>
  ) : (
    <div
      className={`avatar-container ${
        size ? "avatar-container--" + size : ""
      } rs_skip_always`}
      aria-hidden={avatarAriaHidden}
    >
      <div
        className={`avatar avatar--category-${category} ${
          size ? "avatar--" + size : ""
        }`}
      >
        {firstName[0]}
      </div>
    </div>
  );
};

export default Avatar;
