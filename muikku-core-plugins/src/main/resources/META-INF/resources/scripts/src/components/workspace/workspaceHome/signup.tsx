import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import Button from "~/components/general/button";

import "~/sass/elements/panel.scss";

interface SignUpPanelProps {
  status: StatusType;
  workspace: WorkspaceType;
  i18n: i18nType;
}

interface SignUpPanelState {}

class SignUpPanel extends React.Component<SignUpPanelProps, SignUpPanelState> {
  render() {
    if (this.props.status.loggedIn) {
      return null;
    }
    return (
      <div className="panel panel--workspace-signup">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspace-signup icon-sign-in"></div>
          <div className="panel__header-title">
            {this.props.i18n.text.get("plugin.workspace.logInGuidingTitle")}
          </div>
        </div>
        <div className="panel__body">
          <div className="panel__body-content panel__body-content--signup">
            {this.props.i18n.text.get(
              "plugin.workspace.logInGuidingInformation"
            )}
          </div>
          <div className="panel__body-footer">
            <Button buttonModifiers="signup-read-more" href="/">
              {this.props.i18n.text.get("plugin.workspace.logInGuidingLink")}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPanel);
