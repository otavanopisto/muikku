import * as React from "react";
import { getUserImageUrl } from "~/util/modifiers";

interface AvatarProps {
  hasImage: boolean,
  id: number,
  firstName: string
}

export default function Avatar(props: AvatarProps){
  let userCategory = props.id > 10 ? props.id % 10 + 1 : props.id;
  return props.hasImage ? <object className="avatar-container"
    data={getUserImageUrl(props.id)}
    type="image/jpeg">
     <div className={`avatar avatar--category-${userCategory}`}>{props.firstName[0]}</div>
  </object> : <div className="avatar-container">
     <div className={`avatar avatar--category-${userCategory}`}>{props.firstName[0]}</div>
  </div>
}