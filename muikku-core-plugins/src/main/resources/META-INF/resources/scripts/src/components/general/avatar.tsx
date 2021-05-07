import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";
import "~/sass/elements/avatar.scss";

interface AvatarProps {
  hasImage: boolean;
  id: number;
  firstName: string;
  size?: string;
}

export default function Avatar(props: AvatarProps) {
  let userCategory = props.id > 10 ? (props.id % 10) + 1 : props.id;
  return props.hasImage ? (
    <object
      className={`avatar-container ${
        props.size ? "avatar-container--" + props.size : ""
      }`}
      data={getUserImageUrl(props.id)}
      type="image/jpeg"
    >
      <div
        className={`avatar avatar--category-${userCategory} ${
          props.size ? "avatar--" + props.size : ""
        }`}
      >
        {props.firstName[0]}
      </div>
    </object>
  ) : (
    <div
      className={`avatar-container ${
        props.size ? "avatar-container--" + props.size : ""
      }`}
    >
      <div
        className={`avatar avatar--category-${userCategory} ${
          props.size ? "avatar--" + props.size : ""
        }`}
      >
        {props.firstName[0]}
      </div>
    </div>
  );
}
