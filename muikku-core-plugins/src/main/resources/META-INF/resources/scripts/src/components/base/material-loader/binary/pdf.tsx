import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import { MaterialContentNode } from "~/generated/client";

/**
 * Pdf
 * @param props props
 * @param props.material material
 * @param props.i18n i18n
 */
export default function Pdf(props: {
  material: MaterialContentNode;
  i18n: i18nType;
}) {
  return (
    <div className="material-page__content material-page__content--binary-pdf rs_skip_always">
      <object
        type="application/pdf"
        data={`/rest/materials/binary/${props.material.materialId}/content`}
      >
        <Link
          className="link"
          href={`/rest/materials/binary/${props.material.materialId}/content`}
          openInNewTab={props.material.title}
        >
          {props.i18n.text.get("plugin.workspace.materials.binaryDownload")}
        </Link>
      </object>
      <Link
        className="link link--download-pdf"
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {props.i18n.text.get("plugin.workspace.materials.binaryDownload")}
      </Link>
    </div>
  );
}
