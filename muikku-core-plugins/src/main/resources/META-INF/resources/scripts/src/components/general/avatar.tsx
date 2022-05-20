import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

/**
 * AvatarProps
 */
interface AvatarProps {
  hasImage: boolean;
  id: number;
  firstName: string;
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const Avatar = (props: AvatarProps) => {
  const { id, userCategory, hasImage, firstName, avatarAriaLabel } = props;

  const category =
    (userCategory && userCategory) ||
    (id && (id > 10 ? (id % 10) + 1 : id)) ||
    // This is a nullcheck. Makes the avatar readable (and colourfull!) if the id is "null"
    Math.floor(Math.random() * 10 + 1);

  return hasImage ? (
    <object
      className={`avatar-container ${
        props.size ? "avatar-container--" + props.size : ""
      }`}
      data={getUserImageUrl(id)}
      type="image/jpeg"
      aria-label={avatarAriaLabel}
    >
      <div
        className={`avatar avatar--category-${category}${
          props.size ? "avatar--" + props.size : ""
        }`}
      >
        {firstName[0]}
      </div>
    </object>
  ) : (
    <div
      className={`avatar-container ${
        props.size ? "avatar-container--" + props.size : ""
      }`}
    >
      <div
        className={`avatar avatar--category-${category} ${
          props.size ? "avatar--" + props.size : ""
        }`}
      >
        {firstName[0]}
      </div>
    </div>
  );
};

export default Avatar;
