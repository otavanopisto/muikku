import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  credit: RecordWorkspaceActivity;
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
                percent:
                  (credit.evaluablesAnswered / credit.evaluablesTotal) * 100,
              })}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--assignment">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                (credit.evaluablesAnswered / credit.evaluablesTotal) * 100
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
                percent:
                  (credit.exercisesAnswered / credit.exercisesTotal) * 100,
              })}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--exercise">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                (credit.exercisesAnswered / credit.exercisesTotal) * 100
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
