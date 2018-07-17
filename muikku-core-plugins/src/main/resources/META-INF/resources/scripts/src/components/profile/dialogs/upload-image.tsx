import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';
import '~/sass/elements/buttons.scss';
import Button from '~/components/general/button';

interface UploadImageDialogProps {
  i18n: i18nType,
  
  b64?: string,
  isOpen: boolean,
  onClose: ()=>any
}

interface UploadImageDialogState {
  locked: boolean
}

class UploadImageDialog extends React.Component<UploadImageDialogProps, UploadImageDialogState> {
  constructor(props: UploadImageDialogProps){
    super(props);
    
    this.upload = this.upload.bind(this);
    
    this.state = {
      locked: false
    }
  }
  upload(closeDialog: ()=>any){
    
  }
  render(){
    let content = (closeDialog: ()=>any)=><div>
        <img src={this.props.b64}/>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div>
        <Button buttonModifiers="dialog-execute" onClick={this.upload.bind(this, closeDialog)} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changeImage.dialog.saveButton.label')}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changeImage.dialog.cancelButton.label')}
        </Button>
      </div>
    }
    return <Dialog isOpen={this.props.isOpen} title={this.props.i18n.text.get('plugin.profile.changeImage.dialog.title')}
      content={content} footer={footer} modifier="upload-image" onClose={this.props.onClose}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadImageDialog);