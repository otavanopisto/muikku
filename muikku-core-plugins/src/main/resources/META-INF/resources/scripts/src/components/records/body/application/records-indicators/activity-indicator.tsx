import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/workspaces";
import Dropdown from "~/components/general/dropdown";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  workspace: WorkspaceType;
  i18nOLD: i18nType;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are excercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { workspace, i18nOLD } = props;

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
              {i18nOLD.text.get(
                "plugin.records.workspace.activity.assignment.title",
                workspace.activity.evaluablesDonePercent
              )}
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
              {i18nOLD.text.get(
                "plugin.records.workspace.activity.exercise.title",
                workspace.activity.exercisesDonePercent
              )}
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(ActivityIndicator);
