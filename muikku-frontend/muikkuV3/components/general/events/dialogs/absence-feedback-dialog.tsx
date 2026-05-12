import * as React from "react";
import { useState } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { MuikkuEvent } from "~/generated/client";
import {
  createAbsenceEventProperty,
  updateAbsenceEventProperty,
} from "~/actions/main-function/guardian";
import { useDispatch } from "react-redux";
/**
 * AbsenceFeedbackDialogProps
 */
interface AbsenceFeedbackDialogProps {
  children?: React.ReactElement;
  absenceEvent?: MuikkuEvent;
  studentId: number;
  onClose?: () => void;
  onConfirm?: (
    explanation: string,
    eventId: number,
    propertyId?: number
  ) => void;
}

export const AbsenceFeedbackDialog: React.FC<AbsenceFeedbackDialogProps> = ({
  children,
  studentId,
  absenceEvent,
}) => {
  const dispatch = useDispatch();
  const currentAbsenceProperty = absenceEvent.properties.find(
    (property) => property.name === "ABSENCE_REASON"
  );

  const [absenceReason, setAbsenceReason] = useState<string>(
    currentAbsenceProperty?.value
  );

  const hasCurrentAbsenceReason =
    currentAbsenceProperty && currentAbsenceProperty.value !== "";

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
      <Button onClick={handleConfirm}>Confirm</Button>
    </div>
  );

  /**
   * Handles the confirmation of the dialog
   */
  const handleConfirm = () => {
    if (absenceReason.trim() !== "") {
      if (hasCurrentAbsenceReason) {
        dispatch(
          updateAbsenceEventProperty(studentId, {
            eventId: absenceEvent.id,
            propertyId: currentAbsenceProperty.id,
            value: absenceReason,
          })
        );
      } else {
        dispatch(
          createAbsenceEventProperty(studentId, {
            eventId: absenceEvent.id,
            name: "ABSENCE_REASON",
            value: absenceReason,
          })
        );
      }
    }
  };

  return (
    <Dialog
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
