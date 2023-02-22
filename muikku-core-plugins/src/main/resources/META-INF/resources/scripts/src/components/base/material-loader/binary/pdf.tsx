import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";

/**
 * Pdf
 * @param props props
 * @param props.material material
 */
export default function Pdf(props: { material: MaterialContentNodeType }) {
  const { t } = useTranslation(["files", "common"]);

  return (
    <div className="material-page__content material-page__content--binary-pdf">
      <object
        type="application/pdf"
        data={`/rest/materials/binary/${props.material.materialId}/content`}
      >
        <Link
          className="link"
          href={`/rest/materials/binary/${props.material.materialId}/content`}
          openInNewTab={props.material.title}
        >
          {t("actions.download", { ns: "files" })}
        </Link>
      </object>
      <Link
        className="link link--download-pdf"
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {t("actions.download", { ns: "files" })}
      </Link>
    </div>
  );
}
