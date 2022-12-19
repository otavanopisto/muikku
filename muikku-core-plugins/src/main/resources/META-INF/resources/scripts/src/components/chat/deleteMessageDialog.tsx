import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";

/**
 * DeleteMessageDialogProps
 */
interface DeleteMessageDialogProps {
  i18nOLD: i18nType;

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
        this.props.i18nOLD.text.get(
          "plugin.chat.notification.messageDeleteSuccess"
        ),
        "success"
      );
      this.props.onDelete();
    } catch {
      this.props.displayNotification(
        this.props.i18nOLD.text.get(
          "plugin.chat.notification.messageDeleteFail"
        ),
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
            __html: this.props.i18nOLD.text.get(
              "plugin.chat.messages.deleteMessageDesc"
            ),
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
          {this.props.i18nOLD.text.get("plugin.chat.button.deleteRMessage")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get("plugin.chat.button.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18nOLD.text.get(
          "plugin.chat.messages.deleteMessageTitle"
        )}
        content={content}
        footer={footer}
        modifier="delete-room"
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteMessageDialog);
