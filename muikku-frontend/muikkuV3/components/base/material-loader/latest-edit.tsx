import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderRenderProps } from "~/components/base/material-loader";
import { localize } from "~/locales/i18n";

type MaterialLoaderLatestEditProps = MaterialLoaderRenderProps;

/**
 * MaterialLoaderLatestEdit
 * @param props props
 */
export function MaterialLoaderLatestEdit(props: MaterialLoaderLatestEditProps) {
  const { t } = useTranslation(["materials", "common"]);

  if (!props.material.editor || !props.material.edited) {
    return null;
  }

  return (
    <div className="material-page__metadata-container material-page__latest-edit-container rs_skip">
      <div className="material-page__latest-edit">
        <div className="material-page__latest-edit-label">
          {t("labels.latestEdit", { ns: "materials" })}:
        </div>
        <span>
          {localize.date(props.material.edited)}, {props.material.editor}
        </span>
      </div>
    </div>
  );
}
