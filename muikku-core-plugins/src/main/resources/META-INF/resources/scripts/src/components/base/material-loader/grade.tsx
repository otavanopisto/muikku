import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";

type MaterialLoaderGradeProps = MaterialLoaderProps;

export function MaterialLoaderGrade(props: MaterialLoaderGradeProps) {
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
          {props.i18n.text.get(
            "plugin.workspace.materialsLoader.evaluation.grade.incomplete"
          )}
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
        {props.i18n.text.get(
          "plugin.workspace.materialsLoader.evaluation.grade.label"
        )}
        :
      </span>
      <span className="material-page__assignment-assessment-grade-data">
        {" "}
        {grade}
      </span>
    </div>
  );
}
