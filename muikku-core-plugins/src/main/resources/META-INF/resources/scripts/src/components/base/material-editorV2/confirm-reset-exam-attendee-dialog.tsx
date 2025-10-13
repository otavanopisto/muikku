import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * ConfirmResetExamAttendeeDialogProps
 */
interface ConfirmResetExamAttendeeDialogProps {
  onConfirm: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * End exam warning dialog
 * @param props - EndExamWarningProps
 */
const ConfirmResetExamAttendeeDialog = (
  props: ConfirmResetExamAttendeeDialogProps
) => {
  const { children, onConfirm } = props;

  const { t } = useTranslation(["exams", "common"]);

  /**
   * Handles the end exam click
   * @param closeDialog - closeDialog
   */
  const handleConfirmClick =
    (closeDialog: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      closeDialog();
      onConfirm();
    };

  /**
   * Content of the dialog
   * @param closeDialog - closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      {t("content.resetExam", {
        ns: "exams",
      })}
    </div>
  );

  /**
   * Footer of the dialog
   * @param closeDialog - closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={handleConfirmClick(closeDialog)}
      >
        {t("actions.reset", {
          ns: "common",
        })}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="end-exam-warning"
      title={t("labels.resetExam", {
        ns: "exams",
      })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default ConfirmResetExamAttendeeDialog;
