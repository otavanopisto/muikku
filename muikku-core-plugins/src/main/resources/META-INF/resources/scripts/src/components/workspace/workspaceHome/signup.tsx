import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import Button from "~/components/general/button";
import "~/sass/elements/panel.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * SignUpPanelProps
 */
interface SignUpPanelProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
}

/**
 * SignUpPanelState
 */
interface SignUpPanelState {}

/**
 * SignUpPanel
 */
class SignUpPanel extends React.Component<SignUpPanelProps, SignUpPanelState> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (this.props.status.loggedIn) {
      return null;
    }
    return (
      <div className="panel panel--workspace-signup">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspace-signup icon-sign-in"></div>
          <div className="panel__header-title">
            {t("labels.guidance", { ns: "materials" })}
          </div>
        </div>
        <div className="panel__body">
          <div className="panel__body-content panel__body-content--signup">
            {t("content.logInGuidingInformation", { ns: "workspace" })}
          </div>
          <div className="panel__body-footer">
            <Button buttonModifiers="signup-read-more" href="/">
              {t("actions.readMore", { ns: "workspace" })}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["workspace", "materials", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(SignUpPanel)
);
