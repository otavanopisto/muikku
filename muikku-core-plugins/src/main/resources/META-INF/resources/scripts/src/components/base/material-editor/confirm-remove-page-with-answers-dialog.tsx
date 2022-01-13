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
  setWorkspaceMaterialEditorState,
  SetWorkspaceMaterialEditorStateTriggerType,
  deleteWorkspaceMaterialContentNode,
  DeleteWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces";

/**
 * ConfirmDeletePageWithAnswersDialogProps
 */
interface ConfirmDeletePageWithAnswersDialogProps {
  i18n: i18nType;
  materialEditor: WorkspaceMaterialEditorType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  onDeleteSuccess: () => any;
}

/**
 * ConfirmDeletePageWithAnswersDialogState
 */
interface ConfirmDeletePageWithAnswersDialogState {
  locked: boolean;
}

/**
 * ConfirmDeletePageWithAnswersDialog
 */
class ConfirmDeletePageWithAnswersDialog extends React.Component<
  ConfirmDeletePageWithAnswersDialogProps,
  ConfirmDeletePageWithAnswersDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmDeletePageWithAnswersDialogProps) {
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

    this.props.deleteWorkspaceMaterialContentNode({
      material: this.props.materialEditor.currentNodeValue,
      workspace: this.props.materialEditor.currentNodeWorkspace,
      removeAnswers: true,
      /**
       *
       */
      success: () => {
        this.setState({
          locked: false,
        });
        this.props.onDeleteSuccess();
        closeDialog();
      },
      /**
       *
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
   * @param closeDialog
   */
  cancel(closeDialog?: () => any) {
    closeDialog && closeDialog();
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.materialEditor,
      showRemoveAnswersDialogForDelete: false,
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
            "plugin.workspace.materialsManagement.confirmRemovePageWithAnswers.text"
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
            "plugin.workspace.materialsManagement.confirmRemovePageWithAnswers.confirmButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.confirmRemovePageWithAnswers.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        isOpen={this.props.materialEditor.showRemoveAnswersDialogForDelete}
        onClose={this.cancel}
        title={this.props.i18n.text.get(
          "plugin.workspace.materialsManagement.confirmRemovePageWithAnswers.title"
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
    { setWorkspaceMaterialEditorState, deleteWorkspaceMaterialContentNode },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmDeletePageWithAnswersDialog);
