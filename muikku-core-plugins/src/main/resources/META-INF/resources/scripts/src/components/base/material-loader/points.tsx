import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";

type MaterialLoaderPointsProps = MaterialLoaderProps;

/**
 * MaterialLoaderPoints
 * Component for displaying points of an assignment in MaterialLoader
 * @param props props
 */
export function MaterialLoaderPoints(props: MaterialLoaderPointsProps) {
  const { t } = useTranslation(["materials", "workspace", "common"]);

  const points =
    props.compositeReplies &&
    props.compositeReplies.evaluationInfo &&
    props.compositeReplies.evaluationInfo.points;

  const maxPoints = props.material && props.material.maxPoints;

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
        {maxPoints ? `${points}/${maxPoints}` : points}
      </span>
    </div>
  );
}
