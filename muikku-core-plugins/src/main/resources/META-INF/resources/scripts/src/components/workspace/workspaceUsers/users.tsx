import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import {ButtonPill} from '~/components/general/button';
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';

import '~/sass/elements/loaders.scss';
import '~/sass/elements/avatar.scss';
import { getName, filterMatch, filterHighlight } from "~/util/modifiers";
import { ShortWorkspaceUserWithActiveStatusType, UserIndexType, UserType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import Tabs from "~/components/general/tabs";
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
  return <div>
    <LazyLoader className="avatar-container">
      <Avatar id={props.student.userEntityId} firstName={props.student.firstName} hasImage={props.student.hasImage}/>
    </LazyLoader>
    <span>{filterHighlight(getName(props.student, true), props.highlight) +
      (props.student.studyProgrammeName ? " (" + props.student.studyProgrammeName + ")" : "")}</span>
    {props.student.active ? <ButtonPill buttonModifiers="workspace-users-contact" icon="message-unread" onClick={props.onSendMessage}/> : null}
    {props.student.active ? <ButtonPill icon="delete" onClick={props.onSetToggleStatus}/> : <ButtonPill icon="goback" onClick={props.onSetToggleStatus}/>}
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
  onTabChange(newactive: "ACTIVE" | "INACTIVE"){
    this.setState({
      activeTab: newactive
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
    
    return (<div className="panel panel--workspace-users">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-signup icon-book"></div>
        <div className="panel__header-title">{this.props.i18n.text.get('plugin.workspace.users.pageTitle')} - {this.props.workspace && this.props.workspace.name}</div>
      </div>
      <div className="panel__body">
        <h2>{this.props.i18n.text.get('plugin.workspace.users.teachers.title')}</h2>
        <div className="loader-empty">
          {this.props.workspace && this.props.workspace.staffMembers && this.props.workspace.staffMembers.map((staff)=>{
            let userCategory = staff.userEntityId > 10 ? staff.userEntityId % 10 + 1 : staff.userEntityId;
            return <div key={staff.userEntityId}>
              <Avatar id={staff.userEntityId} hasImage firstName={staff.firstName}/>
              <span>{getName(staff, true)}</span>
              <CommunicatorNewMessage extraNamespace="workspace-teachers" initialSelectedItems={[{
                type: "staff",
                value: staff
              }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
                initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}>
                <ButtonPill buttonModifiers="workspace-users-contact" icon="message-unread"/>
              </CommunicatorNewMessage>
            </div>
          })}
        </div>
        <h2>{this.props.i18n.text.get('plugin.workspace.users.students.title')}</h2>
        
        <input type="text" className="form-element__input form-element__input--main-function-search"
          value={this.state.currentSearch} onChange={this.updateSearch}/>
        
        <Tabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
          {
            id: "ACTIVE",
            name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
            component: ()=>{
              let activeStudents = this.props.workspace && this.props.workspace.students &&
                this.props.workspace.students
                .filter(s=>s.active)
                .filter(s=>filterMatch(getName(s, true), this.state.currentSearch))
                .map(s=><Student highlight={this.state.currentSearch}
                  onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                  key={s.workspaceUserEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props}/>);
              
              return <div className="loader-empty">
                {this.props.workspace && this.props.workspace.students ? (
                  activeStudents.length ? activeStudents : <div>{this.props.i18n.text.get('TODO no active students')}</div>
                ): null}
              </div>
            }
          },
          {
            id: "INACTIVE",
            name: this.props.i18n.text.get('plugin.workspace.users.students.link.inactive'),
            component: ()=>{
              let inactiveStudents = this.props.workspace && this.props.workspace.students &&
                this.props.workspace.students
                .filter(s=>!s.active)
                .filter(s=>filterMatch(getName(s, true), this.state.currentSearch))
                .map(s=><Student onSetToggleStatus={this.setStudentBeingToggledStatus.bind(this, s)}
                  highlight={this.state.currentSearch} key={s.workspaceUserEntityId} student={s} {...this.props}/>);
              
              return <div className="loader-empty">
                {this.props.workspace && this.props.workspace.students ? (
                  inactiveStudents.length ? inactiveStudents : <div>{this.props.i18n.text.get('TODO no inactive students')}</div>
                ): null}
              </div>
            }
          }
        ]}/>
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