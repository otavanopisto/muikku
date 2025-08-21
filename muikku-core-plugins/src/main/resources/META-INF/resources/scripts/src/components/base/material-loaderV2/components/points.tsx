import * as React from "react";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { RenderProps, RenderState } from "../types";

/**
 * MaterialLoaderPointsProps
 */
interface MaterialLoaderPointsProps extends RenderProps, RenderState {}

/**
 * MaterialLoaderPoints
 * Component for displaying points of an assignment in MaterialLoader
 * @param props props
 */
export function MaterialLoaderPoints(props: MaterialLoaderPointsProps) {
  const { compositeReply, material } = props;

  const { t } = useTranslation(["workspace"]);

  // If evaluation is not for points, return null
  if (
    compositeReply &&
    compositeReply.evaluationInfo.evaluationType !== "POINTS"
  ) {
    return null;
  }

  // Points from evaluationInfo
  const points =
    compositeReply &&
    compositeReply.evaluationInfo &&
    compositeReply.evaluationInfo.points;

  // maxPoints is either from material or from assignment depending on use case
  // in the future hopefully we can use only one source of truth for points
  const maxPoints =
    (material && material.maxPoints) ||
    (material && material.assignment && material.assignment.maxPoints);

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
          ? `${localize.number(points)} / ${localize.number(maxPoints)}`
          : localize.number(points)}
      </span>
    </div>
  );
}
