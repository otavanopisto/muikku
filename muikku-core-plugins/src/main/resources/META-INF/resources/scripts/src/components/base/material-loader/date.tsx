import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";

type MaterialLoaderDateProps = MaterialLoaderProps;

/**
 * MaterialLoaderDate
 * @param props props
 */
export function MaterialLoaderDate(props: MaterialLoaderDateProps) {
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
        {props.i18n.text.get(
          "plugin.workspace.materialsLoader.evaluation.date.label"
        )}
        :
      </span>
      <span className="material-page__assignment-assessment-date-data">
        {props.i18n.time.format(date)}
      </span>
    </div>
  );
}
