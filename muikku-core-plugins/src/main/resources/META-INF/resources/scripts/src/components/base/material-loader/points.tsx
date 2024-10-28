import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import { localize } from "~/locales/i18n";

type MaterialLoaderPointsProps = MaterialLoaderProps;

/**
 * MaterialLoaderPoints
 * Component for displaying points of an assignment in MaterialLoader
 * @param props props
 */
export function MaterialLoaderPoints(props: MaterialLoaderPointsProps) {
  const { t } = useTranslation(["workspace"]);

  // If evaluation is not for points, return null
  if (
    props.compositeReplies &&
    props.compositeReplies.evaluationInfo.evaluationType !== "POINTS"
  ) {
    return null;
  }

  // Points from evaluationInfo
  const points =
    props.compositeReplies &&
    props.compositeReplies.evaluationInfo &&
    props.compositeReplies.evaluationInfo.points;

  // maxPoints is either from material or from assignment depending on use case
  // in the future hopefully we can use only one source of truth for points
  const maxPoints =
    (props.material && props.material.maxPoints) ||
    (props.material &&
      props.material.assignment &&
      props.material.assignment.maxPoints);

  // If there are no points, return null
  if (!points) {
    return null;
  }

  return (
    <div className="material-page__assignment-assessment-points">
      <span className="material-page__assignment-assessment-points-label">
        {t("labels.points", { ns: "workspace" })}:
      </span>
      <span className="material-page__assignment-assessment-points-data">
        {" "}
        {maxPoints
          ? `${localize.number(points)}/${localize.number(maxPoints)}`
          : localize.number(points)}
      </span>
    </div>
  );
}
