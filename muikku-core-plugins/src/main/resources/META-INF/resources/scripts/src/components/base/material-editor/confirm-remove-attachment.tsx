import * as React from "react";
import { connect } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import {
  DeleteWorkspaceMaterialContentNodeTriggerType,
  deleteWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ConfirmRemoveAttachmentProps
 */
interface ConfirmRemoveAttachmentProps extends WithTranslation {
  materialEditor: WorkspaceMaterialEditorType;
  file: MaterialContentNodeWithIdAndLogic;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}

/**
 * ConfirmRemoveAttachmentState
 */
interface ConfirmRemoveAttachmentState {
  locked: boolean;
}

/**
 * ConfirmRemoveAttachment
 */
class ConfirmRemoveAttachment extends React.Component<
  ConfirmRemoveAttachmentProps,
  ConfirmRemoveAttachmentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmRemoveAttachmentProps) {
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
      material: this.props.file,
      workspace: this.props.materialEditor.currentNodeWorkspace,
      removeAnswers: false,
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
          {t("content.removing", {
            context: "file",
            ns: "guider",
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
          {t("actions.remove")}
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
        title={t("labels.removing", { ns: "materials", context: "attachment" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
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
  return bindActionCreators({ deleteWorkspaceMaterialContentNode }, dispatch);
}

export default withTranslation(["materials", "guider", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveAttachment)
);
