import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
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
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ConfirmPublishPageWithAnswersDialogProps
 */
interface ConfirmPublishPageWithAnswersDialogProps extends WithTranslation {
  materialEditor: WorkspaceMaterialEditorType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
}

/**
 * ConfirmPublishPageWithAnswersDialogState
 */
interface ConfirmPublishPageWithAnswersDialogState {
  locked: boolean;
}

/**
 * ConfirmPublishPageWithAnswersDialog
 */
class ConfirmPublishPageWithAnswersDialog extends React.Component<
  ConfirmPublishPageWithAnswersDialogProps,
  ConfirmPublishPageWithAnswersDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmPublishPageWithAnswersDialogProps) {
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

    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.materialEditor.currentNodeWorkspace,
      material: this.props.materialEditor.currentNodeValue,
      update: this.props.materialEditor.currentDraftNodeValue,
      removeAnswers: true,

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
  cancel(closeDialog?: () => void) {
    closeDialog && closeDialog();
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.materialEditor,
      showRemoveAnswersDialogForPublish: false,
    });
  }
  /**
   * Component render method
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <span>{t("content.confirm", { ns: "materials" })}</span>
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
        isOpen={this.props.materialEditor.showRemoveAnswersDialogForPublish}
        onClose={this.cancel}
        title={t("labels.pagePublication", { ns: "materials" })}
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { setWorkspaceMaterialEditorState, updateWorkspaceMaterialContentNode },
    dispatch
  );
}

export default withTranslation(["materials", "workspace", "common"])(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConfirmPublishPageWithAnswersDialog)
);
