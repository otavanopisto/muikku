import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

export default function Pdf(props: {
  material: MaterialContentNodeType;
  i18n: i18nType;
}) {
  return (
    <div className="material-page__content material-page__content--binary-pdf">
      <object
        type="application/pdf"
        data={`/rest/materials/binary/${props.material.materialId}/content`}
      >
        <Link
          href={`/rest/materials/binary/${props.material.materialId}/content`}
          openInNewTab={props.material.title}
        >
          {props.i18n.text.get("plugin.workspace.materials.binaryDownload")}
        </Link>
      </object>
    </div>
  );
}
