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
import {
  loadStudentsOfWorkspace,
  loadCurrentWorkspaceJournalsFromServer,
} from "~/actions/workspaces";
import {
  LoadUsersOfWorkspaceTriggerType,
  LoadCurrentWorkspaceJournalsFromServerTriggerType,
} from "~/actions/workspaces/index";
import { WorkspaceStudentListType } from "~/reducers/user-index";

interface NavigationAsideProps {
  i18n: i18nType;
  workspace: WorkspaceType;
  status: StatusType;
  loadStudents: LoadUsersOfWorkspaceTriggerType;
  loadCurrentWorkspaceJournalsFromServer: LoadCurrentWorkspaceJournalsFromServerTriggerType;
}

interface NavigationAsideState {
  students: WorkspaceStudentListType | null;
}

class NavigationAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  constructor(props: NavigationAsideProps) {
    super(props);

    this.state = {
      students: null,
    };
  }

  /**
   * Handles student changes and loads specific students journals to global state
   * @param id
   * @returns
   */
  handleOnStudentClick = (id: number | null) => () => {
    this.props.loadCurrentWorkspaceJournalsFromServer(id);
  };

  /**
   * filterStudents
   * @param students
   * @returns array of students or empty array
   */
  filterStudents = (students: WorkspaceStudentListType | null) => {
    if (students !== null) {
      return !this.props.status.isStudent && students
        ? students.results.filter(
            (student, index, array) =>
              array.findIndex(
                (otherStudent) =>
                  otherStudent.userEntityId === student.userEntityId,
              ) === index,
          )
        : [];
    } else {
      return [];
    }
  };

  /**
   * render
   * @returns
   */
  render() {
    const { workspace } = this.props;

    if (!workspace) {
      return null;
    }

    /**
     * Filtered student list
     */
    const filteredStudents = this.filterStudents(workspace.students);

    /**
     * If all student is showed
     */
    const allSelected =
      workspace !== null &&
      workspace.journals !== null &&
      workspace.journals.userEntityId === null;

    const navigationElementList: JSX.Element[] = [];

    navigationElementList.push(
      <NavigationElement
        key="showAll"
        isActive={allSelected}
        icon="user"
        onClick={this.handleOnStudentClick(null)}
      >
        {this.props.i18n.text.get(
          "plugin.workspace.journal.studentFilter.showAll",
        )}
      </NavigationElement>,
    );

    filteredStudents.length > 0 &&
      filteredStudents.map((student) =>
        navigationElementList.push(
          <NavigationElement
            key={student.userEntityId}
            isActive={
              student.userEntityId ===
              this.props.workspace.journals.userEntityId
            }
            icon="user"
            onClick={this.handleOnStudentClick(student.userEntityId)}
          >
            {`${student.firstName} ${student.lastName}`}
          </NavigationElement>,
        ),
      );

    return (
      <Navigation>
        {!this.props.status.isStudent && (
          <NavigationTopic
            name={this.props.i18n.text.get(
              "plugin.organization.workspaces.editWorkspace.users.tab.workspaceStudents.title",
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
 * @param state
 * @returns
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
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      loadStudents: loadStudentsOfWorkspace,
      loadCurrentWorkspaceJournalsFromServer,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
