import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { IconButton } from '~/components/general/button';
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/tabs.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/avatar.scss';
import { getName, filterMatch } from "~/util/modifiers";
import { ShortWorkspaceUserWithActiveStatusType, UserType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import Tabs, { MobileOnlyTabs } from "~/components/general/tabs";
import Pager from '~/components/general/pager';
import Avatar from "~/components/general/avatar";
import DeactivateReactivateUserDialog from './dialogs/deactivate-reactivate-user';
import { SearchFormElement } from '~/components/general/form-element';
import WorkspaceUser from "~/components/general/workspace-user";
import { loadStaffMembersOfWorkspace, loadStudentsOfWorkspace, LoadUsersOfWorkspaceTriggerType } from '~/actions/workspaces';


interface WorkspaceUsersProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  loadStaffMembers: LoadUsersOfWorkspaceTriggerType,
  loadStudents: LoadUsersOfWorkspaceTriggerType,
}

interface WorkspaceUsersState {
  studentCurrentlyBeingSentMessage: ShortWorkspaceUserWithActiveStatusType,
  activeTab: "ACTIVE" | "INACTIVE",
  currentSearch: string,
  currentStaffPage: number,
  currentActiveStudentPage: number,
  currentInactiveStudentPage: number,
  studentCurrentBeingToggledStatus: ShortWorkspaceUserWithActiveStatusType
}

class WorkspaceUsers extends React.Component<WorkspaceUsersProps, WorkspaceUsersState> {
  private usersPerPage: number = 10;
  private allStaffPages: number = 0;
  private allActiveStudentsPages: number = 0;
  private allInActiveStudentsPages: number = 0;

  constructor(props: WorkspaceUsersProps) {
    super(props);

    this.state = {
      studentCurrentlyBeingSentMessage: null,
      activeTab: "ACTIVE",
      currentSearch: "",
      currentStaffPage: 1,
      currentActiveStudentPage: 1,
      currentInactiveStudentPage: 1,
      studentCurrentBeingToggledStatus: null
    }

    this.onSendMessageTo = this.onSendMessageTo.bind(this);
    this.removeStudentBeingSentMessage = this.removeStudentBeingSentMessage.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.removeStudentBeingToggledStatus = this.removeStudentBeingToggledStatus.bind(this);
    this.setStudentBeingToggledStatus = this.setStudentBeingToggledStatus.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.loadStaffMembers = this.loadStaffMembers.bind(this);
    this.loadActiveStudents = this.loadActiveStudents.bind(this);
    this.loadInActiveStudents = this.loadInActiveStudents.bind(this);
  }
  onSendMessageTo(student: ShortWorkspaceUserWithActiveStatusType) {
    this.setState({
      studentCurrentlyBeingSentMessage: student
    });
  }
  removeStudentBeingSentMessage() {
    this.setState({
      studentCurrentlyBeingSentMessage: null
    });
  }
  onTabChange(id: "ACTIVE" | "INACTIVE") {
    this.setState({
      activeTab: id
    });
  }
  updateSearch(query: string) {
    this.props.loadStudents({ workspace: this.props.workspace, payload: { q: query, active: true, firstResult: 0, maxResults: this.usersPerPage } });
    this.props.loadStudents({ workspace: this.props.workspace, payload: { q: query, active: false, firstResult: 0, maxResults: this.usersPerPage } });

    this.setState({
      currentSearch: query,
      currentActiveStudentPage: 1,
      currentInactiveStudentPage: 1,
    });
  }

  removeStudentBeingToggledStatus() {

    this.setState({
      studentCurrentBeingToggledStatus: null
    });
    this.loadInActiveStudents(1);
  }
  setStudentBeingToggledStatus(student: ShortWorkspaceUserWithActiveStatusType) {
    this.setState({
      studentCurrentBeingToggledStatus: student
    });
    this.loadActiveStudents(1);
  }

  loadStaffMembers(page: number) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: "",
        firstResult: (page - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      }
    }
    this.props.loadStaffMembers(data)
    this.setState({ currentStaffPage: page });
  };

  loadActiveStudents(page: number) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: "",
        active: true,
        firstResult: (page - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      }
    }
    this.props.loadStudents(data)
    this.setState({ currentActiveStudentPage: page });
  };

  loadInActiveStudents(page: number) {
    const data = {
      workspace: this.props.workspace,
      payload: {
        q: "",
        active: false,
        firstResult: (page - 1) * this.usersPerPage,
        maxResults: this.usersPerPage,
      }
    }
    this.props.loadStudents(data)
    this.setState({ currentInactiveStudentPage: page });
  };




  UNSAFE_componentWillReceiveProps(nextProps: WorkspaceUsersProps) {
    if (nextProps.workspace && nextProps.workspace.staffMembers) {
      this.allStaffPages = Math.ceil(nextProps.workspace.staffMembers.totalHitCount / this.usersPerPage);
    }
    if (nextProps.workspace && nextProps.workspace.students) {
      this.allActiveStudentsPages = Math.ceil(nextProps.workspace.students.totalHitCount / this.usersPerPage);
    }
    if (nextProps.workspace && nextProps.workspace.inactiveStudents) {
      this.allInActiveStudentsPages = Math.ceil(nextProps.workspace.inactiveStudents.totalHitCount / this.usersPerPage);
    }
  }


  render() {
    let currentStudentBeingSentMessage: UserType = this.state.studentCurrentlyBeingSentMessage &&
    {
      id: this.state.studentCurrentlyBeingSentMessage.userEntityId,
      firstName: this.state.studentCurrentlyBeingSentMessage.firstName,
      lastName: this.state.studentCurrentlyBeingSentMessage.lastName,
      nickName: this.state.studentCurrentlyBeingSentMessage.nickName,
      studyProgrammeName: this.state.studentCurrentlyBeingSentMessage.studyProgrammeName,
    }

    return (<div className="application-panel-wrapper">
      <div className="application-panel application-panel--workspace-users">
        <div className="application-panel__container">
          <div className="application-panel__header">
            <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.workspace.users.pageTitle')}</h2>
          </div>
          <div className="application-panel__body">
            <div className="application-sub-panel application-sub-panel--workspace-users">
              <h2 className="application-sub-panel__header application-sub-panel__header--workspace-users">
                {this.props.i18n.text.get('plugin.workspace.users.teachers.title')}
              </h2>
              <div className="application-sub-panel__body application-sub-panel__body--workspace-staff-members">
                <div className="application-list application-list--workspace-staff-members">
                  {this.props.workspace && this.props.workspace.staffMembers && this.props.workspace.staffMembers.results.map((staff) => {
                    return <div className="application-list__item application-list__item--workspace-staff-member" key={staff.userEntityId}>
                      <div className="application-list__item-content-wrapper application-list__item-content-wrapper--workspace-user">
                        <div className="application-list__item-content-aside application-list__item-content-aside--workspace-user">
                          <div className="item-list__profile-picture">
                            <Avatar id={staff.userEntityId} hasImage={staff.hasImage} firstName={staff.firstName} />
                          </div>
                        </div>
                        <div className="application-list__item-content-main application-list__item-content-main--workspace-user">
                          <div>{getName(staff, true)}</div>
                          <div className="application-list__item-content-secondary-data">{staff.email}</div>
                        </div>
                        <CommunicatorNewMessage extraNamespace="workspace-teachers" initialSelectedItems={[{
                          type: "staff",
                          value: staff
                        }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
                          initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}>
                          <IconButton buttonModifiers="workspace-users-contact" icon="envelope" />
                        </CommunicatorNewMessage>
                      </div>
                    </div>
                  })}
                </div>{this.allStaffPages > 1 ?
                  < Pager identifier="staffPager" current={this.state.currentStaffPage} pages={this.allStaffPages} onClick={this.loadStaffMembers} />
                  : null}
              </div>
            </div>
            <div className="application-sub-panel application-sub-panel--workspace-users">
              <h2 className="application-sub-panel__header application-sub-panel__header--workspace-users">{this.props.i18n.text.get('plugin.workspace.users.students.title')}</h2>
              <div className="application-sub-panel__body application-sub-panel__body--workspace-students">
                <div className="form-element form-element--search">
                  <SearchFormElement delay={0} value={this.state.currentSearch} updateField={this.updateSearch} id="WorkspaceUserFilter" name="workspace-user-filter" placeholder={this.props.i18n.text.get('plugin.workspace.users.students.searchStudents')} />
                </div>
                <MobileOnlyTabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
                  {
                    id: "ACTIVE",
                    name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
                    type: "workspace-students",
                    component: () => {
                      let activeStudents = this.props.workspace && this.props.workspace.students &&
                        this.props.workspace.students.results.map(s => <WorkspaceUser highlight={this.state.currentSearch}
                          onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                          key={s.workspaceUserEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props} />);

                      return <div className="application-list application-list--workspace-users">
                        {this.props.workspace && this.props.workspace.students ? (
                          activeStudents.length ? activeStudents : <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.activeStudents.empty')}</div>
                        ) : null}
                        {this.allActiveStudentsPages > 1 ?
                          <Pager identifier="activeStudentsPager" current={this.state.currentActiveStudentPage} pages={this.allActiveStudentsPages} onClick={this.loadActiveStudents} />
                          : null}
                      </div>
                    }
                  },
                  {
                    id: "INACTIVE",
                    name: this.props.i18n.text.get('plugin.workspace.users.students.link.inactive'),
                    type: "workspace-students",
                    component: () => {
                      let inactiveStudents = this.props.workspace && this.props.workspace.inactiveStudents &&
                        this.props.workspace.inactiveStudents.results
                          .map(s => <WorkspaceUser onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                            highlight={this.state.currentSearch} key={s.workspaceUserEntityId} student={s} {...this.props} />);

                      return <div className="application-list application-list--workspace-users">
                        {this.props.workspace && this.props.workspace.inactiveStudents ? (
                          inactiveStudents.length ? inactiveStudents : <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.inActiveStudents.empty')}</div>
                        ) : null}
                        {this.allInActiveStudentsPages > 1 ?
                          <Pager identifier="archivedStudentsPager" current={this.state.currentInactiveStudentPage} pages={this.allInActiveStudentsPages} onClick={this.loadInActiveStudents} />
                          : null}
                      </div>
                    }
                  }
                ]} />
              </div>
            </div >
          </div>
        </div>

        {currentStudentBeingSentMessage ? <CommunicatorNewMessage isOpen onClose={this.removeStudentBeingSentMessage}
          extraNamespace="workspace-students" initialSelectedItems={[{
            type: "user",
            value: currentStudentBeingSentMessage
          }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
          initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)} /> : null}
        {this.state.studentCurrentBeingToggledStatus ? <DeactivateReactivateUserDialog isOpen
          onClose={this.removeStudentBeingToggledStatus} user={this.state.studentCurrentBeingToggledStatus} /> : null}
      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};


function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    loadStaffMembers: loadStaffMembersOfWorkspace, loadStudents: loadStudentsOfWorkspace

  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceUsers);
