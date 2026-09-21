import * as React from "react";
import { useReducer } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { useDispatch } from "react-redux";
import { updateWorkspaceAbsenceEvent } from "~/actions/workspaces/";
import { MuikkuEvent, MuikkuEventProperty } from "~/generated/client";
import { displayNotification } from "~/actions/base/notifications";
import AnimateHeight from "react-animate-height";
import {
  AbsenceEventEnum,
  AbsenceReasonEnum,
} from "~/reducers/base/muikku-events";

/**
 * CreateAbsenceDialogProps
 */
interface CreateAbsenceDialogProps {
  children?: React.ReactElement;
  absenceEvent: MuikkuEvent;
  workspaceId?: number;
  workspaceEventContainerId?: number;
  onConfirm?: (form: AbsenceEventFormState) => void;
}

/**
 * AbsenceEventFormState
 */
export interface AbsenceEventFormState {
  targetUser: number | null;
  type: AbsenceEventEnum;
  description: string;
  absenceReason: AbsenceReasonEnum | null;
  absenceReasonVisible: boolean;
  startDate: Date | null;
  endDate: Date | null;
}

type AbsenceEventFormAction =
  | {
      type: "SET_TYPE";
      payload: AbsenceEventEnum;
    }
  | {
      type: "SET_DESCRIPTION";
      payload: string;
    }
  | {
      type: "SET_START_DATE";
      payload: Date | null;
    }
  | {
      type: "SET_END_DATE";
      payload: Date | null;
    }
  | {
      type: "SHOW_ABSENCE_REASON";
      payload: boolean;
    }
  | {
      type: "SET_ABSENCE_REASON";
      payload: AbsenceReasonEnum | null;
    };

/**
 * absenceEventFormReducer
 * @param state Current form state
 * @param action Reducer action
 * @returns Updated form state
 */
const absenceEventFormReducer = (
  state: AbsenceEventFormState,
  action: AbsenceEventFormAction
): AbsenceEventFormState => {
  switch (action.type) {
    case "SET_TYPE":
      return { ...state, type: action.payload };

    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };

    case "SET_START_DATE":
      return { ...state, startDate: action.payload };

    case "SET_END_DATE":
      return { ...state, endDate: action.payload };
    case "SHOW_ABSENCE_REASON":
      return {
        ...state,
        absenceReasonVisible: action.payload,
        absenceReason: action.payload ? state.absenceReason : null,
      };

    case "SET_ABSENCE_REASON":
      return { ...state, absenceReason: action.payload };

    default:
      return state;
  }
};

/**
 * CreateAbsenceDialog
 * @param props Component props
 * @returns JSX.Element
 */
export const EditAbsenceDialog: React.FC<CreateAbsenceDialogProps> = (
  props
) => {
  const { children, onConfirm, absenceEvent } = props;

  const currentAbsenceReason = absenceEvent.properties?.find(
    (property) => property.name === "ABSENCE_REASON"
  )?.value as AbsenceReasonEnum | null;

  /**
   * initialAbsenceEventFormState
   * @returns Initial absence event form state
   */
  const initialAbsenceEventFormState: AbsenceEventFormState = {
    targetUser: absenceEvent.userEntityId ?? null,
    type: (absenceEvent.title as AbsenceEventEnum) || AbsenceEventEnum.Lesson,
    description: absenceEvent.description ?? "",
    startDate: new Date(absenceEvent.start),
    endDate: new Date(absenceEvent.end),
    absenceReason: currentAbsenceReason,
    absenceReasonVisible:
      absenceEvent.properties?.some(
        (property) => property.name === "ABSENCE_REASON"
      ) ?? false,
  };

  const [formState, dispatchForm] = useReducer(
    absenceEventFormReducer,
    initialAbsenceEventFormState
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  /**
   * Handles the confirmation of the dialog
   * @param closeDialog Dialog close handler
   */
  const handleConfirm = (closeDialog: () => void) => {
    const { id, start, end, eventContainerId } = absenceEvent;

    if (!start || !end) {
      if (!start) {
        dispatch(
          displayNotification(
            t("notifications.startDateRequired", { ns: "events" }),
            "error"
          )
        );
      }
      if (!end) {
        dispatch(
          displayNotification(
            t("notifications.endDateRequired", { ns: "events" }),
            "error"
          )
        );
      }

      return;
    }

    const properties: MuikkuEventProperty[] = [
      ...(absenceEvent.properties ?? []),
    ];

    if (formState.absenceReason) {
      if (currentAbsenceReason) {
        const currentAbsenceReasonIndex = properties.findIndex(
          (property) => property.name === "ABSENCE_REASON"
        );
        if (currentAbsenceReasonIndex !== -1) {
          properties[currentAbsenceReasonIndex].value = formState.absenceReason;
        }
      } else {
        properties.push({
          name: "ABSENCE_REASON",
          value: formState.absenceReason,
        } as MuikkuEventProperty);
      }
    }

    dispatch(
      updateWorkspaceAbsenceEvent(id, {
        title: formState.type,
        type: "ABSENCE",
        description: formState.description,
        start: formState.startDate?.toISOString(),
        end: formState.endDate?.toISOString(),
        eventContainerId,
        properties,
      })
    );
    onConfirm?.(formState);
    closeDialog();
  };

  /**
   * Handles the closing of the dialog
   * @param closeDialog Dialog close handler
   */
  const handleClose = (closeDialog?: () => void) => {
    closeDialog?.();
  };

  /**
   * Toggles the absence reason field and clears it when hidden.
   * @param event checkbox change event
   */
  const handleAbsenceReasonVisibleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatchForm({
      type: "SHOW_ABSENCE_REASON",
      payload: event.target.checked,
    });
  };

  /**
   * Renders the content of the dialog
   * @param closeDialog Dialog close handler
   * @returns JSX.Element
   */
  const content = (closeDialog: () => void) => (
    <form>
      <div className="form__row">
        <label htmlFor="absent-students">{absenceEvent.targetUserName}</label>
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-type">
          {t("labels.absenceType", { ns: "events" })}
        </label>
        <select
          id="absence-type"
          className="form-element__select"
          value={formState.type}
          onChange={(event) =>
            dispatchForm({
              type: "SET_TYPE",
              payload: event.target.value as AbsenceEventEnum,
            })
          }
        >
          {Object.values(AbsenceEventEnum).map((type) => (
            <option key={type} value={type}>
              {t(`types.${type}`, { ns: "events", defaultValue: type })}
            </option>
          ))}
        </select>
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-description">
          {t("labels.absenceEventDescription", { ns: "events" })}
        </label>
        <textarea
          className="form-element__textarea"
          id="absence-description"
          value={formState.description}
          placeholder={t("labels.absenceEventDescriptionPlaceholder", {
            ns: "events",
          })}
          onChange={(event) =>
            dispatchForm({
              type: "SET_DESCRIPTION",
              payload: event.target.value,
            })
          }
        />
      </div>
      <div className="form__row form__row--absence-event-reason">
        <label htmlFor="absence-reason-visible">
          {t("labels.absenceReasonVisible", {
            ns: "events",
            defaultValue: "Absence reason visible",
          })}
        </label>
        <input
          id="absence-reason-visible"
          type="checkbox"
          disabled={!!currentAbsenceReason}
          checked={formState.absenceReasonVisible}
          onChange={handleAbsenceReasonVisibleChange}
        />

        <AnimateHeight height={formState.absenceReasonVisible ? "auto" : 0}>
          <div className="form__row form__row--absence-event">
            <label htmlFor="absence-reason">
              {t("labels.selectAbsenceReason", { ns: "events" })}
            </label>
            <select
              id="absence-reason"
              className="form-element__select"
              value={formState.absenceReason ?? ""}
              onChange={(event) =>
                dispatchForm({
                  type: "SET_ABSENCE_REASON",
                  payload: event.target.value
                    ? (event.target.value as AbsenceReasonEnum)
                    : null,
                })
              }
            >
              <option disabled={!!currentAbsenceReason} value="">
                {t("labels.select", { ns: "common" })}
              </option>
              {Object.values(AbsenceReasonEnum).map((reason) => (
                <option key={reason} value={reason}>
                  {t(`reasons.${reason}`, {
                    ns: "events",
                    defaultValue: reason,
                  })}
                </option>
              ))}
            </select>
          </div>
        </AnimateHeight>
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-start">
          {t("labels.eventBeginning", { ns: "events" })}
        </label>
        <DatePicker
          id="absence-start"
          selected={formState.startDate}
          onChange={(date: Date | null) =>
            dispatchForm({ type: "SET_START_DATE", payload: date })
          }
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          locale={outputCorrectDatePickerLocale(localize.language)}
        />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-end">
          {t("labels.eventEnding", { ns: "events" })}
        </label>
        <DatePicker
          id="absence-end"
          selected={formState.endDate}
          onChange={(date: Date | null) =>
            dispatchForm({ type: "SET_END_DATE", payload: date })
          }
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="Pp"
          minDate={formState.startDate ?? undefined}
          locale={outputCorrectDatePickerLocale(localize.language)}
        />
      </div>
    </form>
  );

  /**
   * Renders the footer of the dialog
   * @param closeDialog Dialog close handler
   * @returns JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__footer">
      <div className="dialog__button-set">
        <Button
          className="button button--execute button--standard-ok"
          onClick={() => handleConfirm(closeDialog)}
        >
          {t("actions.save", { ns: "common" })}
        </Button>
        <Button
          className="button button--cancel button--standard-cancel"
          onClick={closeDialog}
        >
          {t("actions.cancel", { ns: "common" })}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      onClose={handleClose}
      closeOnOverlayClick={false}
      modifier="create-absence"
      title={t("labels.editAbsence", { ns: "events" })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default EditAbsenceDialog;
