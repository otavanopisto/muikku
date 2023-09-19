import * as React from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * DeleteDialogProps
 */
interface DeleteDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onDeleteAudio: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
}

/**
 * DeleteDialogState
 */
interface DeleteDialogState {}

/**
 * DeleteDialog
 */
class DeleteDialog extends React.Component<
  DeleteDialogProps,
  DeleteDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteDialogProps) {
    super(props);

    this.handleDeleteAudioFieldClick =
      this.handleDeleteAudioFieldClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   * @param closeDialog closeDialog
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDeleteAudioFieldClick(closeDialog: () => any) {
    this.props.onDeleteAudio();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * footer
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleDeleteAudioFieldClick.bind(this, closeDialog)}
        >
          {this.props.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (closeDialog: () => any) => (
      <div>{this.props.t("content.removing", { ns: "evaluation" })}</div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.t("labels.remove", { ns: "evaluation" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default withTranslation()(DeleteDialog);
