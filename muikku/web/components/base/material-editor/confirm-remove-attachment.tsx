import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  MaterialContentNodeType,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import {
  deleteWorkspaceMaterialContentNode,
  DeleteWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces";

/**
 * ConfirmRemoveAttachmentProps
 */
interface ConfirmRemoveAttachmentProps {
  i18n: i18nType;
  materialEditor: WorkspaceMaterialEditorType;
  file: MaterialContentNodeType;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
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
  confirm(closeDialog: () => any) {
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
  cancel(closeDialog?: () => any) {
    closeDialog && closeDialog();
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
            "plugin.guider.flags.deleteAttachmentDialog.description"
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
            "plugin.guider.flags.deleteAttachmentDialog.yes"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.guider.flags.deleteAttachmentDialog.no"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        title={this.props.i18n.text.get(
          "plugin.guider.flags.deleteAttachmentDialog.title"
        )}
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
    i18n: state.i18n,
    materialEditor: state.workspaces.materialEditor,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteWorkspaceMaterialContentNode }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRemoveAttachment);
