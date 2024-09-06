import React, { useReducer } from "react";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import DatePicker from "react-datepicker";
import Button from "~/components/general/button";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { ContactType, Student } from "~/generated/client";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import MApi, { isMApiError } from "~/api/api";
import { StatusType } from "~/reducers/base/status";
import { ContactRecipientType } from "~/reducers/user-index";

interface NewContactEventProps {
  status: StatusType;
  userIdentifier: string;
  selectedItems: ContactRecipientType[];
  onRecipientsChange: (students: Student[]) => void;
  isOpen?: boolean;
  onClose?: () => void;
  children: any;
}

type Recipients = {
  recipientIds: number[];
  recipientGroupIds: number[];
  recipientStudentsWorkspaceIds: number[];
};

type ContactLogEntry = {
  text: string;
  type: ContactType;
  entryDate: Date;
};

interface ContactEventPayload {
  recipients: Recipients;
  contactLogEntry: ContactLogEntry;
}

interface NewContactEventState {
  recipientIds: number[];
  recipientGroupIds: number[];
  recipientStudentsWorkspaceIds: number[];
  text: string;
  type: ContactType;
  entryDate: Date;
  locked: boolean;
}

type Action =
  | { type: "SET_RECIPIENTS"; payload: number[] }
  | { type: "SET_RECIPIENT_GROUPS"; payload: number[] }
  | { type: "SET_RECIPIENT_WORKSPACES"; payload: number[] }
  | { type: "SET_CONTACT_LOG_ENTRY_DATE"; payload: Date }
  | { type: "SET_CONTACT_LOG_ENTRY_TYPE"; payload: ContactType }
  | { type: "SET_CONTACT_LOG_ENTRY_TEXT"; payload: string }
  | { type: "SET_LOCKED"; payload: boolean }
  | { type: "RESET" };

const initialState: NewContactEventState = {
  recipientIds: [],
  recipientGroupIds: [],
  recipientStudentsWorkspaceIds: [],
  text: "",
  type: "OTHER",
  entryDate: new Date(),
  locked: false,
};

const reducer = (
  state: NewContactEventState,
  action: Action
): NewContactEventState => {
  switch (action.type) {
    case "SET_RECIPIENTS":
      return { ...state, recipientIds: action.payload };
    case "SET_RECIPIENT_GROUPS":
      return { ...state, recipientGroupIds: action.payload };
    case "SET_RECIPIENT_WORKSPACES":
      return { ...state, recipientStudentsWorkspaceIds: action.payload };
    case "SET_CONTACT_LOG_ENTRY_DATE":
      return { ...state, entryDate: action.payload };
    case "SET_CONTACT_LOG_ENTRY_TYPE":
      return { ...state, type: action.payload };
    case "SET_CONTACT_LOG_ENTRY_TEXT":
      return { ...state, text: action.payload };
    case "SET_LOCKED":
      return { ...state, locked: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

const NewContactEvent: React.FC<NewContactEventProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    text,
    type,
    entryDate,
    recipientIds,
    recipientGroupIds,
    recipientStudentsWorkspaceIds,
    locked,
  } = state;
  const { userIdentifier, isOpen, status, selectedItems, children, onClose } =
    props;
  const { t } = useTranslation("messaging");

  const handleRecipientsChange = (recipients: ContactRecipientType[]) => {
    const workspaceIds = recipients.map((recipient) =>
      recipient.type === "workspace" ? recipient.value.id : null
    );
    const groupIds = recipients.map((recipient) =>
      recipient.type === "usergroup" ? recipient.value.id : null
    );
    const recipientIds = recipients.map((recipient) =>
      recipient.type === "user" ? recipient.value.id : null
    );

    if (recipientIds) {
      dispatch({ type: "SET_RECIPIENTS", payload: recipientIds });
    }
    if (groupIds) {
      dispatch({ type: "SET_RECIPIENT_GROUPS", payload: groupIds });
    }
    if (workspaceIds) {
      dispatch({ type: "SET_RECIPIENT_WORKSPACES", payload: workspaceIds });
    }
  };

  const handleDateChange = (date: Date) => {
    dispatch({ type: "SET_CONTACT_LOG_ENTRY_DATE", payload: date });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "SET_CONTACT_LOG_ENTRY_TYPE",
      payload: e.target.value as ContactType,
    });
  };

  const handleCkEditorChange = (text: string) => {
    dispatch({ type: "SET_CONTACT_LOG_ENTRY_TEXT", payload: text });
  };

  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const contactTypesArray = Object.values(ContactType);

  /**
   * inputContactsAutofillLoaders
   */
  const inputContactsAutofillLoaders = () => {
    const guiderApi = MApi.getGuiderApi();

    return {
      studentsLoader: (searchString: string) => () =>
        guiderApi.getGuiderStudents({
          q: searchString,
          includeInactiveStudents: false,
        }),
    };
  };

  /**
   * content
   */
  const content = () => (
    <>
      <div className="env-dialog__row env-dialog__row--new-contact-event">
        <InputContactsAutofill
          identifier="communicatorRecipients"
          modifier="new-message"
          key="new-message-1"
          showFullNames={true}
          loaders={inputContactsAutofillLoaders()}
          hasGroupPermission={status.permissions.COMMUNICATOR_GROUP_MESSAGING}
          hasWorkspacePermission={
            status.permissions.COMMUNICATOR_GROUP_MESSAGING
          }
          placeholder={t("labels.search", { context: "recipients" })}
          label={t("labels.recipients", {
            ns: "messaging",
            count: recipientIds.length,
          })}
          selectedItems={selectedItems}
          onChange={handleRecipientsChange}
          // autofocus={!this.props.initialSelectedItems}
        />
      </div>
      <div className="env-dialog__row env-dialog__row--new-contact-event">
        <div className="env-dialog__form-element-container env-dialog__form-element-container--new-contact-event">
          <label htmlFor="contactEventdate" className="env-dialog__label">
            {t("labels.create", {
              ns: "messaging",
              context: "contactEvent",
            })}
          </label>
          <DatePicker
            className="env-dialog__input"
            id="contactEventdate"
            onChange={handleDateChange}
            locale={outputCorrectDatePickerLocale(localize.language)}
            selected={entryDate}
            dateFormat="P"
          ></DatePicker>
        </div>
        <div className="env-dialog__form-element-container">
          <label htmlFor="contactEventTypes" className="env-dialog__label">
            {t("labels.type")}
          </label>
          <select
            id="contactEventTypes"
            className="env-dialog__select"
            onChange={handleTypeChange}
            value={type}
          >
            {contactTypesArray.map((contactType) => (
              <option key={contactType} value={contactType}>
                {t("labels.type", {
                  context: contactType,
                  ns: "messaging",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="env-dialog__row"></div>
      <div className="env-dialog__row env-dialog__row--ckeditor">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {t("labels.message", { ns: "messaging" })}
          </label>
          <CKEditor
            editorTitle={t("labels.create", {
              ns: "messaging",
              context: "message",
            })}
            onChange={handleCkEditorChange}
          >
            {text}
          </CKEditor>
        </div>
      </div>
    </>
  );

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="env-dialog__actions">
      <Button buttonModifiers="dialog-execute" disabled={locked}>
        {t("actions.send")}
      </Button>
      <Button
        buttonModifiers="dialog-cancel"
        onClick={closeDialog}
        disabled={locked}
      >
        {t("actions.cancel")}
      </Button>
      {/* {recovered ? (
        <Button
          buttonModifiers="dialog-clear"
          onClick={clearUp}
          disabled={locked}
        >
          {t("actions.remove", { context: "draft" })}
        </Button>
      ) : null} */}
    </div>
  );
  return (
    <EnvironmentDialog
      modifier="new-contact-event"
      title={t("labels.create", {
        ns: "messaging",
        context: "contactEvent",
      })}
      content={content}
      footer={footer}
      //   onOpen={checkAgainstStoredState}
      //   onClose={this.props.onClose}
      isOpen={isOpen}
    >
      {children}
    </EnvironmentDialog>
  );
};

export default NewContactEvent;
