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
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industrys standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => never) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={this.cancel(closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.confirmPublishPageWithAnswers.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        isOpen={this.props.dialogOpen}
        title="Ilmoittaudu ylioppilaskokeisiin"
        content={content}
        footer={footer}
        modifier={["wizard", "matriculation"]}
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
