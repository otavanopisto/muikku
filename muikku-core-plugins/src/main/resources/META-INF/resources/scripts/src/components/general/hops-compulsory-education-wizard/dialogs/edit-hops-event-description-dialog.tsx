import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface EditHopsEventDescriptionDialogProps {
  children?: React.ReactElement<any>;
  isOpen: boolean;
  content: JSX.Element;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface EditHopsEventDescriptionDialogState {
  scale: number;
  angle: number;
}

/**
 * MatriculationExaminationWizardDialog
 */
class EditHopsEventDescriptionDialog extends React.Component<
  EditHopsEventDescriptionDialogProps,
  EditHopsEventDescriptionDialogState
> {
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
    const content = (closeDialog: () => any) => this.props.content;

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.props.onSaveClick}
        >
          Päivitä
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
        title="Päivityksen kuvaus"
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

export default EditHopsEventDescriptionDialog;
