import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";

export default function Image(props: {
  material: MaterialContentNodeType
}) {
  return <img src={`/rest/materials/binary/${props.material.materialId}/content`} width="550" height="400"/>;
}