import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import {
  SetCurrentJournalTriggerType,
  setCurrentJournal,
} from "../../../../../actions/workspaces/journals";
import { WorkspaceJournalType } from "~/reducers/workspaces";

/**
 * WorkspaceJournalsToolbarProps
 */
interface WorkspaceJournalsToolbarProps {
  currentJournal: WorkspaceJournalType;
  setCurrentJournal: SetCurrentJournalTriggerType;
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
   * handleCloseCurrentJournal
   */
  handleCloseCurrentJournal = () => {
    this.props.setCurrentJournal({ currentJournal: undefined });
  };

  /**
   * render
   */
  render() {
    return (
      <ApplicationPanelToolbar>
        {this.props.currentJournal && (
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill
              buttonModifiers="go-back"
              icon="back"
              onClick={this.handleCloseCurrentJournal}
            />
          </ApplicationPanelToolbarActionsMain>
        )}
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    currentJournal:
      state.workspaces &&
      state.workspaces.currentWorkspace &&
      state.workspaces.currentWorkspace.journals &&
      state.workspaces.currentWorkspace.journals.currentJournal,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ setCurrentJournal }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalsToolbar);
