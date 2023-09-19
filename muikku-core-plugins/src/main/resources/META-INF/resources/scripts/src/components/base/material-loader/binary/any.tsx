import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNode } from "~/generated/client";

/**
 * Any
 * @param props props
 * @param props.material material
 * @param props.i18n i18n
 */
export default function Any(props: {
  material: MaterialContentNode;
  i18n: i18nType;
}) {
  return (
    <div className="rs_skip_always">
      <Link
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {props.i18n.text.get("plugin.workspace.materials.binaryDownload")}
      </Link>
    </div>
  );
}
