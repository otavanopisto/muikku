import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import {IconButton, ButtonPill} from '~/components/general/button';
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/tabs.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/avatar.scss';
import { getName, filterMatch, filterHighlight } from "~/util/modifiers";
import { ShortWorkspaceUserWithActiveStatusType, UserIndexType, UserType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import {MobileOnlyTabs} from "~/components/general/tabs";
import Avatar from "~/components/general/avatar";
import DeactivateReactivateUserDialog from './dialogs/deactivate-reactivate-user';
import LazyLoader from "~/components/general/lazy-loader";

interface WorkspaceUsersProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType
}

interface WorkspaceUsersState {
  studentCurrentlyBeingSentMessage: ShortWorkspaceUserWithActiveStatusType,
  activeTab: "ACTIVE" | "INACTIVE",
  currentSearch: string,
  studentCurrentBeingToggledStatus: ShortWorkspaceUserWithActiveStatusType
}

interface StudentProps {
  student: ShortWorkspaceUserWithActiveStatusType,
  workspace: WorkspaceType,
  i18n: i18nType
  status: StatusType,
  highlight: string,
  onSendMessage?: ()=>any,
  onSetToggleStatus: ()=>any
}

function Student(props: StudentProps){
  
  return <div className="application-list__item-content-wrapper application-list__item-content-wrapper--workspace-users">
    <LazyLoader className="avatar-container">
      <Avatar id={props.student.userEntityId} firstName={props.student.firstName} hasImage={props.student.hasImage}/>
    </LazyLoader>
    <div className="application-list__item-content-main application-list__item-content-main--workspace-user">
      <div>{filterHighlight(getName(props.student, true), props.highlight)}</div>
      <div className="application-list__item-content-secondary-data">{props.student.studyProgrammeName ? " (" + props.student.studyProgrammeName + ")" : ""}</div>
    </div>
    {props.student.active ? <IconButton buttonModifiers="workspace-users-contact" icon="message-unread" onClick={props.onSendMessage}/> : null}
    {props.student.active ? <IconButton icon="delete" onClick={props.onSetToggleStatus}/> : <IconButton icon="goback" onClick={props.onSetToggleStatus}/>}
  </div>
}

class WorkspaceUsers extends React.Component<WorkspaceUsersProps, WorkspaceUsersState> {
  constructor(props: WorkspaceUsersProps){
    super(props);
    
    this.state = {
      studentCurrentlyBeingSentMessage: null,
      activeTab: "ACTIVE",
      currentSearch: "",
      studentCurrentBeingToggledStatus: null
    }
    
    this.onSendMessageTo = this.onSendMessageTo.bind(this);
    this.removeStudentBeingSentMessage = this.removeStudentBeingSentMessage.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.removeStudentBeingToggledStatus = this.removeStudentBeingToggledStatus.bind(this);
    this.setStudentBeingToggledStatus = this.setStudentBeingToggledStatus.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }
  onSendMessageTo(student: ShortWorkspaceUserWithActiveStatusType){
    this.setState({
      studentCurrentlyBeingSentMessage: student
    });
  }
  removeStudentBeingSentMessage(){
    this.setState({
      studentCurrentlyBeingSentMessage: null
    });
  }
  onTabChange(id: "ACTIVE" | "INACTIVE"){
    this.setState({
      activeTab: id
    });
  }
  updateSearch(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      currentSearch: e.target.value
    });
  }
  removeStudentBeingToggledStatus(){
    this.setState({
      studentCurrentBeingToggledStatus: null
    });
  }
  setStudentBeingToggledStatus(student: ShortWorkspaceUserWithActiveStatusType){
    this.setState({
      studentCurrentBeingToggledStatus: student
    });
  }
  render(){
    let currentStudentBeingSentMessage:UserType = this.state.studentCurrentlyBeingSentMessage &&
      {
        id: this.state.studentCurrentlyBeingSentMessage.userEntityId,
        firstName: this.state.studentCurrentlyBeingSentMessage.firstName,
        lastName: this.state.studentCurrentlyBeingSentMessage.lastName,
        nickName: this.state.studentCurrentlyBeingSentMessage.nickName,
        studyProgrammeName: this.state.studentCurrentlyBeingSentMessage.studyProgrammeName,
      }
    
    return (<div className="application-panel application-panel--workspace-users">
      <div className="application-panel__container">
        <div className="application-panel__header"> 
          <h2 className="application-panel__header-title">{this.props.i18n.text.get('plugin.workspace.users.pageTitle')} - {this.props.workspace && this.props.workspace.name}</h2>
        </div>
        <div className="application-panel__body">
          <div className="application-sub-panel application-sub-panel--workspace-users">
            <h2 className="application-sub-panel__header application-sub-panel__header--workspace-users">
               {this.props.i18n.text.get('plugin.workspace.users.teachers.title')}
            </h2>
            <div className="application-sub-panel__body application-list--workspace-staff-members">   
            {this.props.workspace && this.props.workspace.staffMembers && this.props.workspace.staffMembers.map((staff)=>{
              let userCategory = staff.userEntityId > 10 ? staff.userEntityId % 10 + 1 : staff.userEntityId;
              return <div className="application-list__item application-list__item--workspace-user" key={staff.userEntityId}>
                <div className="application-list__item-content-wrapper application-list__item-content-wrapper--workspace-users">
                  <Avatar id={staff.userEntityId} hasImage firstName={staff.firstName}/>
                  <div className="application-list__item-content-main application-list__item-content-main--workspace-user">
                    <div>{getName(staff, true)}</div>
                    <div className="application-list__item-content-secondary-data">{staff.email}</div>
                  </div>
                  <CommunicatorNewMessage extraNamespace="workspace-teachers" initialSelectedItems={[{
                    type: "staff",
                    value: staff
                  }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
                    initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}>
                    <IconButton buttonModifiers="workspace-users-contact" icon="message-unread"/>
                  </CommunicatorNewMessage>
                </div>
              </div>
            })}
            </div>
          </div>
          <div className="application-sub-panel application-sub-panel--workspace-users">  
            <h2 className="application-sub-panel__header application-sub-panel__header--workspace-users">{this.props.i18n.text.get('plugin.workspace.users.students.title')}</h2>
          <div className="application-sub-panel__body application-sub-panel__body--workspace-students">
            <div className="form-element form-element--workspace-toolbar">
              <input type="text" className="form-element__input form-element__input--subpanel-search"
                value={this.state.currentSearch} onChange={this.updateSearch}/>
              <div className="form-element__input-decoration--subpanel-search icon-search"></div>
            </div>
            <MobileOnlyTabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
              {
                id: "ACTIVE",
                name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
                type: "workspace-students",
                component: ()=>{
                  let activeStudents = this.props.workspace && this.props.workspace.students &&
                    this.props.workspace.students
                    .filter(s=>s.active)
                    .filter(s=>filterMatch(getName(s, true), this.state.currentSearch))
                    .map(s=><Student highlight={this.state.currentSearch}
                      onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                      key={s.workspaceUserEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props}/>);
                  
                      return <div className="application-list application-list--workspace-users">
                        {this.props.workspace && this.props.workspace.students ? (
                          activeStudents.length ? activeStudents : <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.activeStudents.empty')}</div>
                        ): null}
                      </div>
                }
              },
              {
                id: "INACTIVE",
                name: this.props.i18n.text.get('plugin.workspace.users.students.link.inactive'),
                type: "workspace-students",
                component: ()=>{
                  let inactiveStudents = this.props.workspace && this.props.workspace.students &&
                    this.props.workspace.students
                    .filter(s=>!s.active)
                    .filter(s=>filterMatch(getName(s, true), this.state.currentSearch))
                    .map(s=><Student onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                      highlight={this.state.currentSearch} key={s.workspaceUserEntityId} student={s} {...this.props}/>);
                  
                  return <div className="application-list application-list--workspace-users">
                    {this.props.workspace && this.props.workspace.students ? (
                      inactiveStudents.length ? inactiveStudents : <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.inActiveStudents.empty')}</div>
                    ): null}
                  </div>
                }
              }
            ]}/>
          </div>
          </div>
        </div>
      </div>

      {currentStudentBeingSentMessage ? <CommunicatorNewMessage isOpen onClose={this.removeStudentBeingSentMessage}
        extraNamespace="workspace-students" initialSelectedItems={[{
          type: "user",
          value: currentStudentBeingSentMessage
        }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
      initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}/> : null}
      {this.state.studentCurrentBeingToggledStatus ? <DeactivateReactivateUserDialog isOpen
          onClose={this.removeStudentBeingToggledStatus} user={this.state.studentCurrentBeingToggledStatus}/> : null}
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceUsers);