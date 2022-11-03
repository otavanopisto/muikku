import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import { WorkspaceMaterialEditorType } from "~/reducers/workspaces";
import {
  SetWorkspaceMaterialEditorStateTriggerType,
  setWorkspaceMaterialEditorState,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  updateWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";

/**
 * ConfirmPublishPageWithLinkedMaterialDialogProps
 */
interface ConfirmPublishPageWithLinkedMaterialDialogProps {
  i18n: i18nType;
  materialEditor: WorkspaceMaterialEditorType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
}

/**
 * ConfirmPublishPageWithLinkedMaterialDialogState
 */
interface ConfirmPublishPageWithLinkedMaterialDialogState {
  locked: boolean;
}

/**
 * ConfirmPublishPageWithLinkedMaterialDialog
 */
class ConfirmPublishPageWithLinkedMaterialDialog extends React.Component<
  ConfirmPublishPageWithLinkedMaterialDialogProps,
  ConfirmPublishPageWithLinkedMaterialDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmPublishPageWithLinkedMaterialDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  /**
   * confirm
   * @param closeDialog closeDialog
   */
  confirm(closeDialog: () => any) {
    this.setState({
      locked: true,
    });

    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.materialEditor.currentNodeWorkspace,
      material: this.props.materialEditor.currentNodeValue,
      update: this.props.materialEditor.currentDraftNodeValue,
      updateLinked: true,
      /**
       * success
       */
      success: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }
  /**
   * cancel
   * @param closeDialog closeDialog
   */
  cancel(closeDialog?: () => any) {
    closeDialog && closeDialog();
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.materialEditor,
      showUpdateLinkedMaterialsDialogForPublish: false,
    });
  }
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.linkedMaterialCountMessage",
            this.props.materialEditor
              .showUpdateLinkedMaterialsDialogForPublishCount
          )}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.confirm.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.confirmButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        isOpen={
          this.props.materialEditor.showUpdateLinkedMaterialsDialogForPublish
        }
        onClose={this.cancel}
        title={this.props.i18n.text.get(
          "plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.title"
        )}
        content={content}
        footer={footer}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    materialEditor: state.workspaces.materialEditor,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { setWorkspaceMaterialEditorState, updateWorkspaceMaterialContentNode },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmPublishPageWithLinkedMaterialDialog);
