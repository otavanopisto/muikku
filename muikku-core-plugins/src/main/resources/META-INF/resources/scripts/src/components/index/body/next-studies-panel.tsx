import * as React from "react";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { useNextCourseSuggestions } from "~/hooks/useNextCourseSuggestions";
import { Panel } from "~/components/general/panel";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import Button from "~/components/general/button";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";

/**
 * NextStudiesPanelProps
 */
interface NextStudiesPanelProps {
  i18n: i18nType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * NextStudiesPanel
 * @param props NextStudiesPanelProps
 * @returns JSX.Element
 */
const NextStudiesPanel: React.FC<NextStudiesPanelProps> = (props) => {
  const { nextSuggestions } = useNextCourseSuggestions(
    props.status.userSchoolDataIdentifier,
    props.status.userId,
    props.displayNotification
  );

  if (nextSuggestions.nextCourses.length === 0) {
    return null;
  }

  const suggestedWorkspaces = nextSuggestions.nextCourses.map((workspace) => (
    <div key={workspace.id}>
      <div className="item-list__item item-list__item--workspaces">
        <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
        <span className="item-list__text-body">
          {`${workspace.name} ${
            workspace.nameExtension ? "(" + workspace.nameExtension + ")" : ""
          }`}
        </span>
      </div>
      <div className="item-list__item-actions">
        <Button
          aria-label={
            props.i18n.text.get(
              "plugin.frontPage.suggestedWorkspaces.checkOut"
            ) + workspace.name
          }
          buttonModifiers={["primary-function-content", "frontpage-button"]}
          href={`/workspace/${workspace.urlName}`}
        >
          {props.i18n.text.get("plugin.frontPage.suggestedWorkspaces.checkOut")}
        </Button>
        <WorkspaceSignup
          workspaceSignUpDetails={{
            id: workspace.id,
            name: workspace.name,
            nameExtension: workspace.nameExtension,
            urlName: workspace.urlName,
          }}
        >
          <Button
            aria-label={
              props.i18n.text.get(
                "plugin.frontPage.suggestedWorkspaces.signUp"
              ) + workspace.name
            }
            buttonModifiers={["primary-function-content", "frontpage-button"]}
          >
            {props.i18n.text.get("plugin.frontPage.suggestedWorkspaces.signUp")}
          </Button>
        </WorkspaceSignup>
      </div>
    </div>
  ));

  return (
    <Panel
      header={props.i18n.text.get("plugin.frontPage.suggestedWorkspaces.title")}
      icon="icon-forward"
      modifier="continue-studies"
    >
      <div className="item-list item-list--panel-workspaces">
        {suggestedWorkspaces}
      </div>
    </Panel>
  );
};
/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * returns dispatch calls
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NextStudiesPanel);
