import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/jumbo-dialog';
import {sendMessage, SendMessageTriggerType} from '~/actions/main-function/communicator/communicator-messages';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import { DiscussionAreaListType } from '~/reducers/main-function/discussion/discussion-areas';
import { DiscussionType, DiscussionThreadType } from '~/reducers/main-function/discussion/discussion-threads';
import { createDiscussionThread, CreateDiscussionThreadTriggerType } from '~/actions/main-function/discussion/discussion-threads';

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
  draftKey: 'discussion-new-message',
  resize_enabled: false
}
const extraPlugins = {
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js'
}

interface DicussionNewThreadProps {
  children: React.ReactElement<any>,
  areas: DiscussionAreaListType,
  i18n: i18nType,
  discussionThreads: DiscussionType,
  createDiscussionThread: CreateDiscussionThreadTriggerType,
  thread: DiscussionThreadType
}

interface DicussionNewThreadState {
  text: string,
  title: string,
  locked: boolean,
  threadPinned: boolean,
  threadLocked: boolean
}

class DicussionNewThread extends React.Component<DicussionNewThreadProps, DicussionNewThreadState> {
  constructor(props: DicussionNewThreadProps){
    super(props);
    
    this.state = {
      text: this.props.thread.message,
      title: this.props.thread.title,
      locked: false,
      threadPinned: this.props.thread.sticky,
      threadLocked: this.props.thread.locked
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
  componentWillReceiveProps(nextProps: DicussionNewThreadProps){
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
        <input className="form-field form-field--new-discussion-title" placeholder="TODO translate title"
          value={this.state.title} onChange={this.onTitleChange}/>
      </div>,
      <div key="2" className="container container--new-discussion-checkboxs">
        <span className="text text--for-checkbox-discussion">TODO translate Pinned</span>
        <input type="checkbox" className="form-field" checked={this.state.threadPinned} onChange={this.togglePinned}/>
        <span className="text text--for-checkbox-discussion">TODO translate Locked</span>
        <input type="checkbox" className="form-field" checked={this.state.threadLocked} onChange={this.toggleLocked}/>
      </div>,
      <CKEditor key="3" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
        onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
            TODO cancel
          </Link>
          <Link className="button button--standard-ok" onClick={this.modifyThread.bind(this, closeDialog)}>
            TODO ok
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="modify-message"
      title="TODO modify thread"
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: any){
  return {
    areas: state.areas,
    i18n: state.i18n,
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({sendMessage, createDiscussionThread}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(DicussionNewThread);