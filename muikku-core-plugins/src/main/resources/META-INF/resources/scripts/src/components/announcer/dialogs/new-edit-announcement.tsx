import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/environment-dialog';
import { UserRecepientType, WorkspaceRecepientType, UserIndexType, UserGroupRecepientType } from '~/reducers/user-index';
import { i18nType } from 'reducers/base/i18n';
import { AnnouncementType } from '~/reducers/announcements';
import { AnyActionType } from '~/actions';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { WorkspaceType, WorkspacesType } from '~/reducers/workspaces';
import { loadUserGroupIndex, LoadUserGroupIndexTriggerType } from '~/actions/user-index';
import { createAnnouncement, CreateAnnouncementTriggerType,
  updateAnnouncement, UpdateAnnouncementTriggerType } from '~/actions/announcements';
import {StateType} from '~/reducers';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';
import { CKEDITOR_VERSION } from '~/lib/ckeditor';

const ckEditorConfig = {
  uploadUrl: '/communicatorAttachmentUploadServlet',
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ],
  resize_enabled: false
}
const extraPlugins = {
  'widget': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/${CKEDITOR_VERSION}/`,
  'lineutils': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/${CKEDITOR_VERSION}/`,
  'filetools' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/${CKEDITOR_VERSION}/`,
  'notification' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/${CKEDITOR_VERSION}/`,
  'notificationaggregator' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/${CKEDITOR_VERSION}/`,
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'uploadwidget' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/${CKEDITOR_VERSION}/`,
  'uploadimage' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/${CKEDITOR_VERSION}/`
}

type TargetItemsListType = Array<WorkspaceRecepientType | UserGroupRecepientType>;

interface NewEditAnnouncementProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  announcement?: AnnouncementType,
  loadUserGroupIndex: LoadUserGroupIndexTriggerType,
  userIndex: UserIndexType,
  createAnnouncement: CreateAnnouncementTriggerType,
  updateAnnouncement: UpdateAnnouncementTriggerType,
  status: StatusType,
  
  workspaceId: number,
  workspaces: WorkspacesType
}

interface NewEditAnnouncementState {
  text: string,
  currentTarget: TargetItemsListType,
  subject: string,
  locked: boolean,
  startDate: any,
  endDate: any
}

class NewEditAnnouncement extends SessionStateComponent<NewEditAnnouncementProps, NewEditAnnouncementState> {
  private baseAnnouncementCurrentTarget: TargetItemsListType;
  constructor(props: NewEditAnnouncementProps){
    super(props, "new-edit-announcement");
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setTargetItems = this.setTargetItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.loadUserGroups = this.loadUserGroups.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    
    this.baseAnnouncementCurrentTarget = props.announcement ? props.announcement.workspaces.map((w)=>{
      //NOTE this workspace type is incomplete, but should do the job regardless
      return {
        type: "workspace",
        value: w
      } as WorkspaceRecepientType;
    }) : [];
    
    this.baseAnnouncementCurrentTarget = this.baseAnnouncementCurrentTarget.concat(this.getPredefinedWorkspaceByIdToConcat(props));
    
    this.state = this.getRecoverStoredState({
      text: props.announcement ? props.announcement.content : "",
      currentTarget: props.announcement ? this.baseAnnouncementCurrentTarget : [],
      subject: props.announcement ? props.announcement.caption : "",
      locked: false,
      startDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.startDate) : props.i18n.time.getLocalizedMoment(),
      endDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.endDate) : props.i18n.time.getLocalizedMoment().add(1, "day")
    }, (props.announcement ? props.announcement.id + "-" : "") + (props.workspaceId || ""));
  }
  loadUserGroups(announcement: AnnouncementType){
    announcement.userGroupEntityIds.forEach(this.props.loadUserGroupIndex);
  }
  checkAgainstStoredState(){
    if (this.props.announcement){
      this.checkStoredAgainstThisState({
        subject: this.props.announcement.caption,
        text: this.props.announcement.content,
        startDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.startDate),
        endDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.endDate)
      }, this.props.announcement.id + "-" + (this.props.workspaceId || ""));
      
      let userGroupEntityIds = this.state.currentTarget.filter(w=>w.type==="usergroup").map(w=>(w.value as any).id);
      let workspaceEntityIds = this.state.currentTarget.filter(w=>w.type==="workspace").map(w=>(w.value as any).id);
      
      if (JSON.stringify(this.props.announcement.userGroupEntityIds) !== JSON.stringify(userGroupEntityIds) ||
          JSON.stringify(this.props.announcement.workspaceEntityIds) !== JSON.stringify(workspaceEntityIds)){
        this.forceRecovered();
      }
    } else {
      this.checkStoredAgainstThisState({
        subject: "",
        text: "",
        currentTarget: [],
        startDate: this.props.i18n.time.getLocalizedMoment(),
        endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
      }, this.props.workspaceId || "");
    }
  }
  clearUp(){
    if (!this.props.announcement){
      this.baseAnnouncementCurrentTarget = [];
      this.setStateAndClear({subject: "", text: "",
        startDate: this.props.i18n.time.getLocalizedMoment(),
        endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
        currentTarget: []}, this.props.announcement.id + "-" + (this.props.workspaceId || "")
      );
    } else {
      this.baseAnnouncementCurrentTarget = this.props.announcement.workspaces.map(w=>{
        //NOTE this workspace type is incomplete, but should do the job regardless
        return {
          type: "workspace",
          value: w
        } as WorkspaceRecepientType
      });
      this.setStateAndClear({
        subject: this.props.announcement.caption,
        text: this.props.announcement.content,
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.startDate),
        endDate: this.props.i18n.time.getLocalizedMoment(this.props.announcement.endDate)
      }, this.props.workspaceId || "");
      
      this.setUpGroupEntitiesIds();
    }
  }
  getPredefinedWorkspaceByIdToConcat(props: NewEditAnnouncementProps){
    if (!props.workspaces || !props.workspaceId || props.announcement){
      return [];
    }
    
    let workpaceFound = props.workspaces && props.workspaces.currentWorkspace && props.workspaces.currentWorkspace.id === props.workspaceId 
    ? props.workspaces.currentWorkspace :
    (props.workspaces && props.workspaces.availableWorkspaces.concat(props.workspaces.userWorkspaces).find(w=>w.id === props.workspaceId));
  
    if (workpaceFound){
      return [{
        type: "workspace",
        value: workpaceFound
      } as WorkspaceRecepientType];
    }
    
    return [];
  }
  componentWillReceiveProps(nextProps: NewEditAnnouncementProps){
    if ((this.props.announcement && nextProps.announcement && nextProps.announcement.id !== this.props.announcement.id) ||
        (!this.props.announcement && nextProps.announcement)){
      
      this.baseAnnouncementCurrentTarget = nextProps.announcement.workspaces.map(w=>{
        //NOTE this workspace type is incomplete, but should do the job regardless
        return {
          type: "workspace",
          value: w
        } as WorkspaceRecepientType
      });
      
      this.setState(this.getRecoverStoredState({
        subject: nextProps.announcement.caption,
        text: nextProps.announcement.content,
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: nextProps.i18n.time.getLocalizedMoment(nextProps.announcement.startDate),
        endDate: nextProps.i18n.time.getLocalizedMoment(nextProps.announcement.endDate)
      }, nextProps.announcement.id + "-" + (nextProps.workspaceId || "")));
      
      this.loadUserGroups(nextProps.announcement);
    } else if (this.props.announcement && !nextProps.announcement){
      this.baseAnnouncementCurrentTarget = this.getPredefinedWorkspaceByIdToConcat(nextProps);
      
      this.setState(this.getRecoverStoredState({
        subject: "",
        text: "",
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: nextProps.i18n.time.getLocalizedMoment(),
        endDate: nextProps.i18n.time.getLocalizedMoment().add(1, "day"),
      }, nextProps.workspaceId || ""));
    } else if (nextProps.workspaceId !== this.props.workspaceId || nextProps.workspaces !== this.props.workspaces && !nextProps.announcement){
      //Searching for the workspace in current workspace, available workspaces and user workspaces, anywhere possible to find it
      this.baseAnnouncementCurrentTarget = this.getPredefinedWorkspaceByIdToConcat(nextProps);
      
      this.setState(this.getRecoverStoredState({
        currentTarget: this.baseAnnouncementCurrentTarget,
      }, nextProps.workspaceId || ""));
    }
    
    if (nextProps.userIndex.groups !== this.props.userIndex.groups && nextProps.announcement && !this.recovered){
      this.setUpGroupEntitiesIds(nextProps);
    }
  }
  
  setUpGroupEntitiesIds(props:NewEditAnnouncementProps = this.props){
    this.setState({
      currentTarget: props.announcement.userGroupEntityIds
       .filter(groupId=>props.userIndex.groups[groupId])
       .map((groupId: number)=>{
          return {
            type: "usergroup",
            value: props.userIndex.groups[groupId]
          } as UserGroupRecepientType 
        }).concat(this.baseAnnouncementCurrentTarget as any)
    });
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  setTargetItems(currentTarget: TargetItemsListType){
    this.setState({currentTarget});
  }
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({subject: e.target.value});
  }
  createOrModifyAnnouncement(closeDialog: ()=>any){
    this.setState({locked: true});
    if (this.props.announcement){
      this.props.updateAnnouncement({
        announcement: this.props.announcement,
        update: {
          archived: false,
          caption: this.state.subject,
          content: this.state.text,
          publiclyVisible: this.state.currentTarget.length===0 ? true : false,
          endDate: this.state.endDate && this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate && this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w=>w.type==="usergroup").map(w=>(w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w=>w.type==="workspace").map(w=>(w.value as any).id),
        },
        success: ()=>{
          this.setStateAndClear({
            ...this.state,
            locked: false
          }, this.props.announcement.id + "-" + (this.props.workspaceId || ""));
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    } else {
      this.props.createAnnouncement({
        announcement: {
          caption: this.state.subject,
          content: this.state.text,
          publiclyVisible: this.state.currentTarget.length===0 ? true : false,
          endDate: this.state.endDate && this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate && this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w=>w.type==="usergroup").map(w=>(w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w=>w.type==="workspace").map(w=>(w.value as any).id),
        },
        success: ()=>{
          this.setStateAndClear({locked: false, subject: "", text: "",
            startDate: this.props.i18n.time.getLocalizedMoment(),
            endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
            currentTarget: []}, this.props.workspaceId || "");
          closeDialog();
        },
        fail: ()=>{
          this.setState({locked: false});
        }
      });
    }
  }
  handleDateChange(stateLocation: string, newDate: any){
    let nState:any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
  }
  render(){
    let content = (closeDialog: ()=>any) => [
      //FOR DESIGN CHECK https://github.com/Hacker0x01/react-datepicker
      (<div className="env-dialog__row env-dialog__row--new-announcement-options" key="1">
        <div className="env-dialog__form-element-container env-dialog__form-element-container--datepicker">  
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.startdate.label')}</div>          
           <DatePicker className="env-dialog__input env-dialog__input--date-picker" selected={this.state.startDate} onChange={this.handleDateChange.bind(this, "startDate")}
             locale={this.props.i18n.time.getLocale()}/>
         </div>
         <div className="env-dialog__form-element-container env-dialog__form-element-container--datepicker">  
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.enddate.label')}</div>         
           <DatePicker className="env-dialog__input env-dialog__input--date-picker" selected={this.state.endDate} onChange={this.handleDateChange.bind(this, "endDate")}
           locale={this.props.i18n.time.getLocale()}/>
        </div>
      </div>),
      (<InputContactsAutofill modifier="new-announcement-recipients" key="2" hasUserPermission={false}
          hasGroupPermission={this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_GROUPS}
          hasWorkspacePermission={this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_WORKSPACES}
          workspacePermissionIsOnlyMyWorkspaces={!this.props.status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT}
          placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.currentTarget} onChange={this.setTargetItems} autofocus={!this.props.announcement}></InputContactsAutofill>),
      (
      <div className="env-dialog__row" key="3">    
       <div className="env-dialog__form-element-container  env-dialog__form-element-container--title">  
         <div className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.title.label')}</div>          
         <input type="text" className="env-dialog__input"          
          value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.announcement}/>
       </div>   
      </div>
      ),
      (
      <div className="env-dialog__row" key="4">    
        <div className="env-dialog__form-element-container">  
          <div className="env-dialog__label">{this.props.i18n.text.get('plugin.announcer.createannouncement.content.label')}</div>          
          <CKEditor width="100%" height="210" configuration={ckEditorConfig} extraPlugins={extraPlugins}
         onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
        </div>       
      </div>
      )
    ]      
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="env-dialog__actions">
          <Button className="button button--dialog-execute" onClick={this.createOrModifyAnnouncement.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get(this.props.announcement ?
                'plugin.announcer.editannouncement.button.send' : 'plugin.announcer.createannouncement.button.send')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.announcer.createannouncement.button.cancel')}
          </Button>            
          {this.recovered ? <Button buttonModifiers="dialog-clear" onClick={this.clearUp} disabled={this.state.locked}>
              {this.props.i18n.text.get('plugin.announcer.createannouncement.button.clearDraft')}
          </Button> : null}            
        </div>
      )
    }
    
    return <JumboDialog modifier="new-edit-announcement"
      onOpen={this.props.announcement ? ()=>{this.loadUserGroups(this.props.announcement); this.checkAgainstStoredState()} : this.checkAgainstStoredState}
      title={this.props.announcement ?
        this.props.i18n.text.get('plugin.announcer.editannouncement.topic') :
        this.props.i18n.text.get('plugin.announcer.createannouncement.topic')}
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    userIndex: state.userIndex,
    status: state.status,
    
    //For use with workspaces when announcement gives a workspace
    //it needs to be fetched from somewhere
    workspaceId: state.announcements.workspaceId,
    workspaces: state.workspaces
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({loadUserGroupIndex, createAnnouncement, updateAnnouncement}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEditAnnouncement);
