import Dialog from "~/components/general/dialog";
import React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * Props for the NewHopsEventDescriptionDialog component.
 * @interface NewHopsEventDescriptionDialogProps
 */
interface NewHopsEventDescriptionDialogProps {
  /** Optional child element to be rendered inside the dialog */
  children?: React.ReactElement;
  /** Determines whether the dialog is open or closed */
  isOpen: boolean;
  /** The main content of the dialog */
  content: JSX.Element;
  /** Callback function to be called when the save button is clicked */
  onSaveClick?: () => void;
  /** Callback function to be called when the cancel button is clicked */
  onCancelClick?: () => void;
}

/**
 * A dialog component for displaying and managing new HOPS event descriptions.
 * @param props - The component props
 * @returns A React functional component
 */
const NewHopsEventDescriptionDialog: React.FC<
  NewHopsEventDescriptionDialogProps
> = (props) => {
  const { children, isOpen, content, onSaveClick, onCancelClick } = props;
  const { t } = useTranslation(["common"]);

  /**
   * Renders the dialog content
   * @returns The dialog content
   */
  const dialogContent = () => content;

  /**
   * Renders the dialog footer
   * @returns The dialog footer
   */
  const footer = () => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={onSaveClick}
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={onCancelClick}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="confirm-remove-answer-dialog"
      disableScroll={true}
      title={t("labels.save", {
        ns: "common",
        context: "changes",
      })}
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
