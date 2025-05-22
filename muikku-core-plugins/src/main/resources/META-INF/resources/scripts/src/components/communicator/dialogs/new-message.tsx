import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  sendMessage,
  SendMessageTriggerType,
} from "~/actions/main-function/messages";
import { ContactRecipientType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/form.scss";
import MApi from "~/api/api";
import { WithTranslation, withTranslation } from "react-i18next";
import { CommunicatorSignature } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CommunicatorNewMessageProps
 */
interface CommunicatorNewMessageProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  replyThreadId?: number;
  replyToAll?: boolean;
  messageId?: number;
  extraNamespace?: string;
  initialSelectedItems?: Array<ContactRecipientType>;
  refreshInitialSelectedItemsOnOpen?: boolean;
  signature: CommunicatorSignature;
  sendMessage: SendMessageTriggerType;
  initialSubject?: string;
  initialMessage?: string;
  status: StatusType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  onRecipientChange?: (selectedItems: ContactRecipientType[]) => void;
  isOpen?: boolean;
}

/**
 * CommunicatorNewMessageState
 */
interface CommunicatorNewMessageState {
  text: string;
  selectedItems: Array<ContactRecipientType>;
  subject: string;
  locked: boolean;
  includesSignature: boolean;
  receivedSelectedItems?: boolean;
}

/**
 * getStateIdentifier
 * @param props props
 * @returns string
 */
function getStateIdentifier(props: CommunicatorNewMessageProps) {
  if (!props.replyThreadId) {
    return;
  }

  return props.replyThreadId + (props.replyToAll ? "a" : "b") + props.messageId;
}

/**
 * CommunicatorNewMessage
 */
class CommunicatorNewMessage extends SessionStateComponent<
  CommunicatorNewMessageProps,
  CommunicatorNewMessageState
> {
  private avoidCKEditorTriggeringChangeForNoReasonAtAll: boolean;
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommunicatorNewMessageProps) {
    super(
      props,
      "communicator-new-message" +
        (props.extraNamespace ? "-" + props.extraNamespace : "")
    );

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSignatureToggleClick = this.onSignatureToggleClick.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState(
      {
        text: props.initialMessage || "",
        selectedItems: props.initialSelectedItems || [],
        subject: props.initialSubject || "",
        locked: false,
        includesSignature: true,
      },
      getStateIdentifier(props)
    );
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState(
      {
        text: this.props.initialMessage || "",
        selectedItems: this.props.initialSelectedItems || [],
        subject: this.props.initialSubject || "",
        locked: false,
        includesSignature: true,
      },
      getStateIdentifier(this.props)
    );

    if (this.props.refreshInitialSelectedItemsOnOpen) {
      // Get selectedItems from the stored state
      const storedSelectedItemsState = this.getRecoverStoredState(
        { selectedItems: [] },
        getStateIdentifier(this.props)
      );

      // Combine stored items with the newly selected
      const combinedSelectedItems = [
        ...storedSelectedItemsState.selectedItems,
        ...this.props.initialSelectedItems,
      ];

      // Remove duplicates through Set
      const combinedSelectedUniqueIds = new Set(
        combinedSelectedItems.map((item) => item.value.id)
      );

      // Convert the Set to an Array
      const newCombinedSelectedIds = Array.from(combinedSelectedUniqueIds);

      const newSelectedItems = [];

      // Iterate through the ids and find a counterpart from the combined selected items

      for (let i = 0; i < newCombinedSelectedIds.length; i++) {
        newSelectedItems.push(
          combinedSelectedItems.find(
            (item) => item.value.id === newCombinedSelectedIds[i]
          )
        );
      }

      // Boom! New selected items to state
      this.setState({ selectedItems: newSelectedItems });
    }

    this.props.onOpen && this.props.onOpen();
  }

  /**
   * onCKEditorChange
   * @param text text
   */
  onCKEditorChange(text: string) {
    if (this.avoidCKEditorTriggeringChangeForNoReasonAtAll) {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
      return;
    }
    this.setStateAndStore({ text }, getStateIdentifier(this.props));
  }

  /**
   * setSelectedItems
   * @param selectedItems selectedItems
   */
  setSelectedItems(selectedItems: Array<ContactRecipientType>) {
    this.setStateAndStore({ selectedItems }, getStateIdentifier(this.props));
    this.props.onRecipientChange && this.props.onRecipientChange(selectedItems);
  }

  /**
   * onSubjectChange
   * @param e e
   */
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore(
      { subject: e.target.value },
      getStateIdentifier(this.props)
    );
  }

  /**
   * sendMessage
   * @param closeDialog closeDialog
   */
  sendMessage(closeDialog: () => void) {
    this.setState({
      locked: true,
    });
    this.props.sendMessage({
      to: this.state.selectedItems,
      subject: this.state.subject,
      text:
        this.props.signature && this.state.includesSignature
          ? this.state.text +
            '<i class="mf-signature">' +
            this.props.signature.signature +
            "</i>"
          : this.state.text,
      /**
       * success
       */
      success: () => {
        closeDialog();
        this.avoidCKEditorTriggeringChangeForNoReasonAtAll = true;
        setTimeout(() => {
          this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
        }, 100);
        this.setStateAndClear(
          {
            text: this.props.initialMessage || "",
            selectedItems: this.props.initialSelectedItems || [],
            subject: this.props.initialSubject || "",
            locked: false,
          },
          getStateIdentifier(this.props)
        );
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
      },
      replyThreadId: this.props.replyThreadId,
    });
  }

  /**
   * onSignatureToggleClick
   */
  onSignatureToggleClick() {
    this.setState({ includesSignature: !this.state.includesSignature });
  }

  /**
   * clearUp
   */
  clearUp() {
    this.avoidCKEditorTriggeringChangeForNoReasonAtAll = true;
    setTimeout(() => {
      this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
    }, 100);
    this.setStateAndClear(
      {
        text: this.props.initialMessage || "",
        selectedItems: this.props.initialSelectedItems || [],
        subject: this.props.initialSubject || "",
        locked: false,
        receivedSelectedItems: false,
      },
      getStateIdentifier(this.props)
    );
  }

  /**
   * inputContactsAutofillLoaders
   */
  inputContactsAutofillLoaders() {
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
  }

  /**
   * render
   * @returns React.JSX.Element
   */
  render() {
    const editorTitle =
      this.props.t("labels.create", { ns: "messaging", context: "message" }) +
      " - " +
      this.props.t("labels.content");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <InputContactsAutofill
        identifier="communicatorRecipients"
        modifier="new-message"
        key="new-message-1"
        showFullNames={!this.props.status.isStudent}
        loaders={this.inputContactsAutofillLoaders()}
        hasGroupPermission={
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
        }
        hasWorkspacePermission={
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
        }
        placeholder={this.props.t("labels.search", { context: "recipients" })}
        label={this.props.t("labels.recipients", {
          ns: "messaging",
          count: this.state.selectedItems.length,
        })}
        selectedItems={this.state.selectedItems}
        onChange={this.setSelectedItems}
        autofocus={!this.props.initialSelectedItems}
      />,
      <div className="env-dialog__row" key="new-message-2">
        <div className="env-dialog__form-element-container">
          <label htmlFor="messageTitle" className="env-dialog__label">
            {this.props.t("labels.title", {
              ns: "messaging",
              context: "message",
            })}
          </label>
          <input
            id="messageTitle"
            type="text"
            className="env-dialog__input env-dialog__input--new-message-title"
            value={this.state.subject}
            onChange={this.onSubjectChange}
            autoFocus={!!this.props.initialSelectedItems}
          />
        </div>
      </div>,
      <div
        className="env-dialog__row env-dialog__row--ckeditor"
        key="new-message-3"
      >
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.t("labels.content")}
          </label>
          <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>
            {this.state.text}
          </CKEditor>
        </div>
      </div>,
      this.props.signature ? (
        <div
          key="new-message-4"
          className="env-dialog__row env-dialog__row--options"
        >
          <input
            id="messageSignature"
            className="env-dialog__input"
            type="checkbox"
            checked={this.state.includesSignature}
            onChange={this.onSignatureToggleClick}
          />
          <label htmlFor="messageSignature" className="env-dialog__input-label">
            {this.props.t("labels.addSignature", { ns: "messaging" })}
          </label>
          <span className="env-dialog__input-description">
            <i
              className="mf-signature"
              dangerouslySetInnerHTML={{
                __html: this.props.signature.signature,
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
          onClick={this.sendMessage.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-message"
        title={this.props.t("labels.create", {
          ns: "messaging",
          context: "message",
        })}
        content={content}
        footer={footer}
        onOpen={this.checkAgainstStoredState}
        onClose={this.props.onClose}
        isOpen={this.props.isOpen}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ sendMessage }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(CommunicatorNewMessage)
);
