import Link from "../../general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceMaterialReferenceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import Panel from "~/components/general/panel";

import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";

interface ContinueStudiesPanelProps {
  i18n: i18nType;
  status: StatusType;
  lastWorkspace: WorkspaceMaterialReferenceType;
}

interface ContinueStudiesPanelState {}

class ContinueStudiesPanel extends React.Component<
  ContinueStudiesPanelProps,
  ContinueStudiesPanelState
> {
  render() {
    if (!this.props.status.loggedIn) {
      return null;
    } else if (!this.props.lastWorkspace) {
      return null;
    } else if (!this.props.status.isStudent) {
      return null;
    }
    return (
      <div className="panel panel--continue-studies">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--continue-studies icon-forward"></div>
          <h2 className="panel__header-title">
            {this.props.i18n.text.get("plugin.frontPage.latestWorkspace.title")}
          </h2>
        </div>
        <div className="panel__body">
          <div className="panel__body-title">
            {this.props.lastWorkspace.workspaceName}
          </div>
          <div className="panel__body-content panel__body-content--continue-studies">
            {this.props.i18n.text.get(
              "plugin.frontPage.latestWorkspace.material.part1"
            )}{" "}
            <span className="panel__body-highlight">
              {this.props.lastWorkspace.materialName}.
            </span>{" "}
            <Link className="link" href={this.props.lastWorkspace.url}>
              {this.props.i18n.text.get(
                "plugin.frontPage.latestWorkspace.continueStudiesLink"
              )}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.workspaces.lastWorkspace
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContinueStudiesPanel);
