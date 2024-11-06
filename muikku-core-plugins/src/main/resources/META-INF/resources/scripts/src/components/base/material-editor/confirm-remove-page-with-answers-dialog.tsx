import * as React from "react";
import { connect } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import { WorkspaceMaterialEditorType } from "~/reducers/workspaces";
import {
  DeleteWorkspaceMaterialContentNodeTriggerType,
  deleteWorkspaceMaterialContentNode,
  SetWorkspaceMaterialEditorStateTriggerType,
  setWorkspaceMaterialEditorState,
} from "~/actions/workspaces/material";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ConfirmDeletePageWithAnswersDialogProps
 */
interface ConfirmDeletePageWithAnswersDialogProps extends WithTranslation {
  materialEditor: WorkspaceMaterialEditorType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  confirm(closeDialog: () => void) {
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
   * @param closeDialog closeDialog
   */
  cancel(closeDialog?: () => void) {
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
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <span>
          {t("content.confirm", {
            ns: "materials",
          })}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.confirm.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.confirmSave")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        isOpen={this.props.materialEditor.showRemoveAnswersDialogForDelete}
        onClose={this.cancel}
        title={t("labels.pageRemoval", {
          ns: "materials",
        })}
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
    materialEditor: state.workspaces.materialEditor,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { setWorkspaceMaterialEditorState, deleteWorkspaceMaterialContentNode },
    dispatch
  );
}

export default withTranslation(["materials", "common"])(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConfirmDeletePageWithAnswersDialog)
);
