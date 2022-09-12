import Dialog from "~/components/general/dialog";
import {
  CloseNotificationDialogTrigger,
  closeNotificationDialog,
} from "~/actions/base/notifications";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";

/**
 * DisconnectedWarningDialogProps
 */
interface DisconnectedWarningDialogProps {
  i18n: i18nType;
  dialogOpen: boolean;
  dialogMessage: string;
  closeNotificationDialog: CloseNotificationDialogTrigger;
  children?: React.ReactElement;
}

/**
 * DisconnectedWarnindDialogState
 */
interface DisconnectedWarningDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class DisconnectedWarningDialog extends React.Component<
  DisconnectedWarningDialogProps,
  DisconnectedWarningDialogState
> {
  /**
   * cancel
   * @param closeDialog closeDialog
   */
  cancel =
    (closeDialog?: () => never) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      closeDialog && closeDialog();
      this.props.closeNotificationDialog();
    };

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => never) => (
      <div>{this.props.dialogMessage}</div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => never) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["disconnect-warning"]}
          onClick={this.cancel(closeDialog)}
        >
          {this.props.i18n.text.get("plugin.server.unreachable.button.close")}
        </Button>
      </div>
    );

    return (
      <Dialog
        isOpen={this.props.dialogOpen}
        title={this.props.i18n.text.get("plugin.server.unreachable.title")}
        content={content}
        footer={footer}
        modifier={["disconnect-warning"]}
        closeOnOverlayClick={false}
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
    i18n: state.i18n,
    dialogOpen: state.notifications.notificationDialogOpen,
    dialogMessage: state.notifications.dialogMessage,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return { closeNotificationDialog };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisconnectedWarningDialog);
