import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { WorkspaceType } from "~/reducers/workspaces/index";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
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
import { WorkspaceStudentSearchResult } from "~/generated/client/models/WorkspaceStudentSearchResult";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps {
  i18n: i18nType;
  workspace: WorkspaceType;
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
        {this.props.i18n.text.get(
          "plugin.workspace.journal.studentFilter.showAll"
        )}
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
        <NavigationTopic
          name={this.props.i18n.text.get(
            "plugin.workspace.journal.filters.title"
          )}
        >
          <NavigationElement
            icon="book"
            isActive={filters.showMandatory}
            onClick={this.handleChangeJournalFilterClick("showMandatory")}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.journal.filters.mandatory.label"
            )}
          </NavigationElement>
          <NavigationElement
            icon="book"
            isActive={filters.showOthers}
            onClick={this.handleChangeJournalFilterClick("showOthers")}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.journal.filters.other.label"
            )}
          </NavigationElement>
        </NavigationTopic>

        {!this.props.status.isStudent && (
          <NavigationTopic
            name={this.props.i18n.text.get(
              "plugin.organization.workspaces.editWorkspace.users.tab.workspaceStudents.title"
            )}
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
    i18n: state.i18n,
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadStudents: loadStudentsOfWorkspace,
      loadCurrentWorkspaceJournalsFromServer,
      changeWorkspaceJournalFilters,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
