import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";

interface ConfirmRemoveDialogProps {
  i18n: i18nType;
  onConfirm: () => any;
  children: React.ReactElement<any>;
}

interface ConfirmRemoveDialogState {
  locked: boolean;
}

class ConfirmRemoveDialog extends React.Component<
  ConfirmRemoveDialogProps,
  ConfirmRemoveDialogState
> {
  constructor(props: ConfirmRemoveDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }
  confirm(closeDialog: () => any) {
    closeDialog();
    this.props.onConfirm();
  }
  cancel(closeDialog?: () => any) {
    closeDialog();
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentAudioAttachment.removeDialog.description"
          )}
        </span>
      </div>
    );

    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.confirm.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentAudioAttachment.removeDialog.removeButtonLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materials.assignmentAudioAttachment.removeDialog.cancelButtonLabel"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        title={this.props.i18n.text.get(
          "plugin.workspace.materials.assignmentAudioAttachment.removeDialog.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRemoveDialog);
