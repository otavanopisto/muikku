import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { WorkspaceDataType } from "~/reducers/workspaces/index";
import { StatusType } from "~/reducers/base/status";
import { Action, bindActionCreators, Dispatch } from "redux";
import { loadStudentsOfWorkspace } from "~/actions/workspaces";
import { LoadUsersOfWorkspaceTriggerType } from "~/actions/workspaces/index";
import { AnyActionType } from "~/actions";
import {
  JournalsState,
  WorkspaceJournalFilters,
} from "../../../../reducers/workspaces/journals";
import {
  ChangeWorkspaceJournalFiltersTriggerType,
  changeWorkspaceJournalFilters,
} from "../../../../actions/workspaces/journals";
import {
  LoadCurrentWorkspaceJournalsFromServerTriggerType,
  loadCurrentWorkspaceJournalsFromServer,
} from "~/actions/workspaces/journals";
import { withTranslation, WithTranslation } from "react-i18next";
import { WorkspaceStudentSearchResult } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  workspace: WorkspaceDataType;
  journalsState: JournalsState;
  status: StatusType;
  loadStudents: LoadUsersOfWorkspaceTriggerType;
  loadCurrentWorkspaceJournalsFromServer: LoadCurrentWorkspaceJournalsFromServerTriggerType;
  changeWorkspaceJournalFilters: ChangeWorkspaceJournalFiltersTriggerType;
}

/**
 * NavigationAsideState
 */
interface NavigationAsideState {
  students: WorkspaceStudentSearchResult | null;
}

/**
 * NavigationAside
 */
class NavigationAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavigationAsideProps) {
    super(props);

    this.state = {
      students: null,
    };
  }

  /**
   * Handles change journal filter click
   * @param filterKey filterKey
   */
  handleChangeJournalFilterClick =
    (filterKey: keyof WorkspaceJournalFilters) => () => {
      const { filters } = this.props.journalsState;

      this.props.changeWorkspaceJournalFilters({
        journalFilters: {
          [filterKey]: !filters[filterKey],
        },
      });
    };

  /**
   * Handles student changes and loads specific students journals to global state
   * @param id id
   */
  handleOnStudentClick = (id: number | null) => () => {
    this.props.loadCurrentWorkspaceJournalsFromServer(id);
  };

  /**
   * filterStudents
   * @param students students
   * @returns array of students or empty array
   */
  filterStudents = (students: WorkspaceStudentSearchResult | null) => {
    if (students !== null) {
      return !this.props.status.isStudent && students
        ? students.results.filter(
            (student, index, array) =>
              array.findIndex(
                (otherStudent) =>
                  otherStudent.userEntityId === student.userEntityId
              ) === index
          )
        : [];
    } else {
      return [];
    }
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const { workspace, journalsState } = this.props;

    if (!workspace) {
      return null;
    }

    const { filters } = journalsState;

    /**
     * Filtered student list
     */
    const filteredStudents = this.filterStudents(workspace.students);

    /**
     * If all student is showed
     */
    const allSelected =
      journalsState !== null &&
      journalsState.journals !== null &&
      journalsState.userEntityId === null;

    const navigationElementList: JSX.Element[] = [];

    navigationElementList.push(
      <NavigationElement
        key="showAll"
        isActive={allSelected}
        icon="user"
        onClick={this.handleOnStudentClick(null)}
      >
        {t("actions.showAll")}
      </NavigationElement>
    );

    filteredStudents.length > 0 &&
      filteredStudents.map(
        (student) =>
          student.active &&
          navigationElementList.push(
            <NavigationElement
              key={student.userEntityId}
              isActive={student.userEntityId === journalsState.userEntityId}
              icon="user"
              onClick={this.handleOnStudentClick(student.userEntityId)}
            >
              {`${student.firstName} ${student.lastName}`}
            </NavigationElement>
          )
      );

    return (
      <Navigation key="journal-navigation-11">
        <NavigationTopic name={t("labels.type", { ns: "journal" })}>
          <NavigationElement
            icon="book"
            isActive={filters.showMandatory}
            onClick={this.handleChangeJournalFilterClick("showMandatory")}
          >
            {t("labels.mandatories", { ns: "journal" })}
          </NavigationElement>
          <NavigationElement
            icon="book"
            isActive={filters.showOthers}
            onClick={this.handleChangeJournalFilterClick("showOthers")}
          >
            {t("labels.others", { ns: "journal" })}
          </NavigationElement>
        </NavigationTopic>

        {!this.props.status.isStudent && (
          <NavigationTopic
            name={t("labels.workspaceStudents", { ns: "users" })}
          >
            {navigationElementList}
          </NavigationTopic>
        )}
      </Navigation>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
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
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      loadStudents: loadStudentsOfWorkspace,
      loadCurrentWorkspaceJournalsFromServer,
      changeWorkspaceJournalFilters,
    },
    dispatch
  );
}

export default withTranslation(["journal", "workspace", "users", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
