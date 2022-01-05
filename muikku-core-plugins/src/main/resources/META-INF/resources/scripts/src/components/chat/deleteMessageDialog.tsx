import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";

interface DeleteMessageDialogProps {
  i18n: i18nType;

  displayNotification: DisplayNotificationTriggerType;
  isOpen: boolean;
  onClose: () => any;
  onDelete: () => any;
}

interface DeleteMessageDialogState {}

class DeleteMessageDialog extends React.Component<
  DeleteMessageDialogProps,
  DeleteMessageDialogState
> {
  private unmounted = false;
  constructor(props: DeleteMessageDialogProps) {
    super(props);

    this.delete = this.delete.bind(this);
  }
  async delete(closeDialog: () => any) {
    try {
      if (!this.unmounted) {
        closeDialog();
      }
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.chat.notification.messageDeleteSuccess"
        ),
        "success"
      );
      this.props.onDelete();
    } catch {
      this.props.displayNotification(
        this.props.i18n.text.get("plugin.chat.notification.messageDeleteFail"),
        "error"
      );
    }
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span
          dangerouslySetInnerHTML={{
            __html: this.props.i18n.text.get(
              "plugin.chat.messages.deleteMessageDesc"
            ),
          }}
        ></span>
      </div>
    );
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.delete.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get("plugin.chat.button.deleteRMessage")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get("plugin.chat.button.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18n.text.get(
          "plugin.chat.messages.deleteMessageTitle"
        )}
        content={content}
        footer={footer}
        modifier="delete-room"
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteMessageDialog);
