import Dialog from "~/components/general/dialog";
import React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";

interface NewHopsEventDescriptionDialogProps {
  children?: React.ReactElement;
  isOpen: boolean;
  content: JSX.Element;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
}

const NewHopsEventDescriptionDialog: React.FC<
  NewHopsEventDescriptionDialogProps
> = ({ children, isOpen, content, onSaveClick, onCancelClick }) => {
  const dialogContent = () => content;

  const footer = () => (
    <div className="dialog__button-set">
      <Button buttonModifiers={["standard-ok", "fatal"]} onClick={onSaveClick}>
        Ok
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={onCancelClick}
      >
        Peruuta
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="confirm-remove-answer-dialog"
      disableScroll={true}
      title="Tapahtuman kuvaus"
      content={dialogContent}
      footer={footer}
      isOpen={isOpen}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

export default NewHopsEventDescriptionDialog;
