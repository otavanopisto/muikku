import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Toolbar from "./application/workspace-journals-toolbar";
import WorkspaceJournalsList from "./application/workspace-journals-list";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/react-select-override.scss";
import { StateType } from "~/reducers";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { getName } from "~/util/modifiers";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import NewJournal from "~/components/workspace/workspaceJournal/dialogs/new-edit-journal";
import { AnyActionType } from "~/actions";
import {
  LoadCurrentWorkspaceJournalsFromServerTriggerType,
  loadCurrentWorkspaceJournalsFromServer,
} from "~/actions/workspaces/journals";
import WorkspaceJournalView from "./application/workspace-journal-view";
import { JournalsState } from "~/reducers/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";
import { OptionDefault } from "~/components/general/react-select/types";
import Select from "react-select";
import WorkspaceJournalFeedback from "./application/workspace-journal-feedback";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";

type JournalStudentFilterOption = OptionDefault<WorkspaceStudent | string>;

/**
 * WorkspaceJournalApplicationProps
 */
interface WorkspaceJournalApplicationProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside?: React.ReactElement<any>;
  workspace: WorkspaceDataType;
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

    this.handleWorkspaceJournalFilterChange =
      this.handleWorkspaceJournalFilterChange.bind(this);
  }

  /**
   * Handles workspace journal filter change
   * @param selectedOption selectedOption which can be either a string or a WorkspaceStudent
   */
  handleWorkspaceJournalFilterChange(
    selectedOption: JournalStudentFilterOption
  ) {
    const newValue =
      typeof selectedOption.value === "string"
        ? null
        : selectedOption.value.userEntityId;
    this.props.loadCurrentWorkspaceJournalsFromServer(newValue);
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const title = t("labels.journal", { ns: "journal" });
    const toolbar = <Toolbar />;

    let primaryOption = (
      <NewJournal>
        <Button buttonModifiers="primary-function">
          {t("actions.create", { ns: "workspace", context: "journal" })}{" "}
        </Button>
      </NewJournal>
    );

    if (
      this.props.workspace &&
      !this.props.status.isStudent &&
      this.props.journalsState &&
      this.props.workspace.students
    ) {
      const studentFilterOptions = (this.props.workspace.students.results || [])
        .filter(
          (student, index, array) =>
            array.findIndex(
              (otherStudent) =>
                otherStudent.userEntityId === student.userEntityId
            ) === index
        )
        .filter((student) => student.active)
        .map(
          (student) =>
            ({
              value: student,
              label: getName(student, true),
            } as JournalStudentFilterOption)
        );

      const allOptions = [
        {
          value: "",
          label: t("actions.showAll"),
        } as JournalStudentFilterOption,
        ...studentFilterOptions,
      ];

      const selectedOption = allOptions.find((option) => {
        const valueToFind = this.props.journalsState.userEntityId || "";

        if (typeof option.value === "string") {
          return option.value === valueToFind;
        } else {
          return option.value.userEntityId === valueToFind;
        }
      });

      primaryOption = (
        <div className="form-element form-element--main-action">
          <label htmlFor="selectJournal" className="visually-hidden">
            {t("wcag.journalSelect", { ns: "workspace" })}
          </label>
          <Select
            className="react-select-override"
            classNamePrefix="react-select-override"
            id="selectJournal"
            options={allOptions}
            value={selectedOption}
            onChange={this.handleWorkspaceJournalFilterChange}
            styles={{
              // eslint-disable-next-line jsdoc/require-jsdoc
              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
        </div>
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

          {this.props.journalsState.journalFeedback && (
            <WorkspaceJournalFeedback
              journalFeedback={this.props.journalsState.journalFeedback}
            />
          )}

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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { loadCurrentWorkspaceJournalsFromServer },
    dispatch
  );
}

export default withTranslation(["journal", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceJournalApplication)
);
