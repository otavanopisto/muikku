import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";

/**
 * Flash
 * @param props props
 * @param props.material material
 */
export default function Flash(props: { material: MaterialContentNodeType }) {
  return (
    <object
      type="application/x-shockwave-flash"
      data={`/rest/materials/binary/${props.material.materialId}/content`}
      width="550"
      height="400"
    >
      <param
        name="movie"
        value={`/rest/materials/binary/${props.material.materialId}/content`}
      />
      <embed
        src={`/rest/materials/binary/${props.material.materialId}/content`}
        width="550"
        height="400"
      />
    </object>
  );
}
