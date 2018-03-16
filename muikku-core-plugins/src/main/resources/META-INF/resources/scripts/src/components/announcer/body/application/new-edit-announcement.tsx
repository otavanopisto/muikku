import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/jumbo-dialog';
import { UserRecepientType, WorkspaceRecepientType, UserIndexType, UserGroupRecepientType } from '~/reducers/main-function/user-index';
import { i18nType } from 'reducers/base/i18n';
import { AnnouncementType } from '~/reducers/main-function/announcer/announcements';
import { AnyActionType } from '~/actions';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { WorkspaceType } from '~/reducers/main-function/workspaces';
import { loadUserGroupIndex, LoadUserGroupIndexTriggerType } from '~/actions/main-function/user-index';
import { createAnnouncement, CreateAnnouncementTriggerType,
  updateAnnouncement, UpdateAnnouncementTriggerType } from '~/actions/main-function/announcer/announcements';
import {StateType} from '~/reducers';

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
  draftKey: 'announcer-new-edit-announcement',
  resize_enabled: false
}
const extraPlugins = {
  'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
  'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
  'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js',
  'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
  'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
}

type TargetItemsListType = Array<WorkspaceRecepientType | UserGroupRecepientType>;

interface NewEditAnnouncementProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  announcement?: AnnouncementType,
  loadUserGroupIndex: LoadUserGroupIndexTriggerType,
  userIndex: UserIndexType,
  createAnnouncement: CreateAnnouncementTriggerType,
  updateAnnouncement: UpdateAnnouncementTriggerType
}

interface NewEditAnnouncementState {
  text: string,
  currentTarget: TargetItemsListType,
  subject: string,
  locked: boolean,
  startDate: any,
  endDate: any
}


class NewEditAnnouncement extends React.Component<NewEditAnnouncementProps, NewEditAnnouncementState> {
  private baseAnnouncementCurrentTarget: TargetItemsListType;
  constructor(props: NewEditAnnouncementProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setTargetItems = this.setTargetItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.loadUserGroups = this.loadUserGroups.bind(this);
    
    this.baseAnnouncementCurrentTarget = props.announcement ? props.announcement.workspaces.map((w)=>{
      //NOTE this workspace type is incomplete, but should do the job regardless
      return {
        type: "workspace",
        value: w
      } as WorkspaceRecepientType;
    }) : [];
    
    this.state = {
      text: props.announcement ? props.announcement.content : "",
      currentTarget: props.announcement ? this.baseAnnouncementCurrentTarget : [],
      subject: props.announcement ? props.announcement.caption : "",
      locked: false,
      startDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.startDate) : props.i18n.time.getLocalizedMoment(),
      endDate: props.announcement ? props.i18n.time.getLocalizedMoment(this.props.announcement.endDate) : props.i18n.time.getLocalizedMoment().add(1, "day")
    }
  }
  loadUserGroups(announcement: AnnouncementType){
    announcement.userGroupEntityIds.forEach(this.props.loadUserGroupIndex);
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
      })
      
      this.setState({
        subject: nextProps.announcement.caption,
        text: nextProps.announcement.content,
        currentTarget: this.baseAnnouncementCurrentTarget,
        startDate: nextProps.i18n.time.getLocalizedMoment(this.props.announcement.startDate),
        endDate: nextProps.i18n.time.getLocalizedMoment(this.props.announcement.endDate)
      });
      
      this.loadUserGroups(nextProps.announcement);
    } else if (this.props.announcement && !nextProps.announcement){
      this.baseAnnouncementCurrentTarget = [];
      
      this.setState({
        subject: "",
        text: "",
        currentTarget: [],
        startDate: nextProps.i18n.time.getLocalizedMoment(),
        endDate: nextProps.i18n.time.getLocalizedMoment().add(1, "day"),
      });
    }
    
    if (nextProps.userIndex.groups !== this.props.userIndex.groups && nextProps.announcement){
      this.setState({
        currentTarget: nextProps.announcement.userGroupEntityIds
         .filter(groupId=>nextProps.userIndex.groups[groupId])
         .map((groupId: number)=>{
            return {
              type: "usergroup",
              value: nextProps.userIndex.groups[groupId]
            } as UserGroupRecepientType 
          }).concat(this.baseAnnouncementCurrentTarget as any)
      });
    }
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
          publiclyVisible: false,
          endDate: this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w=>w.type==="usergroup").map(w=>(w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w=>w.type==="workspace").map(w=>(w.value as any).id),
        },
        success: ()=>{
          this.setState({locked: false});
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
          publiclyVisible: false,
          endDate: this.state.endDate.format("YYYY-MM-DD"),
          startDate: this.state.startDate.format("YYYY-MM-DD"),
          userGroupEntityIds: this.state.currentTarget.filter(w=>w.type==="usergroup").map(w=>(w.value as any).id),
          workspaceEntityIds: this.state.currentTarget.filter(w=>w.type==="workspace").map(w=>(w.value as any).id),
        },
        success: ()=>{
          this.setState({locked: false, subject: "", text: "",
            startDate: this.props.i18n.time.getLocalizedMoment(),
            endDate: this.props.i18n.time.getLocalizedMoment().add(1, "day"),
            currentTarget: []});
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
      (<div className="container container--new-announcement-options" key="1">
         <DatePicker selected={this.state.startDate} onChange={this.handleDateChange.bind(this, "startDate")}
           locale={this.props.i18n.time.getLocale()}/>
         <div className="text text--announcer-times-decor">-</div>                   
         <DatePicker selected={this.state.endDate} onChange={this.handleDateChange.bind(this, "endDate")}
           locale={this.props.i18n.time.getLocale()}/>
      </div>),
      (<InputContactsAutofill modifier="new-announcement-recipients" key="2" hasUserPermission={false} placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.currentTarget} onChange={this.setTargetItems} autofocus={!this.props.announcement}></InputContactsAutofill>),
      (<input key="3" type="text" className="container container--new-announcement-topic form-field form-field--new-announcement-topic"
        placeholder={this.props.i18n.text.get('plugin.announcer.editannouncement.title.label')}
        value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.announcement}/>),
      (<CKEditor key="4" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
       onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>)
    ]
      
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.announcer.createannouncement.button.cancel')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.createOrModifyAnnouncement.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.announcer.createannouncement.button.send')}
          </Link> 
        </div>
      )
    }
    
    return <JumboDialog modifier="new-edit-announcement"
      onOpen={this.props.announcement ? this.loadUserGroups.bind(this, this.props.announcement) : null}
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
    userIndex: state.userIndex
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({loadUserGroupIndex, createAnnouncement, updateAnnouncement}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEditAnnouncement);