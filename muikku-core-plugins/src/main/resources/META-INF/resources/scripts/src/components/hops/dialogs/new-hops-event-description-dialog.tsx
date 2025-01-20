import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface NewHopsEventDescriptionDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen: boolean;
  content: JSX.Element;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface NewHopsEventDescriptionDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class NewHopsEventDescriptionDialog extends React.Component<
  NewHopsEventDescriptionDialogProps,
  NewHopsEventDescriptionDialogState
> {
  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: NewHopsEventDescriptionDialogProps) {
    super(props);
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
          onClick={this.props.onSaveClick}
        >
          Ok
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.props.onCancelClick}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title="Muokkaa kuvausta"
        onClose={this.props.onCancelClick}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default NewHopsEventDescriptionDialog;
