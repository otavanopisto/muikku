import * as React from "react";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * Any
 * @param props props
 * @param props.material material
 */
export default function Any(props: {
  material: MaterialContentNodeWithIdAndLogic;
}) {
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
