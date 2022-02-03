import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";

/**
 * ConfirmRemoveDialogProps
 */
interface ConfirmRemoveDialogProps {
  i18n: i18nType;
  onConfirm: (fileData: any) => any;
  file: any;
  children: React.ReactElement<any>;
}

/**
 * ConfirmRemoveDialogState
 */
interface ConfirmRemoveDialogState {
  locked: boolean;
}

/**
 * ConfirmRemoveDialog
 */
class ConfirmRemoveDialog extends React.Component<
  ConfirmRemoveDialogProps,
  ConfirmRemoveDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmRemoveDialogProps) {
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
    closeDialog();
    this.props.onConfirm(this.props.file);
  }

  /**
   * cancel
   * @param closeDialog closeDialog
   */
  cancel(closeDialog?: () => any) {
    closeDialog();
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentFileAttachment.removeDialog.description"
          )}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closDialog
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.confirm.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentFileAttachment.removeDialog.removeButtonLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentFileAttachment.removeDialog.cancelButtonLabel"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        title={this.props.i18n.text.get(
          "plugin.workspace.materials.assignmentFileAttachment.removeDialog.title"
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
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 *
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRemoveDialog);
