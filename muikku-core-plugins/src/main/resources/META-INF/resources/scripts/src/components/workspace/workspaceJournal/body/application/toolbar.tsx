import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { ApplicationPanelToolbar } from "~/components/general/application-panel/application-panel";
import { WorkspaceType } from "~/reducers/workspaces";

/**
 * WorkspaceJournalsToolbarProps
 */
interface WorkspaceJournalsToolbarProps {
  i18n: i18nType;
  workspace: WorkspaceType;
}

/**
 * WorkspaceJournalsToolbarState
 */
interface WorkspaceJournalsToolbarState {
  searchquery: string;
}

/**
 * WorkspaceJournalsToolbar
 */
class WorkspaceJournalsToolbar extends React.Component<
  WorkspaceJournalsToolbarProps,
  WorkspaceJournalsToolbarState
> {
  /**
   * render
   */
  render() {
    return <ApplicationPanelToolbar />;
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
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
)(WorkspaceJournalsToolbar);
