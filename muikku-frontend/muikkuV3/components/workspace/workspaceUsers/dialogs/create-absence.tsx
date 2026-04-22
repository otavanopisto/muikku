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
import MApi from "~/api/api";

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
        firstName: student.firstName,
        lastName: student.lastName,
      })
    );
  };
  /**
   * Handles the confirmation of the dialog
   */
  const handleConfirm = async (absenceEvent: AbsenceEventFormState) => {
    const { title, description, startDate, endDate } = absenceEvent;
    await muikkuEventApi.createEvent({
      muikkuEvent: {
        title,
        description,
        start: startDate?.toISOString(),
        end: endDate?.toISOString(),
        allDay: false,
        editable: true,
        removable: false,
        type: "ABSENCE",
        isPrivate: true,
        eventContainerId: workspaceEventContainerId,
      },
      users: formState.selectedUsers.map((u) => u.value.identifier),
    });

    onConfirm?.(formState);
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
    <div className="dialog-footer">
      <Button onClick={onClose}>Cancel</Button>
      <Button
        onClick={handleConfirm}
        disabled={formState.selectedUsers.length === 0}
      >
        Confirm
      </Button>
    </div>
  );

  return (
    <Dialog
      onClose={handleClose}
      modifier="create-absence"
      title="Create Absence"
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default CreateAbsenceDialog;
