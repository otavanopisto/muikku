import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { StudyActivityItem } from "~/generated/client";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  studyActivityItem: StudyActivityItem;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are exercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { studyActivityItem } = props;
  const { t } = useTranslation(["studies", "common"]);

  if (
    studyActivityItem.exercisesTotal + studyActivityItem.evaluablesTotal ===
    0
  ) {
    return null;
  }

  return (
    <div className="activity-badge">
      {studyActivityItem.evaluablesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.evaluablesDone", {
                ns: "studies",
                percent: Math.round(
                  (studyActivityItem.evaluablesDone /
                    studyActivityItem.evaluablesTotal) *
                    100
                ),
              })}
            </span>
          }
        >
          <div
            tabIndex={0}
            className="activity-badge__item activity-badge__item--assignment"
          >
            <div
              aria-label={t("wcag.assignmentsActivity", {
                ns: "studies",
                percent: Math.round(
                  (studyActivityItem.exercisesDone /
                    studyActivityItem.exercisesTotal) *
                    100
                ),
              })}
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round(
                  (studyActivityItem.evaluablesDone /
                    studyActivityItem.evaluablesTotal) *
                    100
                )
              }
            ></div>
          </div>
        </Dropdown>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
      {studyActivityItem.exercisesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.exercisesDone", {
                ns: "studies",
                percent: Math.round(
                  (studyActivityItem.exercisesDone /
                    studyActivityItem.exercisesTotal) *
                    100
                ),
              })}
            </span>
          }
        >
          <div
            tabIndex={0}
            className="activity-badge__item activity-badge__item--exercise"
          >
            <div
              aria-label={t("wcag.exercisesActivity", {
                ns: "studies",
                percent: Math.round(
                  (studyActivityItem.exercisesDone /
                    studyActivityItem.exercisesTotal) *
                    100
                ),
              })}
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round(
                  (studyActivityItem.exercisesDone /
                    studyActivityItem.exercisesTotal) *
                    100
                )
              }
            ></div>
          </div>
        </Dropdown>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
    </div>
  );
};

export default ActivityIndicator;
