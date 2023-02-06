import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Toolbar from "./application/workspace-journals-toolbar";
import WorkspaceJournalsList from "./application/workspace-journals-list";
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
import { JournalsState } from "~/reducers/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceJournalApplicationProps
 */
interface WorkspaceJournalApplicationProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside?: React.ReactElement<any>;
  workspace: WorkspaceType;
  journalsState: JournalsState;
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
    const { t } = this.props;

    const title = t("labels.journal", { ns: "journal" });
    const toolbar = <Toolbar />;
    let primaryOption;
    if (this.props.workspace) {
      primaryOption =
        !this.props.status.isStudent &&
        this.props.journalsState &&
        this.props.workspace.students ? (
          <div className="form-element form-element--main-action">
            <label htmlFor="selectJournal" className="visually-hidden">
              {t("wcag.journalSelect", { ns: "workspace" })}
            </label>
            <select
              id="selectJournal"
              className="form-element__select form-element__select--main-action"
              value={this.props.journalsState.userEntityId || ""}
              onChange={this.onWorkspaceJournalFilterChange}
            >
              <option value="">{t("actions.showAll")}</option>
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
              {t("actions.create_journal", { ns: "workspace" })}
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
    workspace: state.workspaces.currentWorkspace,
    journalsState: state.journals,
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

export default withTranslation(["journal", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceJournalApplication)
);
