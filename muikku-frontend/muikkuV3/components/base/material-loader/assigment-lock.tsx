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

  if (
    props.compositeReplies &&
    props.compositeReplies.lock === "HARD" &&
    props.material.assignmentType === "EVALUATED"
  ) {
    return (
      <div className={`material-page__assignment-locked rs_skip_always`}>
        <div
          className={`material-page__assignment-locked-icon icon-lock`}
        ></div>
        <div className="material-page__assignment-locked-text">
          {t("content.assignmentLocked", { ns: "materials" })}
        </div>
      </div>
    );
  }

  return null;
}
