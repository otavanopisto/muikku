import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { WorkspaceActivity } from "~/generated/client";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  credit: WorkspaceActivity;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are exercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { credit } = props;
  const { t } = useTranslation(["studies", "common"]);

  if (credit.exercisesTotal + credit.evaluablesTotal === 0) {
    return null;
  }

  return (
    <div className="activity-badge">
      {credit.evaluablesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.evaluablesDone", {
                ns: "studies",
                percent: Math.round(
                  (credit.evaluablesAnswered / credit.evaluablesTotal) * 100
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
                  (credit.exercisesAnswered / credit.exercisesTotal) * 100
                ),
              })}
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round(
                  (credit.evaluablesAnswered / credit.evaluablesTotal) * 100
                )
              }
            ></div>
          </div>
        </Dropdown>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
      {credit.exercisesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.exercisesDone", {
                ns: "studies",
                percent: Math.round(
                  (credit.exercisesAnswered / credit.exercisesTotal) * 100
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
                  (credit.exercisesAnswered / credit.exercisesTotal) * 100
                ),
              })}
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round(
                  (credit.exercisesAnswered / credit.exercisesTotal) * 100
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
