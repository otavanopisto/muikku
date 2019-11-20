import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";

export default function Image(props: {
  material: MaterialContentNodeType
}) {
  return <div className="material-page__content material-page__content--binary-image">
    <img src={`/rest/materials/binary/${props.material.materialId}/content`}/>
  </div>;
}