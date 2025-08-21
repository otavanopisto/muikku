import * as React from "react";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import { RenderProps } from "../../types";

/**
 * Audio
 * @param props props
 * @param props.material material
 * @param props.invisible invisible
 */
export default function Audio(props: {
  material: RenderProps["material"];
  invisible?: boolean;
}) {
  return (
    <div className="material-page__content material-page__content--binary-audio rs_skip_always">
      <AudioPoolComponent
        invisible={props.invisible}
        className="material-page__audiofield-file"
        controls
        src={`/rest/materials/binary/${props.material.materialId}/content`}
        preload="metadata"
      />
    </div>
  );
}
