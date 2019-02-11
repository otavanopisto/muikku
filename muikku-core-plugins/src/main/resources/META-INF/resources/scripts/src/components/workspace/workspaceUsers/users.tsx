import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import {ButtonPill} from '~/components/general/button';
import { bindActionCreators } from "redux";
import { toggleActiveStateOfStudentOfWorkspace, ToggleActiveStateOfStudentOfWorkspaceTriggerType } from "~/actions/workspaces";
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';

import '~/sass/elements/loaders.scss';
import '~/sass/elements/avatar.scss';
import { getUserImageUrl, getName } from "~/util/modifiers";
import { ShortWorkspaceUserWithActiveStatusType, UserIndexType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import { loadUserIndex, LoadUserIndexTriggerType } from "~/actions/user-index";

interface WorkspaceUsersProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType,
  loadUserIndex: LoadUserIndexTriggerType,
  userIndex: UserIndexType
}

interface WorkspaceUsersState {
  studentCurrentlyBeingSentMessage: ShortWorkspaceUserWithActiveStatusType
}

interface StudentProps {
  student: ShortWorkspaceUserWithActiveStatusType,
  toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType,
  loadUserIndex: LoadUserIndexTriggerType,
  userIndex: UserIndexType,
  workspace: WorkspaceType,
  i18n: i18nType
  status: StatusType,
  onSendMessage?: ()=>any
}

function Student(props: StudentProps){
  let userCategory = props.student.userEntityId > 10 ? props.student.userEntityId % 10 + 1 : props.student.userEntityId;
  let user = props.userIndex.users[props.student.userEntityId];
  return <div>
    <object className="avatar-container"
     data={getUserImageUrl(props.student.userEntityId)}
     type="image/jpeg">
      <div className={`avatar avatar--category-${userCategory}`}>{props.student.firstName[0]}</div>
    </object>
    <span>{getName(props.student, true)}</span>
    {props.student.active ? <ButtonPill buttonModifiers="workspace-users-contact" icon="message-unread" onClick={props.onSendMessage}/> : null}
    {props.student.active ? <ButtonPill icon="delete"/> : <ButtonPill icon="goback"/>}
  </div>
}

class WorkspaceUsers extends React.Component<WorkspaceUsersProps, WorkspaceUsersState> {
  constructor(props: WorkspaceUsersProps){
    super(props);
    
    this.state = {
      studentCurrentlyBeingSentMessage: null
    }
    
    this.onSendMessageTo = this.onSendMessageTo.bind(this);
    this.removeStudentBeingSentMessage = this.removeStudentBeingSentMessage.bind(this);
  }
  onSendMessageTo(student: ShortWorkspaceUserWithActiveStatusType){
    this.props.loadUserIndex(student.userEntityId);
    this.setState({
      studentCurrentlyBeingSentMessage: student
    });
  }
  removeStudentBeingSentMessage(){
    this.setState({
      studentCurrentlyBeingSentMessage: null
    });
  }
  render(){
    let activeStudents = this.props.workspace && this.props.workspace.students &&
      this.props.workspace.students
      .filter(s=>s.active)
      .map(s=><Student key={s.userEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props}/>);
    
    let inactiveStudents = this.props.workspace && this.props.workspace.students &&
      this.props.workspace.students
      .filter(s=>!s.active)
      .map(s=><Student key={s.userEntityId} student={s} {...this.props}/>);
    
    let currentStudentBeingSentMessage = this.state.studentCurrentlyBeingSentMessage &&
      this.props.userIndex.users[this.state.studentCurrentlyBeingSentMessage.userEntityId];
    
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
              <object className="avatar-container"
               data={getUserImageUrl(staff.userEntityId)}
               type="image/jpeg">
                <div className={`avatar avatar--category-${userCategory}`}>{staff.firstName[0]}</div>
              </object>
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
        <h3>{this.props.i18n.text.get('plugin.workspace.users.students.link.active')}</h3>
        <div className="loader-empty">
          {this.props.workspace && this.props.workspace.students ? (
              activeStudents.length ? activeStudents : <div>{this.props.i18n.text.get('TODO no active students')}</div>
            ): null}
        </div>
        <h3>{this.props.i18n.text.get('plugin.workspace.users.students.link.inactive')}</h3>
        <div className="loader-empty">
          {this.props.workspace && this.props.workspace.students ? (
            inactiveStudents.length ? inactiveStudents : <div>{this.props.i18n.text.get('TODO no inactive students')}</div>
          ): null}
        </div>
      </div>
      {currentStudentBeingSentMessage ? <CommunicatorNewMessage isOpen onClose={this.removeStudentBeingSentMessage}
        extraNamespace="workspace-students" initialSelectedItems={[{
          type: "user",
          value: currentStudentBeingSentMessage
        }]} initialSubject={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace)}
      initialMessage={getWorkspaceMessage(this.props.i18n, this.props.status, this.props.workspace, true)}/> : null}
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({toggleActiveStateOfStudentOfWorkspace, loadUserIndex}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceUsers);