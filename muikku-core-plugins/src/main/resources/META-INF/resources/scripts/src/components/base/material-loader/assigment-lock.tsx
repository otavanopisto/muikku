import * as React from "react";
import { useTranslation } from "react-i18next";
import { MaterialLoaderProps } from "~/components/base/material-loader";

/**
 * MaterialLoaderAssignmentLockProps
 */
interface MaterialLoaderAssignmentLockProps extends MaterialLoaderProps {}

/**
 * MaterialLoaderAssessmentLock
 * @param props props
 */
export function MaterialLoaderAssignmentLock(
  props: MaterialLoaderAssignmentLockProps
) {
  const { t } = useTranslation(["materials"]);

  // if assignment is not evaluated or not locked, return null
  if (
    props.material.assignmentType !== "EVALUATED" ||
    !props.compositeReplies ||
    !props.compositeReplies.locked
  ) {
    return null;
  }

  return (
    <div className={`material-page__assignment-assessment rs_skip_always`}>
      <div
        className={`material-page__assignment-assessment-icon icon-lock`}
      ></div>
      <div className="material-page__assignment-assessment-text">
        Opettaja on lukinnut tehtävän arvioinnin ajaksi. Odota kunnes arviointi
        on valmis.
      </div>
    </div>
  );
}
