import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

interface AvatarProps {
  hasImage: boolean;
  id: number;
  firstName: string;
  userCategory?: number;
  avatarAriaLabel?: string;
}

const Avatar = (props: AvatarProps) => {
  const { id, userCategory, hasImage, firstName, avatarAriaLabel } = props;

  const category =
    (userCategory && userCategory) || id > 10 ? (id % 10) + 1 : id;

  return hasImage ? (
    <object
      className="avatar-container"
      data={getUserImageUrl(id)}
      type="image/jpeg"
      aria-label={avatarAriaLabel}
    >
      <div className={`avatar avatar--category-${category}`}>
        {firstName[0]}
      </div>
    </object>
  ) : (
    <div className="avatar-container">
      <div className={`avatar avatar--category-${category}`}>
        {firstName[0]}
      </div>
    </div>
  );
};

export default Avatar;
