import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import { MaterialContentNode } from "~/generated/client";

/**
 * Audio
 * @param props props
 * @param props.material material
 * @param props.invisible invisible
 */
export default function Audio(props: {
  material: MaterialContentNode;
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
