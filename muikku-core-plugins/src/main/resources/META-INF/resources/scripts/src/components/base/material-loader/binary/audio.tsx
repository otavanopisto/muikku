import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";

export default function Audio(props: {
  material: MaterialContentNodeType,
  invisible?: boolean,
}) {
  return <div className="material-page__content material-page__content--binary-audio">
    <AudioPoolComponent
      invisible={props.invisible}
      className="material-page__audiofield-file"
      controls
      src={`/rest/materials/binary/${props.material.materialId}/content`}
      preload="none"
    />
  </div>
}
