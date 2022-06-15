import * as React from "react";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  sendMessage,
  SendMessageTriggerType,
} from "~/actions/main-function/messages";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { MessageSignatureType } from "~/reducers/main-function/messages";
import { ContactRecipientType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/form.scss";

/**
 * CommunicatorNewMessageProps
 */
interface CommunicatorNewMessageProps {
  children?: React.ReactElement<any>;
  replyThreadId?: number;
  replyToAll?: boolean;
  messageId?: number;
  extraNamespace?: string;
  initialSelectedItems?: Array<ContactRecipientType>;
  refreshInitialSelectedItemsOnOpen?: boolean;
  i18n: i18nType;
  signature: MessageSignatureType;
  sendMessage: SendMessageTriggerType;
  initialSubject?: string;
  initialMessage?: string;
  status: StatusType;
  onOpen?: () => any;
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
  sendMessage(closeDialog: () => any) {
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
    return {
      /**
       * studentsLoader
       * @param searchString searchString
       */
      studentsLoader: (searchString: string) =>
        promisify(
          mApi().communicator.recipientsUsersSearch.read({
            q: searchString,
            maxResults: 20,
          }),
          "callback"
        ),
      /**
       * workspacesLoader
       * @param searchString searchString
       */
      workspacesLoader: (searchString: string) =>
        promisify(
          mApi().communicator.recipientsWorkspacesSearch.read({
            q: searchString,
            maxResults: 20,
          }),
          "callback"
        ),
    };
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const editorTitle =
      this.props.i18n.text.get("plugin.communicator.createmessage.label") +
      " - " +
      this.props.i18n.text.get(
        "plugin.communicator.createmessage.title.content"
      );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => [
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
        placeholder={this.props.i18n.text.get(
          "plugin.communicator.createmessage.title.recipients"
        )}
        label={this.props.i18n.text.get(
          "plugin.communicator.createmessage.title.recipients"
        )}
        selectedItems={this.state.selectedItems}
        onChange={this.setSelectedItems}
        autofocus={!this.props.initialSelectedItems}
      />,
      <div className="env-dialog__row" key="new-message-2">
        <div className="env-dialog__form-element-container">
          <label htmlFor="messageTitle" className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.communicator.createmessage.title.subject"
            )}
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
            {this.props.i18n.text.get(
              "plugin.communicator.createmessage.title.content"
            )}
          </label>
          <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>
            {this.state.text}
          </CKEditor>
        </div>
      </div>,
      this.props.signature ? (
        <div
          key="new-message-4"
          className="env-dialog__row env-dialog__row--communicator-signature"
        >
          <input
            id="messageSignature"
            className="env-dialog__input"
            type="checkbox"
            checked={this.state.includesSignature}
            onChange={this.onSignatureToggleClick}
          />
          <label htmlFor="messageSignature" className="env-dialog__input-label">
            {this.props.i18n.text.get(
              "plugin.communicator.createmessage.checkbox.signature"
            )}
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
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.sendMessage.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.communicator.createmessage.button.send"
          )}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.communicator.createmessage.button.cancel"
          )}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.communicator.createmessage.button.clearDraft"
            )}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-message"
        title={this.props.i18n.text.get(
          "plugin.communicator.createmessage.label"
        )}
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
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    signature: state.messages && state.messages.signature,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ sendMessage }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorNewMessage);
