import * as React from "react";
import { useReducer } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import DatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { useDispatch } from "react-redux";
import { AbsenceEventEnum } from "~/reducers/base/muikku-events";
import { updateWorkspaceAbsenceEvent } from "~/actions/workspaces/";
import { MuikkuEvent } from "~/generated/client";

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
    };

/**
 * createInitialAbsenceEventFormState
 * @returns Initial absence event form state
 */
/* const createInitialAbsenceEventFormState = (): AbsenceEventFormState => ({
  targetUser: null,
  type: AbsenceEventEnum.Lesson,
  description: "",
  startDate: new Date(),
  endDate: new Date(),
}); */

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
  const { children, workspaceEventContainerId, onConfirm, absenceEvent } =
    props;

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
  };

  const [formState, dispatchForm] = useReducer(
    absenceEventFormReducer,
    initialAbsenceEventFormState
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /**
   * studentsLoader
   * @param searchTerm Search term for student lookup
   * @returns Async loader function
   */

  /**
   * Handles the confirmation of the dialog
   * @param closeDialog Dialog close handler
   */
  const handleConfirm = (closeDialog: () => void) => {
    const { id } = absenceEvent;

    if (!workspaceEventContainerId || !id) {
      return;
    }

    dispatch(
      updateWorkspaceAbsenceEvent(id, {
        title: formState.type,
        type: "ABSENCE",
        description: formState.description,
        start: formState.startDate?.toISOString() ?? "",
        end: formState.endDate?.toISOString() ?? "",
        eventContainerId: workspaceEventContainerId,
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
          {t("actions.create", { ns: "common" })}
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
