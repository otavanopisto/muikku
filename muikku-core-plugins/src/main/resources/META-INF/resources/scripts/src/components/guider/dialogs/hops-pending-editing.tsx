import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";

/**
 * Props for the HopsPendingEditing component
 */
interface HopsPendingEditingProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Renders the HOPS pending editing dialog
 * @param props - Component props
 * @returns The rendered HopsPendingEditing component
 */
const HopsPendingEditing: React.FC<HopsPendingEditingProps> = (props) => {
  const { isOpen, onConfirm, onCancel } = props;

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
        <p>{t("content.hopsPendingEditingWarning", { ns: "hops_new" })}</p>
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
        {t("actions.continue", { ns: "hops_new" })}
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
      modifier="confirm-remove-answer-dialog"
      disableScroll={true}
      title={t("labels.hopsPendingChangesTitle", { ns: "hops_new" })}
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
      isOpen={isOpen}
    />
  );
};

export default HopsPendingEditing;
