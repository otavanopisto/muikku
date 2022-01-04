import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

interface AvatarProps {
  hasImage: boolean;
  id: number;
  firstName: string;
  size?: string;
  userCategory?: number;
  avatarAriaLabel?: string;
}

const Avatar = (props: AvatarProps) => {
  const { id, userCategory, hasImage, firstName, avatarAriaLabel } = props;

  const category =
    (userCategory && userCategory) || id > 10 ? (id % 10) + 1 : id;

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
