import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import { DiscussionType, DiscussionThreadType } from '~/reducers/main-function/discussion';
import { createDiscussionThread, CreateDiscussionThreadTriggerType, modifyDiscussionThread, ModifyDiscussionThreadTriggerType } from '~/actions/main-function/discussion';
import {StateType} from '~/reducers';

const ckEditorConfig = {
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ],
  draftKey: 'discussion-modify-thread',
  resize_enabled: false
}
const extraPlugins = {
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js'
}

interface ModifyThreadProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  discussion: DiscussionType,
  thread: DiscussionThreadType,
  modifyDiscussionThread: ModifyDiscussionThreadTriggerType
}

interface ModifyThreadState {
  text: string,
  title: string,
  locked: boolean,
  threadPinned: boolean,
  threadLocked: boolean
}

class ModifyThread extends React.Component<ModifyThreadProps, ModifyThreadState> {
  constructor(props: ModifyThreadProps){
    super(props);
    
    this.state = {
      text: props.thread.message,
      title: props.thread.title,
      locked: false,
      threadPinned: props.thread.sticky,
      threadLocked: props.thread.locked
    }
    
    this.togglePinned = this.togglePinned.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.modifyThread = this.modifyThread.bind(this);
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  modifyThread(closeDialog: ()=>any){
    if (this.state.locked){
      return;
    }
    this.setState({locked: true});
    
    this.props.modifyDiscussionThread({
      thread: this.props.thread,
      title: this.state.title,
      message: this.state.text,
      sticky: this.state.threadPinned,
      locked: this.state.threadLocked,
      success: ()=>{
        this.setState({locked: false});
        closeDialog();
      },
      fail: ()=>{
        this.setState({locked: false});
      }
    });
  }
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({title: e.target.value});
  }
  togglePinned(){
    this.setState({threadPinned: !this.state.threadPinned});
  }
  toggleLocked(){
    this.setState({threadLocked: !this.state.threadLocked});
  }
  componentWillReceiveProps(nextProps: ModifyThreadProps){
    if (nextProps.thread.id !== this.props.thread.id){
      this.setState({
        text: nextProps.thread.message,
        title: nextProps.thread.title,
        threadPinned: nextProps.thread.sticky,
        threadLocked: nextProps.thread.locked
      });
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => [
       <div key="1" className="container container--new-discussion-options">
         <input className="environment-dialog__form-element environment-dialog__form-element--new-discussion-thread-title" placeholder={this.props.i18n.text.get('plugin.discussion.createmessage.title')}
           value={this.state.title} onChange={this.onTitleChange} autoFocus/>
       </div>,       
       <div key="2" className="container container--new-discussion-thread-states">
         <span className="text text--new-discussion-create-state">{this.props.i18n.text.get('plugin.discussion.createmessage.pinned')}</span>
         <input type="checkbox" className="environment-dialog__form-element" checked={this.state.threadPinned} onChange={this.togglePinned}/>
         <span className="text text--new-discussion-create-state">{this.props.i18n.text.get('plugin.discussion.createmessage.locked')}</span>
         <input type="checkbox" className="environment-dialog__form-element" checked={this.state.threadLocked} onChange={this.toggleLocked}/>
       </div>,
       <CKEditor key="3" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
         onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="environment-dialog__button-container">
          <Link className="button button-dialog--execute" onClick={this.modifyThread.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.send')}
          </Link>
          <Link className="button button-dialog--cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.cancel')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="modify-message"
      title={this.props.i18n.text.get('plugin.discussion.editarea.topic')}
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    discussion: state.discussion
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({modifyDiscussionThread}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyThread);