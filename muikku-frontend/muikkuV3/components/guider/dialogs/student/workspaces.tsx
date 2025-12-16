import Workspace from "./workspaces/workspace";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { WorkspaceDataType } from "~/reducers/workspaces";

import "~/sass/elements/application-list.scss";
import "~/sass/elements/empty.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CurrentStudentWorkspacesProps
 */
interface CurrentStudentWorkspacesProps extends WithTranslation<["common"]> {
  workspaces: WorkspaceDataType[];
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
    return this.props.workspaces && this.props.workspaces.length ? (
      <div className="application-list">
        {this.props.workspaces
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
        <span>
          {this.props.i18n.t("content.notInWorkspaces", {
            ns: "guider",
          })}
        </span>
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
    locale: state.locales.current,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(CurrentStudentWorkspaces)
);
