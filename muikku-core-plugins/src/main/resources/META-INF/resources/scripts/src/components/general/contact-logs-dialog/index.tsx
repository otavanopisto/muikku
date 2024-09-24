import React, { useEffect, useState, useRef } from "react";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import DatePicker from "react-datepicker";
import Button from "~/components/general/button";

import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { ContactType } from "~/generated/client";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import MApi, { isMApiError } from "~/api/api";
import { StatusType } from "~/reducers/base/status";
import { ContactRecipientType } from "~/reducers/user-index";
import moment from "moment";
import { CreateMultipleContactLogEventsRequest } from "~/generated/client/models/CreateMultipleContactLogEventsRequest";
import { useLocalStorage } from "usehooks-ts";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

import { AnyActionType } from "~/actions";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";

/**
 * NewContactEventProps
 */
interface NewContactEventProps {
  status: StatusType;
  userIdentifier: string;
  selectedItems: ContactRecipientType[];
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactElement;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * NewContactEventState
 */
interface NewContactEventState {
  recipients: ContactRecipientType[];
  text: string;
  type: ContactType;
  entryDate: Date;
  draft: boolean;
  locked: boolean;
}

const initialState: NewContactEventState = {
  recipients: [],
  text: "",
  type: "OTHER",
  entryDate: new Date(),
  draft: false,
  locked: false,
};

/**
 * NewContactEvent
 * @param props component props
 * @returns a React component
 */
const NewContactEvent: React.FC<NewContactEventProps> = (props) => {
  const [draft, setDraft] = useState(false);
  const [locked, setLocked] = useState(false);

  // const { draft, locked } = state;
  const { isOpen, status, selectedItems, children, displayNotification } =
    props;

  const { t } = useTranslation(["common", "messaging"]);

  const [
    newContactEventState,
    setNewContactEventState,
    removeContactEventState,
  ] = useLocalStorage<NewContactEventState>("new-contact-event", initialState);

  const { text, type, entryDate, recipients } = newContactEventState;

  const prevSelectedItemsCountRef = useRef(selectedItems.length);

  useEffect(() => {
    // If there's a local storage state this is a draft
    if (localStorage.getItem("new-contact-event")) {
      setDraft(true);
    }
    // Check if the selectedItems have changed
    if (selectedItems.length !== prevSelectedItemsCountRef.current) {
      prevSelectedItemsCountRef.current = selectedItems.length;
      const existing = [...recipients];

      // If there are recipients in the local storage, check is the selected recipients overlap
      // then combine them
      if (existing.length > 0) {
        const newItems = selectedItems.filter(
          (selectedItem) =>
            !existing.find(
              (existingItem) => existingItem.value.id === selectedItem.value.id
            )
        );
        setNewContactEventState((prevState) => ({
          ...prevState,
          recipients: [...newItems, ...existing],
        }));
      } else {
        setNewContactEventState((prevState) => ({
          ...prevState,
          recipients: selectedItems,
        }));
      }
    }
  }, [selectedItems, recipients, setNewContactEventState]);

  /**
   * handleRecipientsChange
   * @param recipients recipients
   */
  const handleRecipientsChange = (recipients: ContactRecipientType[]) => {
    setNewContactEventState((prevState) => ({
      ...prevState,
      recipients,
    }));
    setDraft(true);
  };

  /**
   * handleDateChange
   * @param date date
   */
  const handleDateChange = (date: Date) => {
    setNewContactEventState((prevState) => ({
      ...prevState,
      entryDate: date,
    }));
    setDraft(true);
  };

  /**
   * handleTypeChange
   * @param e event
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewContactEventState((prevState) => ({
      ...prevState,
      type: e.target.value as ContactType,
    }));
    setDraft(true);
  };

  /**
   * handleCkEditorChange
   * @param text text
   */
  const handleCkEditorChange = (text: string) => {
    setNewContactEventState((prevState) => ({
      ...prevState,
      text,
    }));

    setDraft(true);
  };

  /**
   * handleReset
   */
  const handleReset = () => {
    setNewContactEventState(initialState);
    removeContactEventState();
    setDraft(false);
  };

  const contactTypesArray = Object.values(ContactType);

  /**
   * inputContactsAutofillLoaders
   */
  const inputContactsAutofillLoaders = () => {
    const guiderApi = MApi.getGuiderApi();

    return {
      /**
       * studentsLoader
       * @param searchString search term
       * @returns a function that returns a promise
       */
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
    setLocked(true);

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

    guiderApi
      .createMultipleContactLogEvents({
        createMultipleContactLogEventsRequest: payload,
      })
      .then(() => {
        closeDialog();
        handleReset();
        displayNotification(
          t("notifications.createSuccess", {
            ns: "messaging",
            context: "contactLog",
          }),
          "success"
        );
      })
      .catch((error: unknown) => {
        if (!isMApiError(error)) {
          throw error;
        }
        displayNotification(
          t("notifications.createError", {
            ns: "messaging",
            context: "contactLog",
          }),
          "error"
        );
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
        <div className="env-dialog__form-element-container">
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
            selected={new Date(entryDate)}
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
      ,
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

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}
export default connect(null, mapDispatchToProps)(NewContactEvent);
