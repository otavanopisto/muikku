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
}

/**
 * Avatar
 * @param props props
 * @returns JSX.Element
 */
const Avatar = (props: AvatarProps) => {
  const { id, userCategory, hasImage, firstName, avatarAriaLabel } = props;

  const category = React.useMemo(() => {
    if (userCategory) return userCategory;
    if (id) {
      return id > 10 ? (id % 10) + 1 : id;
    }
    // This is a nullcheck. Makes the avatar readable (and colourful!) if the id is "null"
    return Math.floor(Math.random() * 10 + 1);
  }, [id, userCategory]);

  return hasImage ? (
    <object
      className={`avatar-container ${
        props.size ? "avatar-container--" + props.size : ""
      } rs_skip_always`}
      data={getUserImageUrl(id)}
      type="image/jpeg"
      aria-label={avatarAriaLabel}
    >
      <div
        className={`avatar avatar--category-${category} ${
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
      } rs_skip_always`}
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
