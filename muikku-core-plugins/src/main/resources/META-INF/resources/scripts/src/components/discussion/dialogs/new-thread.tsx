import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import JumboDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import { DiscussionType } from '~/reducers/discussion';
import { createDiscussionThread, CreateDiscussionThreadTriggerType } from '~/actions/discussion';
import {StateType} from '~/reducers';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';
import { CKEDITOR_VERSION } from '~/lib/ckeditor';

import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';

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

interface DicussionNewThreadProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  discussion: DiscussionType,
  createDiscussionThread: CreateDiscussionThreadTriggerType,
  status: StatusType
}

interface DicussionNewThreadState {
  text: string,
  title: string,
  locked: boolean,
  threadPinned: boolean,
  threadLocked: boolean,
  selectedAreaId: number
}

class DicussionNewThread extends SessionStateComponent<DicussionNewThreadProps, DicussionNewThreadState> {
  constructor(props: DicussionNewThreadProps){
    super(props, "discussion-new-thread");
    
    this.state = this.getRecoverStoredState({
      text: "",
      title: "",
      locked: false,
      threadPinned: false,
      threadLocked: false,
      selectedAreaId: props.discussion.areaId || (props.discussion.areas[0] && props.discussion.areas[0].id)
    }, props.discussion.areaId || (props.discussion.areas[0] && props.discussion.areas[0].id));
    
    this.togglePinned = this.togglePinned.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onAreaChange = this.onAreaChange.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
  }
  checkAgainstStoredState(){  
    this.checkStoredAgainstThisState({
      text: "",
      title: "",
      threadPinned: false,
      threadLocked: false,
    }, this.state.selectedAreaId);
  }
  clearUp(){
    this.setStateAndClear({
      text: "",
      title: "",
      threadPinned: false,
      threadLocked: false,
    }, this.state.selectedAreaId);
  }
  onCKEditorChange(text: string){
    this.setStateAndStore({text}, this.state.selectedAreaId);
  }
  createThread(closeDialog: ()=>any){
    this.setState({
      locked: true
    });
    this.props.createDiscussionThread({
      forumAreaId: this.state.selectedAreaId,
      locked: this.state.threadLocked,
      sticky: this.state.threadPinned,
      message: this.state.text,
      title: this.state.title,
      success: ()=>{
        this.setStateAndClear({
          text: "",
          title: "",
          locked: false,
          threadLocked: false,
          threadPinned: false
        }, this.state.selectedAreaId);
        closeDialog();
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      }
    });
  }
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setStateAndStore({title: e.target.value}, this.state.selectedAreaId);
  }
  togglePinned(){
    this.setStateAndStore({threadPinned: !this.state.threadPinned}, this.state.selectedAreaId);
  }
  toggleLocked(){
    this.setStateAndStore({threadLocked: !this.state.threadLocked}, this.state.selectedAreaId);
  }
  componentWillReceiveProps(nextProps: DicussionNewThreadProps){
    if ((nextProps.discussion.areaId !== this.state.selectedAreaId && nextProps.discussion.areaId) || !this.state.selectedAreaId){
      this.setState(this.getRecoverStoredState({
        text: "",
        title: "",
        locked: false,
        threadPinned: false,
        threadLocked: false,
        selectedAreaId: nextProps.discussion.areaId || (nextProps.discussion.areas[0] && nextProps.discussion.areas[0].id)
      }, nextProps.discussion.areaId || (nextProps.discussion.areas[0] && nextProps.discussion.areas[0].id)));
    }
  }
  onAreaChange(e: React.ChangeEvent<HTMLSelectElement>){
    let newSelectedAreaId = parseInt(e.target.value);
    this.justClear(["text", "title", "threadPinned", "threadLocked"], this.state.selectedAreaId);
    this.setStateAndStore(this.getRecoverStoredState({
      text: this.state.text,
      title: this.state.title,
      threadPinned: this.state.threadPinned,
      threadLocked: this.state.threadLocked
    }, newSelectedAreaId), newSelectedAreaId);
    this.setState({
      selectedAreaId: newSelectedAreaId
    });
  }
  render(){
    let content = (closeDialog: ()=>any) => [
       <div key="1" className="env-dialog__row env-dialog__row---new-discussion-options">
         <div className="env-dialog__form-element-container">  
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.title')}</div>       
           <input className="env-dialog__input env-dialog__input--new-discussion-thread-title" 
           value={this.state.title} onChange={this.onTitleChange} autoFocus/>
         </div>
         <div className="env-dialog__form-element-container">  
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.area')}</div>       
           <select className="env-dialog__select" value={this.state.selectedAreaId} onChange={this.onAreaChange}>
            {this.props.discussion.areas.map((area)=><option key={area.id} value={area.id}>
              {area.name}
             </option>)}
           </select>
         </div>
       </div>,
       (this.props.status.permissions.FORUM_LOCK_STICKY_PERMISSION ? <div key="2" className="env-dialog__row  env-dialog__row--new-discussion-thread-states">
         <input type="checkbox" className="env-dialog__input" checked={this.state.threadPinned} onChange={this.togglePinned}/>
         <span className="env-dialog__input-label">{this.props.i18n.text.get('plugin.discussion.createmessage.pinned')}</span>
         <input type="checkbox" className="env-dialog__input" checked={this.state.threadLocked} onChange={this.toggleLocked}/>
         <span className="env-dialog__input-label">{this.props.i18n.text.get('plugin.discussion.createmessage.locked')}</span>
       </div> : <div key="2" className="env-dialog__row env-dialog__row--new-discussion-thread-states"/>),
       <div className="env-dialog__row" key="3">     
         <div className="env-dialog__form-element-container">
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.content')}</div>
           <CKEditor key="3" width="100%" height="210" configuration={ckEditorConfig} extraPlugins={extraPlugins}
           onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
         </div>
       </div>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
        <div className="env-dialog__actions">
         <Button buttonModifiers="dialog-execute" onClick={this.createThread.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.send')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.cancel')}
          </Button>
          {this.recovered ? <Button buttonModifiers="dialog-clear" onClick={this.clearUp} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.clearDraft')}
          </Button> : null}
        </div>
      )
    }    
    return <JumboDialog modifier="new-message"
      title={this.props.i18n.text.get('plugin.discussion.createmessage.topic')}
      content={content} footer={footer} onOpen={this.checkAgainstStoredState}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussion: state.discussion,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({createDiscussionThread}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DicussionNewThread);
