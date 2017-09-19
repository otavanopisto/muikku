import * as React from 'react';
import * as PropTypes from 'prop-types';
import JumboDialog from '~/components/general/jumbo-dialog.tsx';
import Link from '~/components/general/link.tsx';
import CKEditor from '~/components/general/ckeditor.tsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import communicatorMessagesActions from '~/actions/main-function/communicator/communicator-messages';

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

class CommunicatorSignatureUpdateDialog extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  }
  constructor(props){
    super(props);
    
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.resetState = this.resetState.bind(this);
    this.update = this.update.bind(this);
    
    this.state = {
      signature: props.signature ? props.signature.signature : ""
    }
  }
  handleKeydown(code, closeDialog){
    if (code === KEYCODES.ENTER){
      this.update(closeDialog);
    }
  }
  onCKEditorChange(signature){
    this.setState({signature});
  }
  resetState(){
    this.setState({
      signature: this.props.signature ? this.props.signature.signature : ""
    });
  }
  update(closeDialog){
    this.props.updateSignature(this.state.signature.trim() || null);
    closeDialog();
  }
  render(){
    let footer = (closeDialog)=>{
      return <div className="embbed embbed-full">
        <Link className="communicator button button-large button-warn commmunicator-button-standard-cancel" onClick={closeDialog}>
         {this.props.i18n.text.get('plugin.communicator.confirmSignatureRemovalDialog.cancelButton')}
        </Link>
        <Link className="communicator button button-large communicator-button-standard-ok" onClick={this.update.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.communicator.settings.signatures.create')}
        </Link>
      </div>
    }
    let content = (closeDialog)=>{
      return <CKEditor width="100%" height="grow" configuration={CKEDITOR_CONFIG} extraPlugins={CKEDITOR_PLUGINS}
      onChange={this.onCKEditorChange} autofocus>{this.state.signature}</CKEditor>
    }
    return <JumboDialog onClose={this.props.onClose} isOpen={this.props.isOpen} onKeyStroke={this.handleKeydown} onOpen={this.resetState} classNameExtension="communicator" 
     title={this.props.i18n.text.get("plugin.communicator.settings.signatures")}
     content={content} footer={footer}>{this.props.children}</JumboDialog>
  }
}

function mapStateToProps(state){
  return {
    signature: state.communicatorMessages.signature,
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(communicatorMessagesActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorSignatureUpdateDialog);