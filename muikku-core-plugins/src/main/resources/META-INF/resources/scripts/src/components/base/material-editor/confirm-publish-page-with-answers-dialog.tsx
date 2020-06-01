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
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType } from '~/actions/workspaces';

interface ConfirmPublishPageWithAnswersDialogProps {
  i18n: i18nType,
  materialEditor: WorkspaceMaterialEditorType,
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType
}

interface ConfirmPublishPageWithAnswersDialogState {
  locked: boolean
}

class ConfirmPublishPageWithAnswersDialog extends React.Component<ConfirmPublishPageWithAnswersDialogProps, ConfirmPublishPageWithAnswersDialogState> {
  constructor(props: ConfirmPublishPageWithAnswersDialogProps){
    super(props);
    this.state = {
      locked: false
    }

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  confirm(closeDialog: ()=>any){
    this.setState({
      locked: true
    });

    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.materialEditor.currentNodeWorkspace,
      material: this.props.materialEditor.currentNodeValue,
      update: this.props.materialEditor.currentDraftNodeValue,
      removeAnswers: true,
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
    });
  }
  cancel(closeDialog?: ()=>any){
    closeDialog && closeDialog();
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.materialEditor,
      showRemoveAnswersDialogForPublish: false,
    });
  }
  render(){
    let content = (closeDialog: ()=>any) => <div>
      <span>{this.props.i18n.text.get("plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.text")}</span>
    </div>

    let footer = (closeDialog: ()=>any)=>{
      return (
        <div className="dialog__button-set">
          <Button buttonModifiers={["standard-ok", "fatal"]} onClick={this.confirm.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get("plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.confirmButton")}
          </Button>
          <Button buttonModifiers={["cancel","standard-cancel"]} onClick={this.cancel.bind(this, closeDialog)} disabled={this.state.locked}>
            {this.props.i18n.text.get("plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.cancelButton")}
          </Button>
        </div>
      )
    }

    return <Dialog modifier="confirm-remove-answer-dialog" isOpen={this.props.materialEditor.showRemoveAnswersDialogForPublish} onClose={this.cancel}
      title={this.props.i18n.text.get("plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.title")}
      content={content} footer={footer}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    materialEditor: state.workspaces.materialEditor,
  }
};

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>){
  return bindActionCreators({setWorkspaceMaterialEditorState, updateWorkspaceMaterialContentNode}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPublishPageWithAnswersDialog);
