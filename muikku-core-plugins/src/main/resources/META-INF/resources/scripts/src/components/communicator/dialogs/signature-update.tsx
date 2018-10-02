import * as React from 'react';
import JumboDialog from '~/components/general/environment-dialog';
import Link from '~/components/general/link';
import CKEditor from '~/components/general/ckeditor';
import {connect, Dispatch} from 'react-redux';
import {AnyActionType} from '~/actions';
import {bindActionCreators} from 'redux';
import {updateSignature, UpdateSignatureTriggerType} from '~/actions/main-function/messages';
import {MessageSignatureType} from '~/reducers/main-function/messages';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';


import Button from '~/components/general/button';

const KEYCODES = {
  ENTER: 13
}

const CKEDITOR_CONFIG = {
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ]
}

const CKEDITOR_PLUGINS = {};

interface CommunicatorSignatureUpdateDialogProps {
  children?: React.ReactElement<any>,
  isOpen: boolean,
  onClose: ()=>any,
  signature: MessageSignatureType,
  updateSignature: UpdateSignatureTriggerType,
  i18n: i18nType
}

interface CommunicatorSignatureUpdateDialogState {
  signature: string
}

class CommunicatorSignatureUpdateDialog extends React.Component<CommunicatorSignatureUpdateDialogProps, CommunicatorSignatureUpdateDialogState> {
  constructor(props: CommunicatorSignatureUpdateDialogProps){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.resetState = this.resetState.bind(this);
    this.update = this.update.bind(this);
    
    this.state = {
      signature: props.signature ? props.signature.signature : ""
    }
  }
  handleKeydown(code: number, closeDialog: ()=>any){
    if (code === KEYCODES.ENTER){
      this.update(closeDialog);
    }
  }
  onCKEditorChange(signature: string){
    this.setState({signature});
  }
  resetState(){
    this.setState({
      signature: this.props.signature ? this.props.signature.signature : ""
    });
  }
  update(closeDialog: ()=>any){
    this.props.updateSignature(this.state.signature.trim() || null);
    closeDialog();
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return (
        <div className="env-dialog__actions">
          <Button buttonModifiers="dialog-execute" onClick={this.update.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.communicator.settings.signature.create')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog}>
            {this.props.i18n.text.get('plugin.communicator.confirmSignatureRemovalDialog.cancelButton')}
          </Button>
        </div>
      )    
    }
    let content = (closeDialog: ()=>any)=>{
      return <CKEditor width="100%" height="210" configuration={CKEDITOR_CONFIG} extraPlugins={CKEDITOR_PLUGINS}
      onChange={this.onCKEditorChange} autofocus>{this.state.signature}</CKEditor>
    }
    return <JumboDialog onClose={this.props.onClose} isOpen={this.props.isOpen} onKeyStroke={this.handleKeydown} onOpen={this.resetState} modifier="update-signature" 
     title={this.props.i18n.text.get("plugin.communicator.settings.signature")}
     content={content} footer={footer}>{this.props.children}</JumboDialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    signature: state.messages.signature,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateSignature}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorSignatureUpdateDialog);