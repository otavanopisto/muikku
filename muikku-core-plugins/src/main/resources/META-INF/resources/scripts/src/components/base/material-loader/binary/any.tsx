import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * Any
 * @param props props
 * @param props.material material
 * @param props.i18nOLD i18nOLD
 */
export default function Any(props: {
  material: MaterialContentNodeType;
  i18nOLD: i18nType;
}) {
  return (
    <div>
      <Link
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {props.i18nOLD.text.get("plugin.workspace.materials.binaryDownload")}
      </Link>
    </div>
  );
}
