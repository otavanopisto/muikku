import * as React from "react";
import { useState } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { MuikkuEvent } from "~/mock/absence";

/**
 * AbsenceFeedbackDialogProps
 */
interface AbsenceFeedbackDialogProps {
  children?: React.ReactElement;
  absenceEvent: MuikkuEvent;
  onClose?: () => void;
  onConfirm?: (explanation: string, eventId: number) => void;
}

export const AbsenceFeedbackDialog: React.FC<AbsenceFeedbackDialogProps> = ({
  onClose,
  onConfirm,
  children,
  absenceEvent,
}) => {
  const [absenceReason, setAbsenceReason] = useState<string>("");

  /**
   * Renders the content of the dialog
   * @param onClose function to handle dialog close
   * @returns JSX.Element
   */
  const content = (onClose: () => void) => (
    <div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-reason">Poissaolotapahtuman selitys</label>
        <textarea
          className="form__textarea"
          id="absence-reason"
          value={absenceReason}
          onChange={(e) => setAbsenceReason(e.target.value)}
        />
      </div>
    </div>
  );

  /**
   * Renders the footer of the dialog
   * @param onClose function to handle dialog close
   * @returns JSX.Element
   */
  const footer = (onClose: () => void) => (
    <div className="dialog-footer">
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={handleConfirm} disabled={absenceReason.trim() === ""}>
        Confirm
      </Button>
    </div>
  );

  /**
   * Handles the confirmation of the dialog
   */
  const handleConfirm = () => {
    if (absenceReason.trim() !== "") {
      onConfirm(absenceReason, absenceEvent.id);
    }
  };

  /**
   * Handles the closing of the dialog
   */
  const handleClose = () => {
    setAbsenceReason("");
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      modifier="absence-feedback"
      title="Absence Feedback"
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default AbsenceFeedbackDialog;
