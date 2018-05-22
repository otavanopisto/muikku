import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import CKEditor from '~/components/general/ckeditor';
import Link from '~/components/general/link';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import JumboDialog from '~/components/general/environment-dialog';
import {sendMessage, SendMessageTriggerType} from '~/actions/main-function/messages';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {MessageSignatureType} from '~/reducers/main-function/messages';
import { WorkspaceRecepientType, UserRecepientType, UserGroupRecepientType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import SessionStateComponent from '~/components/general/session-state-component';

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

type SelectedItemListType = Array<WorkspaceRecepientType | UserRecepientType | UserGroupRecepientType>;

interface CommunicatorNewMessageProps {
  children: React.ReactElement<any>,
  replyThreadId?: number,
  initialSelectedItems?: SelectedItemListType,
  i18n: i18nType,
  signature: MessageSignatureType,
  sendMessage: SendMessageTriggerType
}

interface CommunicatorNewMessageState {
  text: string,
  selectedItems: SelectedItemListType,
  subject: string,
  locked: boolean,
  includesSignature: boolean
}

class CommunicatorNewMessage extends SessionStateComponent<CommunicatorNewMessageProps, CommunicatorNewMessageState> {
  constructor(props: CommunicatorNewMessageProps){
    super(props, "communicator-new-message");
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSignatureToggleClick = this.onSignatureToggleClick.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);
    
    this.state = this.getRecoverStoredState({
      text: "",
      selectedItems: props.initialSelectedItems || [],
      subject: "",
      locked: false,
      includesSignature: true
    }, props.replyThreadId);
  }
  checkAgainstStoredState(){
    this.checkAgainstDefaultState({
      text: "",
      selectedItems: this.props.initialSelectedItems || [],
      subject: "",
      locked: false,
      includesSignature: true
    }, this.props.replyThreadId);
  }
  onCKEditorChange(text: string){
    this.setStateAndStore({text}, this.props.replyThreadId);
  }
  setSelectedItems(selectedItems: SelectedItemListType){
    this.setStateAndStore({selectedItems}, this.props.replyThreadId);
  }
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setStateAndStore({subject: e.target.value}, this.props.replyThreadId);
  }
  sendMessage(closeDialog: ()=>any){
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
        this.setStateAndClear({
          text: "",
          selectedItems: this.props.initialSelectedItems || [],
          subject: "",
          locked: false
        }, this.props.replyThreadId);
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
  clearUp(){
    this.setStateAndClear({
      text: "",
      selectedItems: this.props.initialSelectedItems || [],
      subject: "",
      locked: false
    }, this.props.replyThreadId);
  }
  render(){
    let content = (closeDialog: ()=>any) => [
      (<InputContactsAutofill modifier="new-messsage" key="1" hasGroupPermission placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.selectedItems} onChange={this.setSelectedItems} autofocus={!this.props.initialSelectedItems}></InputContactsAutofill>),
      (
       <div className="container container--communicator-subject">
        <div className="environment-dialog__form-element--wrapper">  
          <div className="environment-dialog__form-element-label">{this.props.i18n.text.get('plugin.communicator.createmessage.title.subject')}</div>
          <input key="2" type="text" className="environment-dialog__input--title"         
          value={this.state.subject} onChange={this.onSubjectChange} autoFocus={!!this.props.initialSelectedItems}/>
        </div> 
        </div>
        ),
      (
      <div className="container container--communicator-content">     
        <div className="environment-dialog__form-element--wrapper">  
          <div className="environment-dialog__form-element-label">{this.props.i18n.text.get('plugin.communicator.createmessage.title.content')}</div>          
          <CKEditor key="3" width="100%" height="grow" configuration={Object.assign({}, ckEditorConfig, {
           draftKey: `communicator-new-message-${this.props.replyThreadId ? this.props.replyThreadId : "default"}`
           })} extraPlugins={extraPlugins}
          onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
        </div> 
      </div>
      ),
      (this.props.signature ? <div key="4" className="container container--communicator-signature">
        <input className="environment-dialog__form-element" type="checkbox" checked={this.state.includesSignature} onChange={this.onSignatureToggleClick}/>
        {this.props.i18n.text.get('plugin.communicator.createmessage.checkbox.signature')}
      </div> : null)
    ]
       
    let footer = (closeDialog: ()=>any)=>{
      return (          
         <div className="environment-dialog__button-container">
          <Button className="button-dialog--execute" onClick={this.sendMessage.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.communicator.createmessage.button.send')}
         </Button>
          <Button className="button-dialog--cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.communicator.createmessage.button.cancel')}
          </Button>
        </div>
      )
    }
    
    return <JumboDialog modifier="new-message"
      title={this.props.i18n.text.get('plugin.communicator.createmessage.label')}
      content={content} footer={footer} onOpen={this.checkAgainstStoredState}>
      {this.props.children}
    </JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    signature: state.messages.signature
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({sendMessage}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorNewMessage);