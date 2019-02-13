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
import { ShortWorkspaceUserWithActiveStatusType, UserIndexType, UserType } from "~/reducers/user-index";
import { getWorkspaceMessage } from "~/components/workspace/workspaceHome/teachers";
import BodyScrollLoader from "~/components/general/body-scroll-loader";
import Tabs from "~/components/general/tabs";

interface WorkspaceUsersProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType,
  toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType
}

interface WorkspaceUsersState {
  studentCurrentlyBeingSentMessage: ShortWorkspaceUserWithActiveStatusType,
  activeTab: "ACTIVE" | "INACTIVE",
  loadedStudentsAmount: number
}

interface StudentProps {
  student: ShortWorkspaceUserWithActiveStatusType,
  toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType,
  workspace: WorkspaceType,
  i18n: i18nType
  status: StatusType,
  onSendMessage?: ()=>any
}

function Student(props: StudentProps){
  let userCategory = props.student.userEntityId > 10 ? props.student.userEntityId % 10 + 1 : props.student.userEntityId;
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
      studentCurrentlyBeingSentMessage: null,
      activeTab: "ACTIVE",
      loadedStudentsAmount: 10
    }
    
    this.checkStudentsAreReady = this.checkStudentsAreReady.bind(this);
    this.checkStudentsStateHasMore = this.checkStudentsStateHasMore.bind(this);
    this.loadMoreStudents = this.loadMoreStudents.bind(this);
    this.resetStudentsAmountCounter = this.resetStudentsAmountCounter.bind(this);
    
    //once this is in state READY only then a loading more event can be triggered
    //this.applicationIsReady = this.checkStudentsAreReady;
    //it will only call the function if this is true
    //this.hasMore = this.checkStudentsStateHasMore;
    //this is the function that will be called
    //this.loadMoreTriggerFunction = this.loadMoreStudents;
    
    this.onSendMessageTo = this.onSendMessageTo.bind(this);
    this.removeStudentBeingSentMessage = this.removeStudentBeingSentMessage.bind(this);
  }
  checkStudentsAreReady():boolean{
    return !!(this.props.workspace && this.props.workspace.students);
  }
  checkStudentsStateHasMore():boolean{
    let students = this.props.workspace && this.props.workspace.students;
    if (!students || !students.length){
      return false;
    }
    let activeN = 0;
    let inactiveN = 0;
    students.forEach(s=>{
      if (s.active){
        activeN++;
      } else {
        inactiveN++;
      }
    })
    if (this.state.activeTab === "ACTIVE"){
      return activeN > this.state.loadedStudentsAmount;
    } else {
      return inactiveN > this.state.loadedStudentsAmount;
    }
  }
  loadMoreStudents(){
    this.setState({
      loadedStudentsAmount: this.state.loadedStudentsAmount+10
    });
  }
  resetStudentsAmountCounter(){
    this.setState({
      loadedStudentsAmount: 10
    });
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
  render(){
    let currentStudentBeingSentMessage:UserType = this.state.studentCurrentlyBeingSentMessage &&
      {
        id: this.state.studentCurrentlyBeingSentMessage.userEntityId,
        firstName: this.state.studentCurrentlyBeingSentMessage.firstName,
        lastName: this.state.studentCurrentlyBeingSentMessage.lastName,
        nickName: this.state.studentCurrentlyBeingSentMessage.nickName,
        studyProgrammeName: this.state.studentCurrentlyBeingSentMessage.studyProgrammeName,
      }
  
  let inactiveStudents = this.props.workspace && this.props.workspace.students &&
  this.props.workspace.students
  .filter(s=>!s.active)
  .map(s=><Student key={s.userEntityId} student={s} {...this.props}/>);
  
  let activeStudents = this.props.workspace && this.props.workspace.students &&
  this.props.workspace.students
  .filter(s=>s.active)
  .map(s=><Student key={s.userEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props}/>);
    
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
        
        <Tabs onTabChange={this.onTabChange} activeTab={this.state.activeTab} tabs={[
          {
            id: "ACTIVE",
            name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
            component: ()=>{
              let activeStudents = this.props.workspace && this.props.workspace.students &&
                this.props.workspace.students
                .filter(s=>s.active)
                .map(s=><Student key={s.userEntityId} student={s} onSendMessage={this.onSendMessageTo.bind(this, s)} {...this.props}/>);
              
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
                .map(s=><Student key={s.userEntityId} student={s} {...this.props}/>);
              
              return <div className="loader-empty">
                {this.props.workspace && this.props.workspace.students ? (
                  inactiveStudents.length ? inactiveStudents : <div>{this.props.i18n.text.get('TODO no inactive students')}</div>
                ): null}
              </div>
            }
          }
        ]}/>
      </div>
<div className="loader-empty">
{this.props.workspace && this.props.workspace.students ? (
  inactiveStudents.length ? inactiveStudents : <div>{this.props.i18n.text.get('TODO no inactive students')}</div>
): null}
</div>
<div className="loader-empty">
{this.props.workspace && this.props.workspace.students ? (
  activeStudents.length ? activeStudents : <div>{this.props.i18n.text.get('TODO no active students')}</div>
): null}
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
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({toggleActiveStateOfStudentOfWorkspace}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceUsers);