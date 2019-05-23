import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

export default function Pdf(props: {
  material: MaterialContentNodeType,
  i18n: i18nType,
}) {
  return <div>
    <object type="application/pdf" data="file_with_actions.pdf">
      <Link href={`/rest/materials/binary/${this.props.material.materialId}/content`} openInNewTab={props.material.title}>
        {props.i18n.text.get("Donwnload")}
      </Link>
    </object>
  </div>;
}