import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import CKEditor from "~/components/general/ckeditor";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  sendMessage,
  SendMessageTriggerType,
} from "~/actions/main-function/messages";
import { AnyActionType } from "~/actions";
import { ContactRecipientType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/form.scss";
import MApi from "~/api/api";
import { useTranslation } from "react-i18next";
import { CommunicatorSignature } from "~/generated/client";
import { useLocalStorage } from "usehooks-ts";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

/**
 * CommunicatorNewMessageProps
 */
interface CommunicatorNewMessageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  replyThreadId?: number;
  replyToAll?: boolean;
  messageId?: number;
  extraNamespace?: string;
  initialSelectedItems?: ContactRecipientType[];
  signature: CommunicatorSignature;
  sendMessage: SendMessageTriggerType;
  initialSubject?: string;
  initialMessage?: string;
  status: StatusType;
  onOpen?: () => void;
  onClose?: () => void;
  onRecipientChange?: (selectedItems: ContactRecipientType[]) => void;
  isOpen?: boolean;
}

/**
 * Persisted draft. Recipients from props are not stored;
 * only extras added in the dialog are.
 */
interface NewMessageDraft {
  text: string;
  subject: string;
  extras: ContactRecipientType[];
}

/**
 * In-memory form state
 */
interface NewMessageForm {
  text: string;
  subject: string;
}

/**
 * getDraftStorageKey
 * @param extraNamespace extraNamespace
 * @param replyThreadId replyThreadId
 * @param replyToAll replyToAll
 * @param messageId messageId
 */
const getDraftStorageKey = (
  extraNamespace?: string,
  replyThreadId?: number,
  replyToAll?: boolean,
  messageId?: number
) => {
  let key = "new-message";

  if (extraNamespace) {
    key += `-${extraNamespace}`;
  }

  if (replyThreadId) {
    key += `-${replyThreadId}${replyToAll ? "a" : "b"}-${messageId ?? ""}`;
  }

  return key;
};

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
 * getExtras
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

const EMPTY_RECIPIENTS: ContactRecipientType[] = [];

/**
 * CommunicatorNewMessage
 * @param props props
 */
const CommunicatorNewMessage: React.FC<CommunicatorNewMessageProps> = (
  props
) => {
  const {
    children,
    replyThreadId,
    replyToAll,
    messageId,
    extraNamespace,
    initialSelectedItems = EMPTY_RECIPIENTS,
    signature,
    sendMessage: dispatchSendMessage,
    initialSubject = "",
    initialMessage = "",
    status,
    onOpen,
    onClose,
    onRecipientChange,
    isOpen,
  } = props;

  const { t } = useTranslation(["common", "messaging"]);

  /**
   * createDefaultForm
   */
  const createDefaultForm = (): NewMessageForm => ({
    text: initialMessage,
    subject: initialSubject,
  });

  /**
   * isDefaultForm
   * @param form form
   */
  const isDefaultForm = (form: NewMessageForm) =>
    form.text === initialMessage && form.subject === initialSubject;

  /**
   * toDraft
   * @param form form
   * @param extras extras
   */
  const toDraft = (
    form: NewMessageForm,
    extras: ContactRecipientType[]
  ): NewMessageDraft => ({
    text: form.text,
    subject: form.subject,
    extras,
  });

  /**
   * fromDraft
   * @param draft draft
   */
  const fromDraft = (draft: NewMessageDraft): NewMessageForm => ({
    text: draft.text || initialMessage,
    subject: draft.subject || initialSubject,
  });

  const [locked, setLocked] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recipients, setRecipients] =
    useState<ContactRecipientType[]>(initialSelectedItems);
  const [form, setForm] = useState<NewMessageForm>(createDefaultForm);
  const [hasDraft, setHasDraft] = useState(false);
  const [includesSignature, setIncludesSignature] = useState(true);
  const [recipientsInputKey, setRecipientsInputKey] = useState(0);

  const [storedDraft, setStoredDraft, removeStoredDraft] =
    useLocalStorage<NewMessageDraft | null>(
      getDraftStorageKey(extraNamespace, replyThreadId, replyToAll, messageId),
      null
    );

  const skipCkEditorChangeRef = useRef(false);

  // While the dialog is closed, keep recipients in sync with current props
  // plus any stored extras. Also prune extras that have become selected.
  useEffect(() => {
    if (isDialogOpen) {
      return;
    }
    const extras = storedDraft?.extras || [];
    const nextRecipients = combineRecipients(initialSelectedItems, extras);
    const nextExtras = getExtras(nextRecipients, initialSelectedItems);
    const nextIds = nextRecipients.map((item) => item.value.id).join(",");
    const currentIds = recipients.map((item) => item.value.id).join(",");
    unstable_batchedUpdates(() => {
      if (nextIds !== currentIds) {
        setRecipients(nextRecipients);
      }
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
    });
  }, [
    initialSelectedItems,
    isDialogOpen,
    storedDraft,
    recipients,
    setStoredDraft,
  ]);

  /**
   * persistDraft
   * @param nextForm nextForm
   * @param extras extras
   */
  const persistDraft = (
    nextForm: NewMessageForm,
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
    const nextRecipients = combineRecipients(initialSelectedItems, extras);

    unstable_batchedUpdates(() => {
      setIsDialogOpen(true);
      setRecipients(nextRecipients);
      setForm(nextForm);
      setHasDraft(
        !!storedDraft && (!isDefaultForm(nextForm) || extras.length > 0)
      );
      setLocked(false);
      setIncludesSignature(true);
      onOpen && onOpen();
    });
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

    unstable_batchedUpdates(() => {
      setRecipients(initialSelectedItems);
      persistDraft(createDefaultForm(), []);
      removeStoredDraft();
      setHasDraft(false);
      setRecipientsInputKey((key) => key + 1);
    });
  };

  /**
   * handleRecipientsChange
   * @param nextRecipients nextRecipients
   */
  const handleRecipientsChange = (nextRecipients: ContactRecipientType[]) => {
    setRecipients(nextRecipients);
    persistDraft(form, getExtras(nextRecipients, initialSelectedItems));
    onRecipientChange && onRecipientChange(nextRecipients);
  };

  /**
   * handleSubjectChange
   * @param e e
   */
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    persistDraft(
      {
        ...form,
        subject: e.target.value,
      },
      getExtras(recipients, initialSelectedItems)
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
      getExtras(recipients, initialSelectedItems)
    );
  };

  /**
   * handleSignatureToggleClick
   */
  const handleSignatureToggleClick = () => {
    setIncludesSignature(!includesSignature);
  };

  /**
   * inputContactsAutofillLoaders
   */
  const inputContactsAutofillLoaders = () => {
    const communicatorApi = MApi.getCommunicatorApi();

    return {
      /**
       * studentsLoader
       * @param searchString searchString
       */
      studentsLoader: (searchString: string) => () =>
        communicatorApi.getCommunicatorRecipientsUserSearch({
          q: searchString,
          maxResults: 20,
        }),
      /**
       * workspacesLoader
       * @param searchString searchString
       */
      workspacesLoader: (searchString: string) => () =>
        communicatorApi.getCommunicatorRecipientsWorkspacesSearch({
          q: searchString,
          maxResults: 20,
        }),
    };
  };

  /**
   * handleSendMessage
   * @param closeDialog closeDialog
   */
  const handleSendMessage = (closeDialog: () => void) => {
    setLocked(true);

    dispatchSendMessage({
      to: recipients,
      subject: form.subject,
      text:
        signature && includesSignature
          ? form.text +
            '<i class="mf-signature">' +
            signature.signature +
            "</i>"
          : form.text,
      /**
       * success
       */
      success: () => {
        closeDialog();
        handleReset();
      },
      /**
       * fail
       */
      fail: () => {
        setLocked(false);
      },
      replyThreadId: replyThreadId,
    });
  };

  const editorTitle =
    t("labels.create", { ns: "messaging", context: "message" }) +
    " - " +
    t("labels.content");

  /**
   * content
   */
  const content = () => [
    <InputContactsAutofill
      identifier="communicatorRecipients"
      modifier="new-message"
      // Because component is re-rendered when key changes.
      // InputContactsAutofill only reads selectedItems on mount, so this
      // ensures that the component is re-rendered when the selectedItems
      // change.
      key={`new-message-recipients-${recipientsInputKey}`}
      showFullNames={!status.isStudent}
      loaders={inputContactsAutofillLoaders()}
      hasGroupPermission={status.permissions.COMMUNICATOR_GROUP_MESSAGING}
      hasWorkspacePermission={status.permissions.COMMUNICATOR_GROUP_MESSAGING}
      placeholder={t("labels.search", { context: "recipients" })}
      label={t("labels.recipients", {
        ns: "messaging",
        count: recipients.length,
      })}
      selectedItems={recipients}
      onChange={handleRecipientsChange}
      autofocus={!initialSelectedItems.length}
    />,
    <div className="env-dialog__row" key="new-message-2">
      <div className="env-dialog__form-element-container">
        <label htmlFor="messageTitle" className="env-dialog__label">
          {t("labels.title", {
            ns: "messaging",
            context: "message",
          })}
        </label>
        <input
          id="messageTitle"
          type="text"
          className="env-dialog__input env-dialog__input--new-message-title"
          value={form.subject}
          onChange={handleSubjectChange}
          autoFocus={!!initialSelectedItems.length}
        />
      </div>
    </div>,
    <div
      className="env-dialog__row env-dialog__row--ckeditor"
      key="new-message-3"
    >
      <div className="env-dialog__form-element-container">
        <label className="env-dialog__label">{t("labels.content")}</label>
        <CKEditor editorTitle={editorTitle} onChange={handleCkEditorChange}>
          {form.text}
        </CKEditor>
      </div>
    </div>,
    signature ? (
      <div
        key="new-message-4"
        className="env-dialog__row env-dialog__row--options"
      >
        <input
          id="messageSignature"
          className="env-dialog__input"
          type="checkbox"
          checked={includesSignature}
          onChange={handleSignatureToggleClick}
        />
        <label htmlFor="messageSignature" className="env-dialog__input-label">
          {t("labels.addSignature", { ns: "messaging" })}
        </label>
        <span className="env-dialog__input-description">
          <i
            className="mf-signature"
            dangerouslySetInnerHTML={{
              __html: signature.signature,
            }}
          />
        </span>
      </div>
    ) : null,
  ];

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="env-dialog__actions">
      <Button
        buttonModifiers="dialog-execute"
        onClick={() => handleSendMessage(closeDialog)}
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
      modifier="new-message"
      title={t("labels.create", {
        ns: "messaging",
        context: "message",
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
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    signature: state.messages && state.messages.signature,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ sendMessage }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorNewMessage);
