import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  workspace: WorkspaceType;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are exercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { workspace } = props;

  const { t } = useTranslation(["studies", "common"]);

  if (!workspace.activity) {
    return null;
  } else if (
    workspace.activity.exercisesTotal + workspace.activity.evaluablesTotal ===
    0
  ) {
    return null;
  }

  return (
    <div className="activity-badge">
      {workspace.activity.evaluablesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.evaluablesDone", {
                ns: "studies",
                percent: workspace.activity.evaluablesDonePercent,
              })}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--assignment">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                workspace.activity.evaluablesDonePercent
              }
            ></div>
          </div>
        </Dropdown>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
      {workspace.activity.exercisesTotal ? (
        <Dropdown
          openByHover
          content={
            <span>
              {t("labels.exercisesDone", {
                ns: "studies",
                percent: workspace.activity.exercisesDonePercent,
              })}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--exercise">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                workspace.activity.exercisesDonePercent
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
