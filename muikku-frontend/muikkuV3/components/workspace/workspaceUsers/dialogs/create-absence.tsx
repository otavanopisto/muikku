import * as React from "react";
import { useReducer } from "react";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { ContactRecipientType } from "~/reducers/user-index";
import DatePicker from "react-datepicker";
import {
  WorkspaceStudent,
  User,
  GetWorkspaceStudentsRequest,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { displayNotification } from "~/actions/base/notifications";
import { useDispatch } from "react-redux";
import { AbsenceEventEnum } from "~/reducers/base/muikku-events";
import { createWorkspaceAbsenceEvent } from "~/actions/workspaces/";
/**
 * CreateAbsenceDialogProps
 */
interface CreateAbsenceDialogProps {
  children?: React.ReactElement;
  workspaceId?: number;
  workspaceEventContainerId?: number;
  onConfirm?: (form: AbsenceEventFormState) => void;
}

/**
 * AbsenceEventFormState
 */
export interface AbsenceEventFormState {
  selectedUsers: ContactRecipientType[];
  type: AbsenceEventEnum;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

type AbsenceEventFormAction =
  | {
      type: "SET_SELECTED_USERS";
      payload: ContactRecipientType[];
    }
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
      type: "RESET";
    };

const workspaceApi = MApi.getWorkspaceApi();

/**
 * createInitialAbsenceEventFormState
 * @returns Initial absence event form state
 */
const createInitialAbsenceEventFormState = (): AbsenceEventFormState => ({
  selectedUsers: [],
  type: AbsenceEventEnum.Lesson,
  description: "",
  startDate: new Date(),
  endDate: new Date(),
});

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
    case "SET_SELECTED_USERS":
      return { ...state, selectedUsers: action.payload };

    case "SET_TYPE":
      return { ...state, type: action.payload };

    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };

    case "SET_START_DATE":
      return { ...state, startDate: action.payload };

    case "SET_END_DATE":
      return { ...state, endDate: action.payload };

    case "RESET":
      return createInitialAbsenceEventFormState();

    default:
      return state;
  }
};

/**
 * CreateAbsenceDialog
 * @param props Component props
 * @returns JSX.Element
 */
export const CreateAbsenceDialog: React.FC<CreateAbsenceDialogProps> = (
  props
) => {
  const { children, workspaceId, workspaceEventContainerId, onConfirm } = props;
  const [formState, dispatchForm] = useReducer(
    absenceEventFormReducer,
    undefined,
    createInitialAbsenceEventFormState
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /**
   * studentsLoader
   * @param searchTerm Search term for student lookup
   * @returns Async loader function
   */
  const studentsLoader = (searchTerm: string) => async (): Promise<User[]> => {
    const request: GetWorkspaceStudentsRequest = {
      q: searchTerm,
      workspaceEntityId: workspaceId,
    };

    const search = await workspaceApi.getWorkspaceStudents(request);

    return search.results.map(
      (student: WorkspaceStudent): User => ({
        id: student.userEntityId,
        identifier: student.userIdentifier,
        firstName: student.firstName,
        lastName: student.lastName,
      })
    );
  };

  /**
   * Handles the confirmation of the dialog
   * @param absenceEvent event from form
   * @param closeDialog closes the dialog
   */
  const handleConfirm = (
    absenceEvent: AbsenceEventFormState,
    closeDialog: () => void
  ) => {
    const { type, description, startDate, endDate } = absenceEvent;

    if (!startDate || !endDate) {
      if (!startDate) {
        dispatch(
          displayNotification(
            t("notifications.startDateRequired", { ns: "events" }),
            "error"
          )
        );
      }
      if (!endDate) {
        dispatch(
          displayNotification(
            t("notifications.endDateRequired", { ns: "events" }),
            "error"
          )
        );
      }

      return;
    }

    dispatch(
      createWorkspaceAbsenceEvent(
        {
          title: type,
          description,
          start: startDate?.toISOString(),
          end: endDate?.toISOString(),
          eventContainerId: workspaceEventContainerId!,
        },
        formState.selectedUsers.map((user) => user.value.id)
      )
    );
    onConfirm?.(formState);
    closeDialog();
  };

  /**
   * Handles the closing of the dialog
   * @param closeDialog Dialog close handler
   */
  const handleClose = (closeDialog?: () => void) => {
    dispatchForm({ type: "RESET" });
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
        <label htmlFor="absent-students">
          {t("labels.pickAbsenceStudents", { ns: "events" })}
        </label>
        <InputContactsAutofill
          modifier="absence-dialog"
          loaders={{ studentsLoader }}
          hasGroupPermission={false}
          hasStaffPermission={false}
          hasWorkspacePermission={false}
          identifier="absent-students"
          selectedItems={formState.selectedUsers}
          onChange={(selectedUsers) =>
            dispatchForm({ type: "SET_SELECTED_USERS", payload: selectedUsers })
          }
          showFullNames
        />
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
          onClick={() => handleConfirm(formState, closeDialog)}
          disabled={formState.selectedUsers.length === 0}
        >
          {t("actions.create")}
        </Button>
        <Button
          className="button button--cancel button--standard-cancel"
          onClick={closeDialog}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      onClose={handleClose}
      closeOnOverlayClick={false}
      modifier="create-absence"
      title={t("labels.markAbsence", { ns: "events" })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default CreateAbsenceDialog;
