import { MaterialContentNodeType } from "~/reducers/workspaces";
import * as React from "react";
import Link from "~/components/general/link";
import { MaterialContentNode } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * Any
 * @param props props
 * @param props.material material
 */
export default function Any(props: { material: MaterialContentNode }) {
  const { t } = useTranslation(["files", "common"]);

  return (
    <div className="rs_skip_always">
      <Link
        href={`/rest/materials/binary/${props.material.materialId}/content`}
        openInNewTab={props.material.title}
      >
        {t("actions.download", { ns: "files" })}
      </Link>
    </div>
  );
}
