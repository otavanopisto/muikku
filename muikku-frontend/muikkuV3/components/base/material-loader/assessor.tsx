import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";

type MaterialLoaderAssessorProps = MaterialLoaderProps;

/**
 * MaterialLoaderAssessor
 * @param props props
 */
export function MaterialLoaderAssessor(props: MaterialLoaderAssessorProps) {
  const { t } = useTranslation(["materials", "common"]);

  const assessor =
    (props.material.evaluation && props.material.evaluation.evaluated) ||
    (props.compositeReplies &&
      props.compositeReplies.evaluationInfo &&
      props.compositeReplies.evaluationInfo.assessorName);

  if (!assessor) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-assessor">
      <span className="material-page__assignment-assessment-assessor-label">
        {t("labels.assessor")}:
      </span>
      <span className="material-page__assignment-assessment-assessor-data">
        {assessor}
      </span>
    </div>
  );
}
