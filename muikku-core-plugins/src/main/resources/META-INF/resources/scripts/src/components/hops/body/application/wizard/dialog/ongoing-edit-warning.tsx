import Dialog from "~/components/general/dialog";
import React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * Props for the EditHopsEventDescriptionDialog component
 */
interface OngoingWarningDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactElement;
}

/**
 * A dialog component for editing the description of a HOPS event
 * @param props - The component props
 * @returns A React functional component
 */
const OngoingWarningDialog: React.FC<OngoingWarningDialogProps> = (props) => {
  const { isOpen, onConfirm, onCancel, children } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Handles the save button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleConfirmClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onConfirm();
    };

  /**
   * Handles the cancel button click
   * @param closePortal - Function to close the dialog
   * @returns Click event handler
   */
  const handleCancelClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onCancel();
    };

  /**
   * Renders the dialog content
   * @returns The dialog content
   */
  const dialogContent = () => (
    <div className="hops-container__row">
      <div className="hops__form-element-container">
        <p>{t("content.hopsFormUnsavedChanges", { ns: "hops_new" })}</p>
      </div>
    </div>
  );

  /**
   * Renders the dialog footer
   * @param closePortal - Function to close the dialog
   * @returns The dialog footer
   */
  const footer = (closePortal: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleConfirmClick(closePortal)}
      >
        {t("actions.continue")}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCancelClick(closePortal)}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="ongoing-edit-warning-dialog"
      disableScroll={true}
      title={t("labels.hopsFormWarningTitle", { ns: "hops_new" })}
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
      isOpen={isOpen}
    >
      {children}
    </Dialog>
  );
};

export default OngoingWarningDialog;
