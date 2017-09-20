import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/jumbo-dialog';
import actions from '~/actions/main-function/communicator/communicator-messages';
import {i18nType, CommunicatorSignatureType} from '~/reducers/index.d';
import {AnyActionType} from '~/actions';

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
  draftKey: 'communicator-new-message',
  resize_enabled: false
}
const extraPlugins = {
  'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
  'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
  'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
  'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
  'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.ts',
  'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.ts',
  'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
  'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
}

//TODO fix this
interface CommunicatorNewMessageProps {
  children: React.ReactElement<any>,
  replyThreadId: number,
  initialSelectedItems: Array<{
    type: 'workspace' | 'user' | 'usergroup',
    value: any
  }>,
  i18n: i18nType,
  signature: CommunicatorSignatureType
}

interface CommunicatorNewMessageState {
  
}

class CommunicatorNewMessage extends React.Component<CommunicatorNewMessageProps, CommunicatorNewMessageState> {
  constructor(props: CommunicatorNewMessageProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSignatureToggleClick = this.onSignatureToggleClick.bind(this);
    
    this.state = {
      text: "",
      selectedItems: props.initialSelectedItems || [],
      subject: "",
      locked: false,
      includesSignature: true
    }
  }
  onCKEditorChange(text: string){
    this.setState({text});
  }
  setSelectedItems(selectedItems){
    this.setState({selectedItems});
  }
  onSubjectChange(e){
    this.setState({subject: e.target.value});
  }
  sendMessage(closeDialog){
    this.setState({
      locked: true
    });
    this.props.sendMessage({
      to: this.state.selectedItems,
      subject: this.state.subject,
      text: ((this.props.signature && this.state.includesSignature) ? 
        (this.state.text + "<br/> <i class='mf-signature'>" + this.props.signature.signature + "</i>"):
        this.state.text),
      success: ()=>{
        closeDialog();
        this.setState({
          text: "",
          selectedItems: [],
          subject: "",
          locked: false
        });
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      },
      replyThreadId: this.props.replyThreadId
    });
  }
  onSignatureToggleClick(){
    this.setState({includesSignature: !this.state.includesSignature});
  }
  render(){
    let content = (closeDialog) => [
      (<InputContactsAutofill key="1" hasGroupMessagingPermission classNameExtension="communicator" classNameSuffix="new-message-recepients" placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.selectedItems} onChange={this.setSelectedItems} autofocus={!this.props.initialSelectedItems}></InputContactsAutofill>),
      (<input key="2" type="text" className="communicator form-field communicator-form-field-new-message-subject"
        placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.subject')}
        value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.initialSelectedItems}/>),
      (<CKEditor key="3" width="100%" height="grow" configuration={Object.assign({}, ckEditorConfig, {
         draftKey: `communicator-new-message-${this.props.replyThreadId ? this.props.replyThreadId : "default"}`
        })} extraPlugins={extraPlugins}
       onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>),
      (this.props.signature ? <div key="4" className="communicator container communicator-container-signature">
        <input className="form-field" type="checkbox" checked={this.state.includesSignature} onChange={this.onSignatureToggleClick}/>
        {this.props.i18n.text.get('plugin.communicator.createmessage.checkbox.signature')}
      </div> : null)
    ]
       
    let footer = (closeDialog)=>{
      return <div>
        <Link className="communicator button button-large communicator-button-standard-ok" onClick={this.sendMessage.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.communicator.createmessage.button.send')}
        </Link>
        <Link className="communicator button button-large button-warn communicator-button-standard-cancel" onClick={closeDialog} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.communicator.createmessage.button.cancel')}
        </Link>
      </div>
    }
    
    return <JumboDialog classNameExtension="communicator"
      title={this.props.i18n.text.get('plugin.communicator.createmessage.label')}
      content={content} footer={footer}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    signature: state.communicatorMessages.signature
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators(actions, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorNewMessage);