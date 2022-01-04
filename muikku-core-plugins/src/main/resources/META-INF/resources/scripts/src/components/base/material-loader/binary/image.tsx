import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Zoom from "~/components/general/zoom";

export default function Image(props: { material: MaterialContentNodeType }) {
  return (
    <div className="material-page__content material-page__content--binary-image">
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
