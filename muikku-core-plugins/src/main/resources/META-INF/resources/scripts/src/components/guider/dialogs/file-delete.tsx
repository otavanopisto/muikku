import * as React from 'react';
import Dialog from '~/components/general/dialog';
import Link from '~/components/general/link';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux'
import {i18nType } from '~/reducers/base/i18n';
import Button from '~/components/general/button';

import { AnyActionType } from '~/actions';
import { StateType } from '~/reducers';
import { removeFileFromCurrentStudent, RemoveFileFromCurrentStudentTriggerType } from '~/actions/main-function/guider';
import { UserFileType } from '~/reducers/main-function/user-index';

const KEYCODES = {
  ENTER: 13
}

interface FileDeleteDialogProps {
  children: React.ReactElement<any>,
  isOpen?: boolean,
  onClose?: ()=>any,
  i18n: i18nType,
  file: UserFileType,
  removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType
}

interface FileDeleteDialogState {
}


class FileDeleteDialog extends React.Component<FileDeleteDialogProps, FileDeleteDialogState> {
  constructor(props: FileDeleteDialogProps){
    super(props);
    
    this.deleteFile = this.deleteFile.bind(this);
  }
  deleteFile(closeDialog: ()=>any){
    this.props.removeFileFromCurrentStudent(this.props.file);
    closeDialog();
  }
  render(){
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["fatal", "standard-ok"]} onClick={this.deleteFile.bind(this, closeDialog)}>
          {this.props.i18n.text.get('plugin.guider.flags.deleteAttachmentDialog.yes')}
        </Button>
        <Button buttonModifiers={["cancel", "standard-cancel"]} onClick={closeDialog}>
         {this.props.i18n.text.get('plugin.guider.flags.deleteAttachmentDialog.no')}
        </Button>
      </div>
    }
    let content = (closeDialog: ()=>any)=>{
      return (          
        <div>
          {this.props.i18n.text.get('plugin.guider.flags.deleteAttachmentDialog.description')}
        </div>
      )
    }
    return <Dialog isOpen={this.props.isOpen} onClose={this.props.onClose} modifier="guider" 
     title={this.props.i18n.text.get('plugin.guider.flags.deleteAttachmentDialog.title')}
     content={content} footer={footer}>{this.props.children}</Dialog>
  } 
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({removeFileFromCurrentStudent}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileDeleteDialog);