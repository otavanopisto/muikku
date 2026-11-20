import React, { useEffect, useRef, useState } from "react";
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
import { Action, bindActionCreators, Dispatch } from "redux";

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
 * Persisted draft. Recipients from props are not stored;
 * only extras added in the dialog are.
 */
interface ContactEventDraft {
  text: string;
  type: ContactType;
  entryDate: string;
  extras: ContactRecipientType[];
}

/**
 * In-memory form state
 */
interface ContactEventForm {
  text: string;
  type: ContactType;
  entryDate: Date;
}

/**
 * createDefaultForm
 */
const createDefaultForm = (): ContactEventForm => ({
  text: "",
  type: "OTHER",
  entryDate: new Date(),
});

/**
 * isSameCalendarDay
 * @param a a
 * @param b b
 */
const isSameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/**
 * isDefaultForm
 * @param form form
 */
const isDefaultForm = (form: ContactEventForm) =>
  form.text === "" &&
  form.type === "OTHER" &&
  isSameCalendarDay(form.entryDate, new Date());

/**
 * uniqueById
 * @param items items
 */
const uniqueById = (items: ContactRecipientType[]) => {
  const seen = new Set<number>();

  return items.filter((item) => {
    if (seen.has(item.value.id)) {
      return false;
    }

    seen.add(item.value.id);
    return true;
  });
};

/**
 * Recipients that are not part of the current props selection.
 * @param items items
 * @param selectedItems selectedItems
 */
const getExtras = (
  items: ContactRecipientType[],
  selectedItems: ContactRecipientType[]
) => {
  const selectedIds = new Set(selectedItems.map((item) => item.value.id));

  return items.filter((item) => !selectedIds.has(item.value.id));
};

/**
 * combineRecipients
 * @param selectedItems selectedItems
 * @param extras extras
 */
const combineRecipients = (
  selectedItems: ContactRecipientType[],
  extras: ContactRecipientType[]
) => uniqueById([...selectedItems, ...getExtras(extras, selectedItems)]);

/**
 * toDraft
 * @param form form
 * @param extras extras
 */
const toDraft = (
  form: ContactEventForm,
  extras: ContactRecipientType[]
): ContactEventDraft => ({
  text: form.text,
  type: form.type,
  entryDate: form.entryDate.toISOString(),
  extras,
});

/**
 * fromDraft
 * @param draft draft
 */
const fromDraft = (draft: ContactEventDraft): ContactEventForm => ({
  text: draft.text || "",
  type: draft.type || "OTHER",
  entryDate: draft.entryDate ? new Date(draft.entryDate) : new Date(),
});

/**
 * NewContactEvent
 * @param props component props
 * @returns a React component
 */
const NewContactEvent: React.FC<NewContactEventProps> = (props) => {
  const {
    isOpen,
    status,
    selectedItems,
    children,
    displayNotification,
    onClose,
  } = props;

  const { t } = useTranslation(["common", "messaging"]);

  const [locked, setLocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipients, setRecipients] =
    useState<ContactRecipientType[]>(selectedItems);
  const [form, setForm] = useState<ContactEventForm>(createDefaultForm);
  const [hasDraft, setHasDraft] = useState(false);

  const [storedDraft, setStoredDraft, removeStoredDraft] =
    useLocalStorage<ContactEventDraft | null>("new-contact-event", null);

  const [recipientsInputKey, setRecipientsInputKey] = useState(0);

  const skipCkEditorChangeRef = useRef(false);

  // While the dialog is closed, keep recipients in sync with current props
  // plus any stored extras. Also prune extras that have become selected in
  // the toolbar, so localStorage matches the new selection.
  useEffect(() => {
    if (isDialogOpen) {
      return;
    }

    const extras = storedDraft?.extras || [];
    const nextRecipients = combineRecipients(selectedItems, extras);
    const nextExtras = getExtras(nextRecipients, selectedItems);

    setRecipients(nextRecipients);

    if (!storedDraft) {
      return;
    }

    const extrasChanged =
      nextExtras.length !== extras.length ||
      nextExtras.some(
        (extra, index) => extra.value.id !== extras[index]?.value.id
      );

    if (extrasChanged) {
      setStoredDraft({
        ...storedDraft,
        extras: nextExtras,
      });
    }
  }, [selectedItems, isDialogOpen, storedDraft, setStoredDraft]);

  /**
   * persistDraft
   * @param nextForm nextForm
   * @param extras extras
   */
  const persistDraft = (
    nextForm: ContactEventForm,
    extras: ContactRecipientType[]
  ) => {
    setForm(nextForm);

    if (isDefaultForm(nextForm) && extras.length === 0) {
      removeStoredDraft();
    } else {
      setStoredDraft(toDraft(nextForm, extras));
    }
  };

  /**
   * handleOpen
   */
  const handleOpen = () => {
    const extras = storedDraft?.extras || [];
    const nextForm = storedDraft ? fromDraft(storedDraft) : createDefaultForm();
    const nextRecipients = combineRecipients(selectedItems, extras);

    setIsDialogOpen(true);
    setRecipients(nextRecipients);
    setForm(nextForm);
    setHasDraft(
      !!storedDraft && (!isDefaultForm(nextForm) || extras.length > 0)
    );
    setLocked(false);
  };

  /**
   * handleClose
   */
  const handleClose = () => {
    setIsDialogOpen(false);
    onClose && onClose();
  };

  /**
   * handleReset
   */
  const handleReset = () => {
    skipCkEditorChangeRef.current = true;
    setTimeout(() => {
      skipCkEditorChangeRef.current = false;
    }, 100);

    setRecipients(selectedItems);
    persistDraft(createDefaultForm(), []);
    removeStoredDraft();
    setHasDraft(false);
    setRecipientsInputKey((key) => key + 1);
  };

  /**
   * handleRecipientsChange
   * @param nextRecipients nextRecipients
   */
  const handleRecipientsChange = (nextRecipients: ContactRecipientType[]) => {
    setRecipients(nextRecipients);
    persistDraft(form, getExtras(nextRecipients, selectedItems));
  };

  /**
   * handleDateChange
   * @param date date
   */
  const handleDateChange = (date: Date) => {
    persistDraft(
      {
        ...form,
        entryDate: date,
      },
      getExtras(recipients, selectedItems)
    );
  };

  /**
   * handleTypeChange
   * @param e event
   */
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    persistDraft(
      {
        ...form,
        type: e.target.value as ContactType,
      },
      getExtras(recipients, selectedItems)
    );
  };

  /**
   * handleCkEditorChange
   * @param text text
   */
  const handleCkEditorChange = (text: string) => {
    if (skipCkEditorChangeRef.current) {
      skipCkEditorChangeRef.current = false;
      return;
    }

    persistDraft(
      {
        ...form,
        text,
      },
      getExtras(recipients, selectedItems)
    );
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
        text: form.text,
        entryDate: moment(form.entryDate).format(),
        type: form.type,
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
        setLocked(false);
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
          // Because component is re-rendered when key changes.
          // InputContactsAutofill only reads selectedItems on mount, so this
          // ensures that the component is re-rendered when the selectedItems
          // change.
          key={`contact-event-recipients-${recipientsInputKey}`}
          identifier="communicatorRecipients"
          modifier="new-message"
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
            selected={form.entryDate}
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
            value={form.type}
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
            {form.text}
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
      {hasDraft && (
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
      onOpen={handleOpen}
      onClose={handleClose}
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}
export default connect(null, mapDispatchToProps)(NewContactEvent);
