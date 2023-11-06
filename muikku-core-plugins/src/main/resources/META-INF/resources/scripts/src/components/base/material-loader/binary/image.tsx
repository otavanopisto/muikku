import * as React from "react";
import Zoom from "~/components/general/zoom";
import { MaterialContentNode } from "~/generated/client";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * Image
 * @param props props
 * @param props.material material
 */
export default function Image(props: {
  material: MaterialContentNodeWithIdAndLogic;
}) {
  return (
    <div className="material-page__content material-page__content--binary-image rs_skip_always">
      <Zoom
        imgsrc={`/rest/materials/binary/${props.material.materialId}/content`}
      >
        <img
          src={`/rest/materials/binary/${props.material.materialId}/content`}
          className="zoom-image"
        />
      </Zoom>
    </div>
  );
}
