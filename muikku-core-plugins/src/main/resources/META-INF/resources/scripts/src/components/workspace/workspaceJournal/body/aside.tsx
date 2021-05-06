import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { StateType } from '~/reducers';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';
import { WorkspaceType } from '../../../../reducers/workspaces/index';
import { StatusType } from '../../../../reducers/base/status';
import { getName } from '../../../../util/modifiers';
import { bindActionCreators } from 'redux';
import { loadStudentsOfWorkspace, loadCurrentWorkspaceJournalsFromServer } from '~/actions/workspaces';
import { LoadUsersOfWorkspaceTriggerType, LoadCurrentWorkspaceJournalsFromServerTriggerType } from '../../../../actions/workspaces/index';
import { WorkspaceStudentListType } from '../../../../reducers/user-index';

interface NavigationAsideProps {
  i18n: i18nType;
  workspace: WorkspaceType;
  status: StatusType;
  loadStudents: LoadUsersOfWorkspaceTriggerType;
  loadCurrentWorkspaceJournalsFromServer: LoadCurrentWorkspaceJournalsFromServerTriggerType;
}

interface NavigationAsideState {
  students: WorkspaceStudentListType | null
}

class NavigationAside extends React.Component<NavigationAsideProps, NavigationAsideState> {
  constructor(props:NavigationAsideProps){
    super(props);

    this.state = {
      students: null
    }
  }

  componentDidUpdate(prevProps: NavigationAsideProps, prevState: NavigationAsideState){
    if(JSON.stringify(prevProps.workspace) !== JSON.stringify(this.props.workspace)){
      this.setState({
        students: this.props.workspace.students
      });
    }
  }

  /**
   * Handles student changes and loads specific students journals to global state
   * @param id
   * @returns
   */
  handleOnStudentClick = (id:number | null) => (e: React.MouseEvent) => {

    this.props.loadCurrentWorkspaceJournalsFromServer(id);

  }

  /**
   * render
   * @returns
   */
  render() {
    const { students } = this.state

    const navigationElementList: JSX.Element[] = [];

    /*
      const allSelected = this.props.workspace.journals !== null && this.props.workspace.journals.userEntityId === null;
    */

    navigationElementList.push(<li key="showAll" onClick={this.handleOnStudentClick(null)} className={`item-list__item item-list__item--aside-navigation`}>
      <span className="item-list__icon icon-user"></span>
      <span className="link link--full link--menu ">{this.props.i18n.text.get("plugin.workspace.journal.studentFilter.showAll")}</span></li>);

    if(students !== null){
      !this.props.status.isStudent && students  ? (students.results)
      .filter((student, index, array) =>
        array.findIndex((otherStudent) => otherStudent.userEntityId === student.userEntityId) === index
      ).map((student) => {
        const selected = student.userEntityId === this.props.workspace.journals.userEntityId;

        navigationElementList.push(<li onClick={this.handleOnStudentClick(student.userEntityId)} className={`item-list__item item-list__item--aside-navigation ${selected && "active"}`} key={student.userEntityId}>
          <span className="item-list__icon icon-user"></span>
          <span className="link link--full link--menu">{getName(student, true)}</span></li>)
      }) : undefined;
    }
    return <Navigation>
      {!this.props.status.isStudent && (
        <div className="journal-student-list-container">
          <NavigationTopic name="Opiskelijat">
            <ul className="journal-student-List">
              {navigationElementList}
            </ul>
          </NavigationTopic>
        </div>
      )}
    </Navigation>
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return bindActionCreators(
    {
      loadStudents: loadStudentsOfWorkspace,
      loadCurrentWorkspaceJournalsFromServer
    },
    dispatch
  );;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( NavigationAside );
