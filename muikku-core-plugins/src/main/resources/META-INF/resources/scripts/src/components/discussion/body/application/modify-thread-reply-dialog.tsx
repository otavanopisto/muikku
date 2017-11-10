import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadType, DiscussionThreadReplyType } from "~/reducers/main-function/discussion/discussion-threads";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import Link from "~/components/general/link";
import JumboDialog from "~/components/general/jumbo-dialog";
import { modifyReplyFromCurrentThread, ModifyReplyFromCurrentThreadTriggerType } from "~/actions/main-function/discussion/discussion-threads";

interface ModifyThreadReplyProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  reply?: DiscussionThreadReplyType,
  modifyReplyFromCurrentThread: ModifyReplyFromCurrentThreadTriggerType
}

interface ModifyThreadReplyState {
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
  draftKey: 'discussion-reply-modify',
  resize_enabled: false
}
const extraPlugins = {
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js'
}

class ModifyThreadReply extends React.Component<ModifyThreadReplyProps, ModifyThreadReplyState> {
  constructor(props: ModifyThreadReplyProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.modifyReply = this.modifyReply.bind(this);
    
    this.state = {
      locked: false,
      text: props.reply.message
    }
  }
  componentWillReceiveProps(nextProps: ModifyThreadReplyProps){
    if (nextProps.reply.id !== this.props.reply.id){
      this.setState({
        text: nextProps.reply.message
      });
    }
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  modifyReply(closeDialog: ()=>any){
    this.setState({
      locked: true
    });
    this.props.modifyReplyFromCurrentThread({
      reply: this.props.reply,
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
          <Link className="button button--standard-ok" onClick={this.modifyReply.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.discussion.createmessage.send')}
          </Link>
        </div>
      )
    }
    
    return <JumboDialog modifier="modify-reply-thread"
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
  return bindActionCreators({modifyReplyFromCurrentThread}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(ModifyThreadReply);