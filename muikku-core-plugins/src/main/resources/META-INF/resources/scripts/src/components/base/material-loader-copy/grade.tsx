import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader-copy";

type MaterialLoaderGradeProps = MaterialLoaderProps;

/**
 * MaterialLoaderGrade
 * @param props props
 */
export function MaterialLoaderGrade(props: MaterialLoaderGradeProps) {
  const { t } = useTranslation(["materials", "workspace", "common"]);

  const grade =
    (props.material.evaluation && props.material.evaluation.grade) ||
    (props.compositeReplies &&
      props.compositeReplies.evaluationInfo &&
      props.compositeReplies.evaluationInfo.grade);

  const isIncomplete =
    props.compositeReplies && props.compositeReplies.state === "INCOMPLETE";

  if (isIncomplete) {
    return (
      <div className="material-page__assignment-assessment-grade">
        <span className="material-page__assignment-assessment-grade-data material-page__assignment-assessment-grade-data--incomplete">
          {" "}
          {t("labels.incomplete", { ns: "materials" })}
        </span>
      </div>
    );
  }

  if (!grade) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-grade">
      <span className="material-page__assignment-assessment-grade-label">
        {t("labels.grade", { ns: "workspace" })}:
      </span>
      <span className="material-page__assignment-assessment-grade-data">
        {" "}
        {grade}
      </span>
    </div>
  );
}
