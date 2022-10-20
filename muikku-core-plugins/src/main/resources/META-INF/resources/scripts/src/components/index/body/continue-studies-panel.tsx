import Link from "../../general/link";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceMaterialReferenceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import "~/sass/elements/item-list.scss";

/**
 * ContinueStudiesPanelProps
 */
interface ContinueStudiesPanelProps {
  i18n: i18nType;
  status: StatusType;
  lastWorkspace: WorkspaceMaterialReferenceType;
}

/**
 * ContinueStudiesPanelState
 */
interface ContinueStudiesPanelState {}

/**
 * ContinueStudiesPanel
 */
class ContinueStudiesPanel extends React.Component<
  ContinueStudiesPanelProps,
  ContinueStudiesPanelState
> {
  /**
   * render
   */
  render() {
    if (!this.props.status.loggedIn) {
      return null;
    } else if (!this.props.lastWorkspace) {
      return null;
    } else if (!this.props.status.isStudent) {
      return null;
    }
    return (
      <Panel
        header={this.props.i18n.text.get(
          "plugin.frontPage.latestWorkspace.title"
        )}
        modifier="continue-studies"
        icon="icon-forward"
      >
        <Panel.BodyTitle>
          {this.props.lastWorkspace.workspaceName}
        </Panel.BodyTitle>
        <Panel.BodyContent>
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
        </Panel.BodyContent>
      </Panel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.workspaces.lastWorkspace,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContinueStudiesPanel);
