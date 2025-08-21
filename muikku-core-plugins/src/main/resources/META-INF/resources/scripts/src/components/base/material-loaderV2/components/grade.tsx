import * as React from "react";
import { useTranslation } from "react-i18next";
//import { MaterialLoaderProps } from "~/components/base/material-loader";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderGradeProps
 */
interface MaterialLoaderGradeProps extends RenderProps, RenderState {}

/**
 * MaterialLoaderGrade
 * @param props props
 */
export function MaterialLoaderGrade(props: MaterialLoaderGradeProps) {
  const { material, compositeReply } = props;

  const { t } = useTranslation(["materials", "workspace", "common"]);

  const grade =
    (material.evaluation && material.evaluation.grade) ||
    (compositeReply &&
      compositeReply.evaluationInfo &&
      compositeReply.evaluationInfo.grade);

  const isIncomplete = compositeReply && compositeReply.state === "INCOMPLETE";

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
