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
/**
 * CreateAbsenceDialogProps
 */
interface CreateAbsenceDialogProps {
  children?: React.ReactElement;
  workspaceId: number;
  workspaceEventContainerId: number;
  onClose?: () => void;
  onConfirm?: (form: AbsenceEventFormState) => void;
}

/**
 * AbsenceEventFormState
 */
export interface AbsenceEventFormState {
  selectedUsers: ContactRecipientType[];
  title: string;
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
      type: "SET_TITLE";
      payload: string;
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
const muikkuEventApi = MApi.getEventsApi();

/**
 * createInitialAbsenceEventFormState
 * @returns Initial absence event form state
 */
const createInitialAbsenceEventFormState = (): AbsenceEventFormState => ({
  selectedUsers: [],
  title: "",
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

    case "SET_TITLE":
      return { ...state, title: action.payload };

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
  const {
    children,
    workspaceId,
    workspaceEventContainerId,
    onClose,
    onConfirm,
  } = props;
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
   * @param onClose closes the dialog
   */
  const handleConfirm = async (
    absenceEvent: AbsenceEventFormState,
    onClose: () => void
  ) => {
    const { title, description, startDate, endDate } = absenceEvent;
    try {
      await muikkuEventApi.createEvent({
        muikkuEvent: {
          title,
          description,
          start: startDate?.toISOString(),
          end: endDate?.toISOString(),
          type: "ABSENCE",
          eventContainerId: workspaceEventContainerId,
        },
        users: formState.selectedUsers.map((u) => u.value.id),
      });
      dispatch(
        displayNotification(
          t("notifications.createSuccess", {
            ns: "events",
            context: "absence",
          }),
          "success"
        )
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        displayNotification(
          t("notifications.createError", {
            ns: "events",
            context: "absence",
          }),
          "error"
        )
      );
    }

    onConfirm?.(formState);
    onClose();
    dispatchForm({ type: "RESET" });
  };

  /**
   * Handles the closing of the dialog
   */
  const handleClose = () => {
    dispatchForm({ type: "RESET" });
    onClose?.();
  };

  /**
   * Renders the content of the dialog
   * @param onClose Dialog close handler
   * @returns JSX.Element
   */
  const content = (onClose: () => void) => (
    <div>
      <div className="form__row">
        <label htmlFor="absent-students">Valitse poissaolijat</label>
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
        <label htmlFor="absence-event">Poissaolotapahtuman nimi</label>
        <input
          id="absence-event"
          type="text"
          value={formState.title}
          onChange={(event) =>
            dispatchForm({ type: "SET_TITLE", payload: event.target.value })
          }
        />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-description">Poissaolotapahtuma kuvaus</label>
        <textarea
          className="form-element__textarea"
          id="absence-description"
          value={formState.description}
          onChange={(event) =>
            dispatchForm({
              type: "SET_DESCRIPTION",
              payload: event.target.value,
            })
          }
        />
      </div>
      <div className="form__row form__row--absence-event">
        <label htmlFor="absence-start">Tapahtuman alku</label>
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
        <label htmlFor="absence-end">Tapahtuman loppu</label>
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
    </div>
  );

  /**
   * Renders the footer of the dialog
   * @param onClose Dialog close handler
   * @returns JSX.Element
   */
  const footer = (onClose: () => void) => (
    <div className="dialog__footer">
      <div className="dialog__button-set">
        <Button
          className="button button--execute button--standard-ok"
          onClick={() => handleConfirm(formState, onClose)}
          disabled={formState.selectedUsers.length === 0}
        >
          {t("actions.create")}
        </Button>
        <Button
          className="button button--cancel button--standard-cancel"
          onClick={onClose}
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
      title={t("labels.newAbsence", { ns: "events" })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default CreateAbsenceDialog;
