import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import Link from "~/components/general/link";
import JumboDialog from "~/components/general/environment-dialog";
import { replyToCurrentDiscussionThread, ReplyToCurrentDiscussionThreadTriggerType } from "~/actions/main-function/discussion";
import {StateType} from '~/reducers';
import SessionStateComponent from '~/components/general/session-state-component';
import Button from '~/components/general/button';
import { CKEDITOR_VERSION } from '~/lib/ckeditor';

interface ReplyThreadProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  reply?: DiscussionThreadReplyType,
  quote?: string,
  quoteAuthor?: string,
  currentId: number,
  replyToCurrentDiscussionThread: ReplyToCurrentDiscussionThreadTriggerType,
}

interface ReplyThreadState {
  text: string,
  locked: boolean
}

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

class ReplyThread extends SessionStateComponent<ReplyThreadProps, ReplyThreadState> {
  constructor(props: ReplyThreadProps){
    super(props, "discussion-reply-thread");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.createReply = this.createReply.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);

    this.state = this.getRecoverStoredState({
      locked: false,
      text: (props.quote && props.quoteAuthor ? 
          "<blockquote><p><strong>" + props.quoteAuthor + "</strong></p>" + props.quote + "</blockquote> <p></p>" :
            "")
    }, props.currentId + (props.quote ? "-q" : "") + (props.reply ? "-" + props.reply.id : ""));
  }
  onCKEditorChange(text: string){
    this.setStateAndStore({text}, this.props.currentId + (this.props.quote ? "-q" : "") + (this.props.reply ? "-" + this.props.reply.id : ""));
  }
  clearUp(){
    this.setStateAndClear({
      text: (this.props.quote && this.props.quoteAuthor ? 
          "<blockquote><p><strong>" + this.props.quoteAuthor + "</strong></p>" + this.props.quote + "</blockquote> <p></p>" :
      ""),
    }, this.props.currentId + (this.props.quote ? "-q" : "") + (this.props.reply ? "-" + this.props.reply.id : ""));
  }
  createReply(closeDialog: ()=>any){
    this.setState({
      locked: true
    });
    this.props.replyToCurrentDiscussionThread({
      replyId: this.props.reply && this.props.reply.id,
      message: this.state.text,
      success: ()=>{
        closeDialog();
        this.setStateAndClear({
          text: this.props.quote && this.props.quoteAuthor ? 
              "<blockquote><p><strong>" + this.props.quoteAuthor + "</strong></p>" + this.props.quote + "</blockquote> <p></p>" :
                "",
          locked: false
        }, this.props.currentId + (this.props.quote ? "-q" : "") + (this.props.reply ? "-" + this.props.reply.id : ""));
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      }
    });
  }
  onDialogOpen(){
    //Text might have not loaded if quoteAuthor or quote wasn't ready
    if (this.props.quote && this.props.quoteAuthor && !this.state.text){
      this.setState(this.getRecoverStoredState({
        text: "<blockquote><p><strong>" + this.props.quoteAuthor + "</strong></p>" + this.props.quote + "</blockquote> <p></p>"
      }, this.props.currentId + "-q" + (this.props.reply ? "-" + this.props.reply.id : "")))
    } else {
      this.checkStoredAgainstThisState({
        text: this.props.quote && this.props.quoteAuthor ? 
            "<blockquote><p><strong>" + this.props.quoteAuthor + "</strong></p>" + this.props.quote + "</blockquote> <p></p>" :
              "",
      }, this.props.currentId + (this.props.quote ? "-q" : "") + (this.props.reply ? "-" + this.props.reply.id : ""));
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => [
    <div className="env-dialog__row" key="1">
      <div className="env-dialog__form-element-container">
        <div className="env-dialog__label">{this.props.i18n.text.get('plugin.discussion.createmessage.content')}</div> 
        <CKEditor autofocus key="1" width="100%" height="210" configuration={ckEditorConfig} extraPlugins={extraPlugins}
          onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
      </div>
    </div>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (
         <div className="env-dialog__actions">
          <Button buttonModifiers="dialog-execute" onClick={this.createReply.bind(this, closeDialog)} disabled={this.state.locked}>
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

    return <JumboDialog modifier="reply-thread"
      title={this.props.i18n.text.get('plugin.discussion.reply.topic')}
      content={content} footer={footer} onOpen={this.onDialogOpen}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    currentId: state.discussion.current.id
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({replyToCurrentDiscussionThread}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReplyThread);