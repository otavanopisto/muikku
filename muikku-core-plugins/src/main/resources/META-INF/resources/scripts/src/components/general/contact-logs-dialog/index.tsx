import React, { useReducer, useEffect } from "react";
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
import moment from "moment";
import { CreateMultipleContactLogEventsRequest } from "~/generated/client/models/CreateMultipleContactLogEventsRequest";
import { useLocalStorage } from "usehooks-ts";
interface NewContactEventProps {
  status: StatusType;
  userIdentifier: string;
  selectedItems: ContactRecipientType[];
  isOpen?: boolean;
  onClose?: () => void;
  children: any;
}

type Recipients = {
  recipientIds: number[];
  recipientGroupIds: number[];
  recipientStudentsWorkspaceIds: number[];
};

interface NewContactEventState {
  recipients: ContactRecipientType[];
  text: string;
  type: ContactType;
  entryDate: Date;
  draft: boolean;
  locked: boolean;
}

type Action =
  | { type: "SET_RECIPIENTS"; payload: ContactRecipientType[] }
  | { type: "SET_CONTACT_LOG_ENTRY_DATE"; payload: Date }
  | { type: "SET_CONTACT_LOG_ENTRY_TYPE"; payload: ContactType }
  | { type: "SET_CONTACT_LOG_ENTRY_TEXT"; payload: string }
  | { type: "SET_LOCKED"; payload: boolean }
  | { type: "SET_ALL"; payload: NewContactEventState }
  | { type: "SET_DRAFT"; payload: boolean }
  | { type: "RESET" };

const initialState: NewContactEventState = {
  recipients: [],
  text: "",
  type: "OTHER",
  entryDate: new Date(),
  draft: false,
  locked: false,
};

const reducer = (
  state: NewContactEventState,
  action: Action
): NewContactEventState => {
  switch (action.type) {
    case "SET_RECIPIENTS":
      return { ...state, recipients: action.payload };
    case "SET_CONTACT_LOG_ENTRY_DATE":
      return { ...state, entryDate: action.payload };
    case "SET_CONTACT_LOG_ENTRY_TYPE":
      return { ...state, type: action.payload };
    case "SET_CONTACT_LOG_ENTRY_TEXT":
      return { ...state, text: action.payload };
    case "SET_LOCKED":
      return { ...state, locked: action.payload };
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "SET_DRAFT":
      return { ...state, draft: action.payload };
    case "RESET":
      return initialState;

    default:
      return state;
  }
};

const NewContactEvent: React.FC<NewContactEventProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { text, type, entryDate, recipients, draft, locked } = state;

  const { isOpen, status, selectedItems, children, onClose } = props;
  const { t } = useTranslation(["common", "messaging"]);

  const [newContactEventState, setNewContactEventState] =
    useLocalStorage<NewContactEventState>("new-contact-event", initialState);

  useEffect(() => {
    // If there's a local storage state, dispatch it to the state
    if (localStorage.getItem("new-contact-event")) {
      const state = { ...newContactEventState };

      state.entryDate = new Date(newContactEventState.entryDate);
      state.draft = true;
      dispatch({ type: "SET_ALL", payload: state });
    }

    if (selectedItems.length > 0) {
      const existing = [...newContactEventState.recipients];

      // If there are recipients in the local storage, check is the selected recipients overlap
      // then combine them
      if (existing.length > 0) {
        const newItems = selectedItems.filter(
          (selectedItem) =>
            !existing.find(
              (existingItem) => existingItem.value.id === selectedItem.value.id
            )
        );

        dispatch({
          type: "SET_RECIPIENTS",
          payload: [...newItems, ...existing],
        });
      } else {
        // ohterwise, just set the selected items
        dispatch({ type: "SET_RECIPIENTS", payload: selectedItems });
      }
    }
  }, [selectedItems]);

  /**
   * handleRecipientsChange
   * @param recipients
   */
  const handleRecipientsChange = (recipients: ContactRecipientType[]) => {
    dispatch({ type: "SET_RECIPIENTS", payload: recipients });
    setNewContactEventState((prevState) => ({
      ...prevState,
      recipients,
    }));
    dispatch({ type: "SET_DRAFT", payload: true });
  };

  /**
   * handleDateChange
   * @param date
   */
  const handleDateChange = (date: Date) => {
    dispatch({ type: "SET_CONTACT_LOG_ENTRY_DATE", payload: date });
    setNewContactEventState((prevState) => ({
      ...prevState,
      entryDate: date,
    }));
    dispatch({ type: "SET_DRAFT", payload: true });
  };

  /**
   * handleTypeChange
   * @param e
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "SET_CONTACT_LOG_ENTRY_TYPE",
      payload: e.target.value as ContactType,
    });
    setNewContactEventState((prevState) => ({
      ...prevState,
      type: e.target.value as ContactType,
    }));
    dispatch({ type: "SET_DRAFT", payload: true });
  };

  /**
   * handleCkEditorChange
   * @param text
   */
  const handleCkEditorChange = (text: string) => {
    dispatch({ type: "SET_CONTACT_LOG_ENTRY_TEXT", payload: text });
    setNewContactEventState((prevState) => ({
      ...prevState,
      text,
    }));

    dispatch({ type: "SET_DRAFT", payload: true });
  };

  /**
   * handleReset
   */
  const handleReset = () => {
    dispatch({ type: "RESET" });
    localStorage.removeItem("new-contact-event");
    dispatch({ type: "SET_DRAFT", payload: false });
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
   * saveContactEvent
   * @param closeDialog closeDialog
   */
  const saveContactEvent = (closeDialog: () => void) => {
    const guiderApi = MApi.getGuiderApi();
    dispatch({ type: "SET_LOCKED", payload: true });

    const recipientStudentsWorkspaceIds = recipients
      .filter((recipient) => recipient.type === "workspace")
      .map((recipient) => recipient.value.id);
    const recipientGroupIds = recipients
      .filter((recipient) => recipient.type === "usergroup")
      .map((recipient) => recipient.value.id);
    const recipientIds = recipients
      .filter((recipient) => recipient.type === "user")
      .map((recipient) => recipient.value.id);

    const payload: CreateMultipleContactLogEventsRequest = {
      recipients: {
        recipientIds,
        recipientGroupIds,
        recipientStudentsWorkspaceIds,
      },
      contactLogEntry: {
        text,
        entryDate: moment(entryDate).format(),
        type,
      },
    };

    console.log(payload);

    guiderApi
      .createMultipleContactLogEvents({
        createMultipleContactLogEventsRequest: payload,
      })
      .then(() => {
        dispatch({ type: "RESET" });
        closeDialog();
      });
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
            count: recipients.length,
          })}
          selectedItems={recipients}
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
      <Button
        buttonModifiers="dialog-execute"
        onClick={() => saveContactEvent(closeDialog)}
        disabled={locked}
      >
        {t("actions.send")}
      </Button>
      <Button
        buttonModifiers="dialog-cancel"
        onClick={closeDialog}
        disabled={locked}
      >
        {t("actions.cancel")}
      </Button>
      {draft && (
        <Button
          buttonModifiers="dialog-clear"
          onClick={handleReset}
          disabled={locked}
        >
          {t("actions.remove", { context: "draft" })}
        </Button>
      )}
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
      //   onClose={this.props.onClose}
      isOpen={isOpen}
    >
      {children}
    </EnvironmentDialog>
  );
};

export default NewContactEvent;
