import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";

/**
 * Any
 * @param props props
 * @param props.material material
 */
export default function Any(props: { material: MaterialContentNodeType }) {
  const { t } = useTranslation(["files", "common"]);

  return (
    <div>
      <Link
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {t("actions.download_file", { ns: "files" })}
      </Link>
    </div>
  );
}
