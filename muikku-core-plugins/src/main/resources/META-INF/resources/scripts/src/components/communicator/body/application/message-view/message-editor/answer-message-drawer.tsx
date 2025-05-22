import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions/index";
import {
  SendMessageTriggerType,
  sendMessage,
} from "~/actions/main-function/messages/index";
import { ContactRecipientType } from "~/reducers/user-index";
import { StatusType } from "~/reducers/base/status";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import CKEditor from "~/components/general/ckeditor";
import Button from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import "~/sass/elements/form.scss";
import "~/sass/elements/environment-dialog.scss";
import MApi from "~/api/api";
import { WithTranslation, withTranslation } from "react-i18next";
import { CommunicatorSignature } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * AnswerMessageDrawerProps
 */
interface AnswerMessageDrawerProps extends WithTranslation {
  replyThreadId?: number;
  replyToAll?: boolean;
  messageId?: number;
  extraNamespace?: string;
  initialSelectedItems?: Array<ContactRecipientType>;
  signature: CommunicatorSignature;
  sendMessage: SendMessageTriggerType;
  initialSubject?: string;
  initialMessage?: string;
  status: StatusType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpen?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  onClickCancel?: () => void;
  isOpen?: boolean;
}

/**
 * AnswerMessageDrawerState
 */
interface AnswerMessageDrawerState {
  text: string;
  selectedItems: Array<ContactRecipientType>;
  subject: string;
  locked: boolean;
  includesSignature: boolean;
}

/**
 * AnswerMessageDrawer
 */
class AnswerMessageDrawer extends SessionStateComponent<
  AnswerMessageDrawerProps,
  AnswerMessageDrawerState
> {
  private avoidCKEditorTriggeringChangeForNoReasonAtAll: boolean;

  /**
   * constructor
   * @param props props
   */
  constructor(props: AnswerMessageDrawerProps) {
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
   */
  sendMessage() {
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
       *
       */
      success: () => {
        this.props.onClickCancel && this.props.onClickCancel();
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
       *
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
   * handleCancelClick
   */
  handleCancelClick = () => {
    this.props.onClickCancel && this.props.onClickCancel();
  };

  /**
   * render
   */
  render() {
    const editorTitle =
      this.props.t("labels.reply", { ns: "messaging" }) +
      " - " +
      this.props.t("labels.content");

    const content = (
      <>
        <InputContactsAutofill
          identifier="communicatorRecipients"
          modifier="new-message"
          key="new-message-1"
          loaders={this.inputContactsAutofillLoaders()}
          hasGroupPermission={
            this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
          }
          hasWorkspacePermission={
            this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
          }
          placeholder={this.props.t("labels.recipients", {
            ns: "messaging",
            count: this.state.selectedItems.length,
          })}
          label={this.props.t("labels.recipients", {
            ns: "messaging",
            count: this.state.selectedItems.length,
          })}
          selectedItems={this.state.selectedItems}
          onChange={this.setSelectedItems}
          autofocus={!this.props.initialSelectedItems}
          showFullNames={!this.props.status.isStudent}
        />
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
        </div>
        <div
          className="env-dialog__row env-dialog__row--ckeditor"
          key="new-message-3"
        >
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">
              {this.props.t("labels.content")}
            </label>
            <CKEditor
              editorTitle={editorTitle}
              onChange={this.onCKEditorChange}
            >
              {this.state.text}
            </CKEditor>
          </div>
        </div>
        {this.props.signature ? (
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
            <label
              htmlFor="messageSignature"
              className="env-dialog__input-label"
            >
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
        ) : null}
      </>
    );

    const footer = (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.sendMessage.bind(this)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          disabled={this.state.locked}
          onClick={this.handleCancelClick}
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
      <div className="env-dialog env-dialog--mainfunction env-dialog--reply-message">
        <section className="env-dialog__wrapper">
          <div className="env-dialog__content">
            <header className="env-dialog__header">
              {this.props.t("labels.reply", { ns: "messaging" })}
            </header>
            <section className="env-dialog__body">{content}</section>
            <footer className="env-dialog__footer">{footer}</footer>
          </div>
        </section>
      </div>
    );
  }
}

/**
 * getStateIdentifier
 * @param props props
 * @returns state identifier string
 */
function getStateIdentifier(props: AnswerMessageDrawerProps) {
  if (!props.replyThreadId) {
    return;
  }

  return props.replyThreadId + (props.replyToAll ? "a" : "b") + props.messageId;
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
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
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ sendMessage }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(AnswerMessageDrawer)
);
