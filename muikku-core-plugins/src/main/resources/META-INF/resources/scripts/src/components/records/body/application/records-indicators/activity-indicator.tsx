import * as React from "react";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import Dropdown from "~/components/general/dropdown";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps {
  credit: RecordWorkspaceActivity;
  i18n: i18nType;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are exercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { credit, i18n } = props;

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
              {i18n.text.get(
                "plugin.records.workspace.activity.assignment.title",
                Math.round((credit.evaluablesAnswered / credit.evaluablesTotal) * 100)
              )}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--assignment">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round((credit.evaluablesAnswered / credit.evaluablesTotal) * 100)
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
              {i18n.text.get(
                "plugin.records.workspace.activity.exercise.title",
                Math.round((credit.exercisesAnswered / credit.exercisesTotal) * 100)
              )}
            </span>
          }
        >
          <div className="activity-badge__item activity-badge__item--exercise">
            <div
              className={
                "activity-badge__unit-bar activity-badge__unit-bar--" +
                Math.round((credit.exercisesAnswered / credit.exercisesTotal) * 100)
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
    i18n: state.i18n,
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
