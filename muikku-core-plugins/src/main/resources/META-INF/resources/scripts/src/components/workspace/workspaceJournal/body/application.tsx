import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Toolbar from "./application/workspace-journals-toolbar";
import WorkspaceJournalsList from "./application/workspace-journals-list";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import { StateType } from "~/reducers";
import { WorkspaceType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { getName } from "~/util/modifiers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import NewJournal from "~/components/workspace/workspaceJournal/dialogs/new-edit-journal";
import { AnyActionType } from "~/actions";
import {
  LoadCurrentWorkspaceJournalsFromServerTriggerType,
  loadCurrentWorkspaceJournalsFromServer,
} from "~/actions/workspaces/journals";
import WorkspaceJournalView from "./application/workspace-journal-view";

/**
 * WorkspaceJournalApplicationProps
 */
interface WorkspaceJournalApplicationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside?: React.ReactElement<any>;
  i18n: i18nType;
  workspace: WorkspaceType;
  status: StatusType;
  loadCurrentWorkspaceJournalsFromServer: LoadCurrentWorkspaceJournalsFromServerTriggerType;
}

/**
 * WorkspaceJournalApplicationState
 */
interface WorkspaceJournalApplicationState {}

/**
 * WorkspaceJournalApplication
 */
class WorkspaceJournalApplication extends React.Component<
  WorkspaceJournalApplicationProps,
  WorkspaceJournalApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceJournalApplicationProps) {
    super(props);

    this.onWorkspaceJournalFilterChange =
      this.onWorkspaceJournalFilterChange.bind(this);
  }

  /**
   * onWorkspaceJournalFilterChange
   * @param e e
   */
  onWorkspaceJournalFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = parseInt(e.target.value) || null;
    this.props.loadCurrentWorkspaceJournalsFromServer(newValue);
  }

  /**
   * render
   */
  render() {
    const title = this.props.i18n.text.get(
      "plugin.workspace.journal.pageTitle"
    );
    const toolbar = <Toolbar />;
    let primaryOption;
    if (this.props.workspace) {
      primaryOption =
        !this.props.status.isStudent &&
        this.props.workspace.journals &&
        this.props.workspace.students ? (
          <div className="form-element form-element--main-action">
            <label htmlFor="selectJournal" className="visually-hidden">
              {this.props.i18n.text.get("plugin.wcag.journalSelect.label")}
            </label>
            <select
              id="selectJournal"
              className="form-element__select form-element__select--main-action"
              value={this.props.workspace.journals.userEntityId || ""}
              onChange={this.onWorkspaceJournalFilterChange}
            >
              <option value="">
                {this.props.i18n.text.get(
                  "plugin.workspace.journal.studentFilter.showAll"
                )}
              </option>
              {(this.props.workspace.students.results || [])
                .filter(
                  (student, index, array) =>
                    array.findIndex(
                      (otherStudent) =>
                        otherStudent.userEntityId === student.userEntityId
                    ) === index
                )
                .map((student) => (
                  <option
                    key={student.userEntityId}
                    value={student.userEntityId}
                  >
                    {getName(student, true)}
                  </option>
                ))}
            </select>
          </div>
        ) : (
          <NewJournal>
            <Button buttonModifiers="primary-function">
              {this.props.i18n.text.get(
                "plugin.workspace.journal.newEntryButton.label"
              )}
            </Button>
          </NewJournal>
        );
    }

    return (
      <>
        <ApplicationPanel
          asideBefore={this.props.aside}
          toolbar={toolbar}
          title={title}
          primaryOption={primaryOption}
        >
          <WorkspaceJournalView />
          <WorkspaceJournalsList />
        </ApplicationPanel>
        {this.props.status.isStudent ? (
          <NewJournal>
            <HoverButton icon="plus" modifier="new-message" />
          </NewJournal>
        ) : null}
      </>
    );
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { loadCurrentWorkspaceJournalsFromServer },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalApplication);
