import Workspace from "../workspaces/workspace";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";

import "~/sass/elements/application-list.scss";
import "~/sass/elements/empty.scss";

/**
 * CurrentStudentWorkspacesProps
 */
interface CurrentStudentWorkspacesProps {
  i18n: i18nType;
  guider: GuiderType;
  locale: string;
}

/**
 * CurrentStudentWorkspacesState
 */
interface CurrentStudentWorkspacesState {}

/**
 * CurrentStudentWorkspaces
 */
class CurrentStudentWorkspaces extends React.Component<
  CurrentStudentWorkspacesProps,
  CurrentStudentWorkspacesState
> {
  /**
   * render
   */
  render() {
    return this.props.guider.currentStudent.currentWorkspaces ? (
      this.props.guider.currentStudent.currentWorkspaces.length ? (
        <div className="application-list">
          {this.props.guider.currentStudent.currentWorkspaces
            .sort((a, b) =>
              ("" + a.name).localeCompare(b.name, this.props.locale, {
                sensitivity: "base",
              })
            )
            .map((workspace) => (
              <Workspace workspace={workspace} key={workspace.id} />
            ))}
        </div>
      ) : (
        <div className="empty">
          <span>{this.props.i18n.text.get("plugin.guider.noWorkspaces")}</span>
        </div>
      )
    ) : null;
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
    locale: state.locales.current,
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
)(CurrentStudentWorkspaces);
