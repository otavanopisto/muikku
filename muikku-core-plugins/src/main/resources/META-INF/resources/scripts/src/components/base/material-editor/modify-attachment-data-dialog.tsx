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
import { WorkspaceType, MaterialContentNodeType, WorkspaceMaterialEditorType, MaterialContentNodeMetadata } from '~/reducers/workspaces';
import { LicenseSelector } from '~/components/general/license-selector';
import { UpdateWorkspaceMaterialContentNodeTriggerType, updateWorkspaceMaterialContentNode } from '~/actions/workspaces';

interface ModifyWorkspaceMaterialAttachmentDataDialogProps {
  i18n: i18nType,
  children: any,
  attachment: MaterialContentNodeType,
  materialEditor: WorkspaceMaterialEditorType,
  
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
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
    
    const license = props.attachment.metadata.find(d=>d.key === "license");
    const sourceText = props.attachment.metadata.find(d=>d.key === "source-text");
    const sourceUrl = props.attachment.metadata.find(d=>d.key === "source-url");
    this.state = {
      locked: false,
      
      license: license && license.value,
      sourceText: sourceText && sourceText.value,
      sourceUrl: sourceUrl && sourceUrl.value
    }

    this.update = this.update.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateStateByEvent = this.updateStateByEvent.bind(this);
  }
  componentWillReceiveProps(nextProps: ModifyWorkspaceMaterialAttachmentDataDialogProps) {
    const license = nextProps.attachment.metadata.find(d=>d.key === "license");
    const sourceText = nextProps.attachment.metadata.find(d=>d.key === "source-text");
    const sourceUrl = nextProps.attachment.metadata.find(d=>d.key === "source-url");
    this.setState({
      license: license && license.value,
      sourceText: sourceText && sourceText.value,
      sourceUrl: sourceUrl && sourceUrl.value
    });
  }
  update(closeDialog: ()=>any){
    this.setState({
      locked: true
    });
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.materialEditor.currentNodeWorkspace,
      material: this.props.attachment,
      update: {
        metadata: [
          {
            materialId: this.props.attachment.materialId,
            key: 'license',
            value: this.state.license
          },
          {
            materialId: this.props.attachment.materialId,
            key: 'source-text',
            value: this.state.sourceText
          },
          {
            materialId: this.props.attachment.materialId,
            key: 'source-url',
            value: this.state.sourceUrl
          }
        ]
      },
      isDraft: false,
      success: ()=>{
        this.setState({
          locked: false
        });
        closeDialog();
      },
      fail: ()=>{
        this.setState({
          locked: false
        });
      }
    })
  }
  updateState(key: string, value: string){
    const state:any = {[key]: value};
    this.setState(state);
  }
  updateStateByEvent(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    this.updateState(key, e.target.value);
  }
  render(){
    let content = (closeDialog: ()=>any) => <div>
      {this.props.i18n.text.get("TODO License")}
      <LicenseSelector modifier="material-editor" value={this.state.license || ""} onChange={this.updateState.bind(this, "license")} i18n={this.props.i18n}/>
      {this.props.i18n.text.get("TODO Source Text")}
      <input type="text" onChange={this.updateStateByEvent.bind(this, "sourceText")} value={this.state.sourceText || ""}/>
      {this.props.i18n.text.get("TODO Source Url")}
      <input type="url" onChange={this.updateStateByEvent.bind(this, "sourceUrl")} value={this.state.sourceUrl || ""}/>
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
    materialEditor: state.workspaces.materialEditor,
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({updateWorkspaceMaterialContentNode}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModifyWorkspaceMaterialAttachmentDataDialog);
