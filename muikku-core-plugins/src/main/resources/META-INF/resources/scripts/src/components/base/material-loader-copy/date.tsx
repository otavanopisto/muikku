import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader-copy";
import { localize } from "~/locales/i18n";

type MaterialLoaderDateProps = MaterialLoaderProps;

/**
 * MaterialLoaderDate
 * @param props props
 */
export function MaterialLoaderDate(props: MaterialLoaderDateProps) {
  const { t } = useTranslation(["materials", "common"]);

  const date =
    (props.material.evaluation && props.material.evaluation.evaluated) ||
    (props.compositeReplies &&
      props.compositeReplies.evaluationInfo &&
      props.compositeReplies.evaluationInfo.date);

  if (!date) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-date">
      <span className="material-page__assignment-assessment-date-label">
        {t("labels.date")}:
      </span>
      <span className="material-page__assignment-assessment-date-data">
        {localize.date(date)}
      </span>
    </div>
  );
}
