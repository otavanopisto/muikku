import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WarningDialogProps
 */
interface WarningDialogProps extends WithTranslation {
  title: string;
  content: JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  onApproveClick?: () => void;
}

/**
 * WarningDialogState
 */
interface WarningDialogState {}

/**
 * WarningDialog
 */
class WarningDialog extends React.Component<
  WarningDialogProps,
  WarningDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WarningDialogProps) {
    super(props);
    this.state = {};

    this.handleApproveClick = this.handleApproveClick.bind(this);
  }

  /**
   * handleSaveClick
   * @param closeDialog closeDialog
   */
  handleApproveClick(closeDialog: () => void) {
    this.props.onApproveClick && this.props.onApproveClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => this.props.content;

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.handleApproveClick.bind(this, closeDialog)}
        >
          {this.props.i18n.t("actions.confirmCancel", {
            ns: "pedagogySupportPlan",
          })}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel", { ns: "common" })}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title={this.props.title}
        content={content}
        footer={footer}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default withTranslation(["pedagogySupportPlan", "common"])(
  WarningDialog
);
