import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import { IAvailableChatRoomType } from "./chat";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DeleteRoomDialogProps
 */
interface DeleteRoomDialogProps extends WithTranslation {
  chat: IAvailableChatRoomType;
  displayNotification: DisplayNotificationTriggerType;
  isOpen: boolean;
  onClose: () => any;
  onDelete: () => any;
}

/**
 * DeleteRoomDialogState
 */
interface DeleteRoomDialogState {}

/**
 * DeleteRoomDialog
 */
class DeleteRoomDialog extends React.Component<
  DeleteRoomDialogProps,
  DeleteRoomDialogState
> {
  private unmounted = false;
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteRoomDialogProps) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  /**
   * delete
   * @param closeDialog closeDialog
   */
  async delete(closeDialog: () => any) {
    try {
      await promisify(
        mApi().chat.publicRoom.del({
          name: this.props.chat.roomJID.split("@")[0],
        }),
        "callback"
      )();
      if (!this.unmounted) {
        closeDialog();
      }
      this.props.displayNotification(
        this.props.i18n.t("notifications.removeSuccess", {
          ns: "messaging",
          context: "room",
          room: this.props.chat.roomName,
        }),
        "success"
      );
      this.props.onDelete();
    } catch {
      this.props.displayNotification(
        this.props.i18n.t(
          "notifications.removeError",
          this.props.chat.roomName
        ),
        "error"
      );
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.unmounted = true;
  }

  /**
   * render
   */
  render() {
    /**
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span
          dangerouslySetInnerHTML={{
            __html: this.props.i18n.t("content.removing", {
              context: "room",
              room: this.props.chat.roomName,
            }),
          }}
        ></span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.delete.bind(this, closeDialog)}
        >
          {this.props.i18n.t("actions.remove", { context: "room" })}
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
        title={this.props.i18n.t("actions.remove", { context: "room" })}
        content={content}
        footer={footer}
        modifier="delete-room"
      />
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(DeleteRoomDialog)
);
