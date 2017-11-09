import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import Link from "~/components/general/link";
import JumboDialog from "~/components/general/jumbo-dialog";
import { replyToCurrentDiscussionThread, ReplyToCurrentDiscussionThreadTriggerType } from "~/actions/main-function/discussion/discussion-threads";

interface ReplyThreadProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  reply: DiscussionThreadType,
  message?: DiscussionThreadReplyType,
  replyToCurrentDiscussionThread: ReplyToCurrentDiscussionThreadTriggerType,
  quote?: string,
  quoteAuthor?: string
}

interface ReplyThreadState {
  text: string,
  locked: boolean
}

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
  draftKey: 'discussion-reply',
  resize_enabled: false
}
const extraPlugins = {
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js'
}

class ReplyThread extends React.Component<ReplyThreadProps, ReplyThreadState> {
  constructor(props: ReplyThreadProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.createReply = this.createReply.bind(this);
    this.onDialogOpen = this.onDialogOpen.bind(this);
    
    this.state = {
      locked: false,
      text: ""
    }
  }
  onCKEditorChange(text: string){
    this.setState({text});
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
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      }
    });
  }
  onDialogOpen(){
    if (this.props.quote && this.state.text !== this.props.quote){
      this.setState({
        text: "<blockquote><p><strong>" + this.props.quoteAuthor + "</strong></p>" + this.props.quote + "</blockquote> <p></p>"
      });
    }
  }
  render(){
    let content = (closeDialog: ()=>any) => [
      <CKEditor autofocus key="1" width="100%" height="grow" configuration={ckEditorConfig} extraPlugins={extraPlugins}
        onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
    ]
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="jumbo-dialog__button-container">
          <Link className="button button--warn button--standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.discussion.createmessage.cancel')}
          </Link>
          <Link className="button button--standard-ok" onClick={this.createReply.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.send')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="reply-thread" onOpen={this.onDialogOpen}
      title={this.props.i18n.text.get('plugin.discussion.reply.topic')}
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({replyToCurrentDiscussionThread}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(ReplyThread);