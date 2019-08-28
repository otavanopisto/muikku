import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import Dialog from '~/components/general/dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import { bindActionCreators } from 'redux';
import { WorkspaceType, MaterialContentNodeType, WorkspaceMaterialEditorType } from '~/reducers/workspaces';
import { LicenseSelector } from '~/components/general/license-selector';

interface ModifyWorkspaceMaterialAttachmentDataDialogProps {
  i18n: i18nType,
  children: any,
  attachment: MaterialContentNodeType,
}

interface ModifyWorkspaceMaterialAttachmentDataDialogState {
  locked: boolean,
  
  license?: string,
  sourceText?: string,
  sourceUrl?: string,
}

class ModifyWorkspaceMaterialAttachmentDataDialog extends React.Component<ModifyWorkspaceMaterialAttachmentDataDialogProps, ModifyWorkspaceMaterialAttachmentDataDialogState> {
  constructor(props: ModifyWorkspaceMaterialAttachmentDataDialogProps){
    super(props);
    this.state = {
      locked: false,
      
      license: props.attachment.metadata.find(d=>d.key === "license").value,
      sourceText: props.attachment.metadata.find(d=>d.key === "source-text").value,
      sourceUrl: props.attachment.metadata.find(d=>d.key === "source-url").value,
    }

    this.update = this.update.bind(this);
  }
  componentWillReceiveProps(nextProps: ModifyWorkspaceMaterialAttachmentDataDialogProps) {
    this.setState({
      license: nextProps.attachment.metadata.find(d=>d.key === "license").value,
      sourceText: nextProps.attachment.metadata.find(d=>d.key === "source-text").value,
      sourceUrl: nextProps.attachment.metadata.find(d=>d.key === "source-url").value
    });
  }
  update(closeDialog: ()=>any){
    this.setState({
      locked: true
    });
//    this.props.deleteWorkspaceMaterialContentNode({
//      material: this.props.material,
//      workspace: this.props.materialEditor.currentNodeWorkspace,
//      success: ()=>{
//        this.setState({
//          locked: false
//        });
//        closeDialog();
//        this.props.onDeleteSuccess();
//      },
//      fail: ()=>{
//        this.setState({
//          locked: false
//        });
//        closeDialog();
//      }
//    })
  }
  updateState(key: string, value: string){
    const state:any = {[key]: value};
    this.setState(state);
  }
  render(){
    let content = (closeDialog: ()=>any) => <div>
      {this.props.i18n.text.get("TODO License")}
      <LicenseSelector modifier="material-editor" value={this.state.license || ""} onChange={this.updateState.bind(this, "license")} i18n={this.props.i18n}/>
      {this.props.i18n.text.get("TODO Source Text")}
      <input type="text" onChange={this.updateState.bind(this, "sourceText")} value={this.state.sourceText || ""}/>
      {this.props.i18n.text.get("TODO Source Url")}
      <input type="url" onChange={this.updateState.bind(this, "sourceUrl")} value={this.state.sourceUrl || ""}/>
    </div>

    let footer = (closeDialog: ()=>any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "fatal"]} onClick={this.update.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get("TODO OK")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get("TODO CANCEL")}
          </Button>
        </div>
      )
    }

    return <Dialog modifier="modify-attachment-data-dialog"
      title={this.props.i18n.text.get("TODO title")}
      content={content} footer={footer}>{this.props.children}</Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyWorkspaceMaterialAttachmentDataDialog);
