import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DeleteMessageDialogProps
 */
interface DeleteMessageDialogProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  isOpen: boolean;
  onClose: () => any;
  onDelete: () => any;
}

/**
 * DeleteMessageDialogState
 */
interface DeleteMessageDialogState {}

/**
 * DeleteMessageDialog
 */
class DeleteMessageDialog extends React.Component<
  DeleteMessageDialogProps,
  DeleteMessageDialogState
> {
  private unmounted = false;
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteMessageDialogProps) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.unmounted = true;
  }

  /**
   * delete
   * @param closeDialog closeDialog
   */
  async delete(closeDialog: () => any) {
    try {
      if (!this.unmounted) {
        closeDialog();
      }
      this.props.displayNotification(
        this.props.i18n.t("notifications.removeSuccess", { ns: "messaging", context: "message" }),
        "success"
      );
      this.props.onDelete();
    } catch {
      this.props.displayNotification(
        this.props.i18n.t("notifications.removeError", { ns: "messaging", context: "message" }),
        "error"
      );
    }
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
        <span
          dangerouslySetInnerHTML={{
            __html: this.props.i18n.t("content.removing", {
              ns: "messaging",
              context: "message",
            }),
          }}
        ></span>
      </div>
    );
    /**
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.delete.bind(this, closeDialog)}
        >
          {this.props.i18n.t("actions.remove", {
            ns: "messaging",
            context: "message",
          })}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18n.t("labels.remove", {
          ns: "messaging",
          context: "message",
        })}
        content={content}
        footer={footer}
        modifier="delete-room"
      />
    );
  }
}

/**
/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(DeleteMessageDialog)
);
