import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import { DiscussionType, DiscussionThreadType } from '~/reducers/discussion';
import { createDiscussionThread, CreateDiscussionThreadTriggerType, modifyDiscussionThread, ModifyDiscussionThreadTriggerType } from '~/actions/discussion';
import {StateType} from '~/reducers';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';

import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';

interface ModifyThreadProps {
  children: React.ReactElement<any>,
  i18n: i18nType,
  discussion: DiscussionType,
  thread: DiscussionThreadType,
  modifyDiscussionThread: ModifyDiscussionThreadTriggerType,
  status: StatusType
}

interface ModifyThreadState {
  text: string,
  title: string,
  locked: boolean,
  threadPinned: boolean,
  threadLocked: boolean
}

class ModifyThread extends SessionStateComponent<ModifyThreadProps, ModifyThreadState> {
  constructor(props: ModifyThreadProps){
    super(props, "discussion-modify-thread-dialog");

    this.state = this.getRecoverStoredState({
      text: props.thread.message,
      title: props.thread.title,
      locked: false,
      threadPinned: props.thread.sticky,
      threadLocked: props.thread.locked
    }, props.thread.id);

    this.togglePinned = this.togglePinned.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.modifyThread = this.modifyThread.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    this.clearUp = this.clearUp.bind(this);
  }
  checkAgainstStoredState(){
    this.checkStoredAgainstThisState({
      text: this.props.thread.message,
      title: this.props.thread.title,
      threadPinned: this.props.thread.sticky,
      threadLocked: this.props.thread.locked
    }, this.props.thread.id);
  }
  onCKEditorChange(text: string){
    this.setStateAndStore({text}, this.props.thread.id);
  }
  clearUp(){
    this.setStateAndClear({
      text: this.props.thread.message,
      title: this.props.thread.title,
      threadPinned: this.props.thread.sticky,
      threadLocked: this.props.thread.locked
    }, this.props.thread.id);
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
        this.justClear(["text", "title", "threadPinned", "threadLocked"], this.props.thread.id);
        this.setState({locked: false});
        closeDialog();
      },
      fail: ()=>{
        this.setState({locked: false});
      }
    });
  }
  onTitleChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setStateAndStore({title: e.target.value}, this.props.thread.id);
  }
  togglePinned(){
    this.setStateAndStore({threadPinned: !this.state.threadPinned}, this.props.thread.id);
  }
  toggleLocked(){
    this.setStateAndStore({threadLocked: !this.state.threadLocked}, this.props.thread.id);
  }
  componentWillReceiveProps(nextProps: ModifyThreadProps){
    if (nextProps.thread.id !== this.props.thread.id){
      this.setState(this.getRecoverStoredState({
        text: nextProps.thread.message,
        title: nextProps.thread.title,
        threadPinned: nextProps.thread.sticky,
        threadLocked: nextProps.thread.locked
      }, nextProps.thread.id));
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => [
       <div key="1" className="env-dialog__row env-dialog__row--new-discussion-options">
         <div className="env-dialog__form-element-container">
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.title')}</div>
           <input className="env-dialog__input env-dialog__input--new-discussion-thread-title" placeholder={this.props.i18n.text.get('plugin.discussion.createmessage.title')}
             value={this.state.title} onChange={this.onTitleChange} autoFocus/>
         </div>
       </div>,
       (this.props.status.permissions.FORUM_LOCK_STICKY_PERMISSION ? <div key="2" className="env-dialog__row  env-dialog__row--new-discussion-thread-states">
         <div className="env-dialog__form-element-container env-dialog__form-element-container--pinned-thread">
           <input type="checkbox" className="env-dialog__input" checked={this.state.threadPinned} onChange={this.togglePinned}/>
           <span className="env-dialog__input-label">{this.props.i18n.text.get('plugin.discussion.createmessage.pinned')}</span>
         </div>
         <div className="env-dialog__form-element-container env-dialog__form-element-container--locked-thread">
           <input type="checkbox" className="env-dialog__input" checked={this.state.threadLocked} onChange={this.toggleLocked}/>
           <span className="env-dialog__input-label">{this.props.i18n.text.get('plugin.discussion.createmessage.locked')}</span>
        </div>
       </div> : null),
       <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
         <div className="env-dialog__form-element-container">
           <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.content')}</div>
           <CKEditor key="3" onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
         </div>
       </div>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (
        <div className="env-dialog__actions">
          <Button buttonModifiers="dialog-execute" onClick={this.modifyThread.bind(this, closeDialog)} disabled={this.state.locked}>
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

    return <JumboDialog modifier="modify-message"
      title={this.props.i18n.text.get('plugin.discussion.editmessage.topic')}
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
  return bindActionCreators({modifyDiscussionThread}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyThread);
