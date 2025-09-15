// components/base/material-editorV2/exam-attendee-card.tsx
import * as React from "react";
import { ExamAttendee } from "~/generated/client";
import { localize } from "~/locales/i18n";
import Button from "~/components/general/button";
import { NumberFormatValues, NumericFormat } from "react-number-format";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

/**
 * Props for the ExamAttendeeCard component
 */
interface ExamAttendeeCardProps {
  attendee: ExamAttendee;
  onRemove: (attendeeId: number) => void;
  onUpdateSettings: (updatedAttendee: ExamAttendee) => Promise<void>;
}

/**
 * Individual exam attendee card component
 * Handles attendee-specific settings and display
 * @param props - ExamAttendeeCardProps
 */
export const ExamAttendeeCard = (props: ExamAttendeeCardProps) => {
  const { attendee, onRemove, onUpdateSettings } = props;

  const refrenceValueRef = React.useRef<ExamAttendee | null>(null);

  const [isEditing, setIsEditing] = React.useState(false);
  const [extraTimeMinutes, setExtraTimeMinutes] = React.useState<number>(
    attendee?.extraMinutes || 0
  );

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Initialize extra time when component mounts or attendee changes
  React.useEffect(() => {
    // Lets update the reference value and
    refrenceValueRef.current = attendee;
  }, [attendee]);

  /**
   * Handle extra time input change
   * @param newValue - NumberFormatValues
   */
  const handleExtraTimeChange = (newValue: NumberFormatValues) => {
    setExtraTimeMinutes(newValue.floatValue);
  };

  /**
   * Handle save settings
   */
  const handleSaveSettings = async () => {
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await onUpdateSettings({
        ...attendee,
        extraMinutes: extraTimeMinutes,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel editing - revert to original values
   */
  const handleCancel = () => {
    unstable_batchedUpdates(() => {
      setIsEditing(false);
      setError(null);
      setExtraTimeMinutes(refrenceValueRef.current?.extraMinutes || 0);
    });
  };

  /**
   * Handle start editing
   */
  const handleStartEditing = () => {
    unstable_batchedUpdates(() => {
      setIsEditing(true);
      setError(null);
    });
  };

  /**
   * Get exam status
   */
  const getExamStatus = () => {
    if (attendee.started && attendee.ended) {
      return "Valmis";
    } else if (attendee.started) {
      return "Käynnissä";
    } else {
      return "Ei aloitettu";
    }
  };

  /**
   * Get status color class
   */
  const getStatusColor = () => {
    if (attendee.started && attendee.ended) {
      return "material-editor__attendee-status--completed";
    } else if (attendee.started) {
      return "material-editor__attendee-status--in-progress";
    } else {
      return "material-editor__attendee-status--not-started";
    }
  };

  const isEnded = !!attendee.ended;
  const isStarted = !!attendee.started;

  // Check if there are unsaved changes
  // At the moment only extra time is editable so we only need to check if
  // that has changed
  const hasUnsavedChanges =
    extraTimeMinutes !== refrenceValueRef.current?.extraMinutes;

  return (
    <div
      className={`material-editor__attendee-card ${isEditing ? "material-editor__attendee-card--editing" : ""}`}
    >
      {/* Card Header */}
      <div className="material-editor__attendee-header">
        <div className="material-editor__attendee-header-title">
          {attendee.firstName} {attendee.lastName}
        </div>
        {attendee.line && (
          <div className="material-editor__attendee-line">
            ({attendee.line})
          </div>
        )}

        <div className="material-editor__attendee-header-actions">
          <Button
            icon="pencil"
            buttonModifiers={"edit-extra-row"}
            onClick={handleStartEditing}
            disabled={saving || isEditing}
            title="Muokkaa asetuksia"
          />

          <Button
            icon="trash"
            buttonModifiers={"remove-extra-row"}
            onClick={() => onRemove(attendee.id!)}
            disabled={saving}
            title="Poista osallistuja"
          />
        </div>
      </div>

      {/* Card Body */}
      <div className="material-editor__attendee-body">
        <div className="material-editor__attendee-meta">
          <span
            className={`material-editor__attendee-status  ${getStatusColor()} `}
          >
            {getExamStatus()}
          </span>
        </div>

        {isEnded ? (
          <div className="material-editor__attendee-dates">
            <div className="material-editor__attendee-date">
              <strong>Aloitettu:</strong>{" "}
              {localize.date(attendee.started, "l, LT")}
            </div>
            <div className="material-editor__attendee-date">
              <strong>Lopetettu:</strong>{" "}
              {localize.date(attendee.ended, "l, LT")}
            </div>
          </div>
        ) : isStarted ? (
          <div className="material-editor__attendee-dates">
            <div className="material-editor__attendee-date">
              <strong>Aloitettu:</strong>{" "}
              {localize.date(attendee.started, "l, LT")}
            </div>
          </div>
        ) : null}

        {/* Extra Time Settings */}
        <div className="material-editor__attendee-settings">
          <div className="form-element">
            <label
              htmlFor="extra-time"
              className="material-editor__attendee-label"
            >
              Lisäaika (minuuttia):
            </label>
            <NumericFormat
              id="extra-time"
              min={0}
              max={120}
              decimalScale={0}
              value={extraTimeMinutes}
              onValueChange={handleExtraTimeChange}
              className="form-element__input form-element__input--material-editor"
              disabled={saving || !isEditing}
            />
            {error && (
              <div className="material-editor__attendee-error">{error}</div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer - Only show when editing */}
      {isEditing && (
        <div className="material-editor__attendee-footer">
          <Button
            buttonModifiers={["standard-ok", "execute"]}
            onClick={handleSaveSettings}
            disabled={saving || !hasUnsavedChanges}
          >
            {saving ? "Tallennetaan..." : "Tallenna"}
          </Button>
          <Button
            buttonModifiers={["standard-cancel", "cancel"]}
            onClick={handleCancel}
            disabled={saving}
          >
            Peruuta
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExamAttendeeCard;
