import * as React from 'react';
import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import CKEditor from '~/components/general/ckeditor';
import InputContactsAutofill from '~/components/base/input-contacts-autofill';
import EnvironmentDialog from '~/components/general/environment-dialog';
import { sendMessage, SendMessageTriggerType } from '~/actions/main-function/messages';
import { AnyActionType } from '~/actions';
import { i18nType } from '~/reducers/base/i18n';
import { MessageSignatureType } from '~/reducers/main-function/messages';
import { ContactRecepientType } from '~/reducers/user-index';
import { StateType } from '~/reducers';
import Button from '~/components/general/button';
import SessionStateComponent from '~/components/general/session-state-component';
import { StatusType } from '~/reducers/base/status';

import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';

interface CommunicatorNewMessageProps {
  children?: React.ReactElement<any>,
  replyThreadId?: number,
  replyToAll?: boolean,
  messageId?: number,
  extraNamespace?: string,
  initialSelectedItems?: Array<ContactRecepientType>,
  i18n: i18nType,
  signature: MessageSignatureType,
  sendMessage: SendMessageTriggerType,
  initialSubject?: string,
  initialMessage?: string,
  status: StatusType,
  onOpen?: () => any,
  onClose?: () => any,
  isOpen?: boolean
}

interface CommunicatorNewMessageState {
  text: string,
  selectedItems: Array<ContactRecepientType>,
  subject: string,
  locked: boolean,
  includesSignature: boolean
}

/**
 * getStateIdentifier
 * @param props
 * @returns
 */
function getStateIdentifier(props: CommunicatorNewMessageProps) {
  if (!props.replyThreadId) {
    return;
  }

  return props.replyThreadId + (props.replyToAll ? "a" : "b") + props.messageId;
}

class CommunicatorNewMessage extends SessionStateComponent<CommunicatorNewMessageProps, CommunicatorNewMessageState> {
  private avoidCKEditorTriggeringChangeForNoReasonAtAll: boolean;
  constructor(props: CommunicatorNewMessageProps) {
    super(props, "communicator-new-message" + (props.extraNamespace ? "-" + props.extraNamespace : ""));

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.setSelectedItems = this.setSelectedItems.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onSignatureToggleClick = this.onSignatureToggleClick.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState({
      text: props.initialMessage || "",
      selectedItems: props.initialSelectedItems || [],
      subject: props.initialSubject || "",
      locked: false,
      includesSignature: true
    }, getStateIdentifier(props));
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState({
      text: this.props.initialMessage || "",
      selectedItems: this.props.initialSelectedItems || [],
      subject: this.props.initialSubject || "",
      locked: false,
      includesSignature: true
    }, getStateIdentifier(this.props));

    this.props.onOpen && this.props.onOpen();
  }

  /**
   * onCKEditorChange
   * @param text
   * @returns
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
   * @param selectedItems
   */
  setSelectedItems(selectedItems: Array<ContactRecepientType>) {
    this.setStateAndStore({ selectedItems }, getStateIdentifier(this.props));
  }

  /**
   * onSubjectChange
   * @param e
   */
  onSubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ subject: e.target.value }, getStateIdentifier(this.props));
  }

  /**
   * sendMessage
   * @param closeDialog
   */
  sendMessage(closeDialog: () => any) {
    this.setState({
      locked: true
    });
    this.props.sendMessage({
      to: this.state.selectedItems,
      subject: this.state.subject,
      text: ((this.props.signature && this.state.includesSignature) ?
        (this.state.text + '<i class="mf-signature">' + this.props.signature.signature + '</i>') :
        this.state.text),
      success: () => {
        closeDialog();
        this.avoidCKEditorTriggeringChangeForNoReasonAtAll = true;
        setTimeout(() => {
          this.avoidCKEditorTriggeringChangeForNoReasonAtAll = false;
        }, 100);
        this.setStateAndClear({
          text: this.props.initialMessage || "",
          selectedItems: this.props.initialSelectedItems || [],
          subject: this.props.initialSubject || "",
          locked: false
        }, getStateIdentifier(this.props));
      },
      fail: () => {
        this.setState({
          locked: false
        });
      },
      replyThreadId: this.props.replyThreadId
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
    this.setStateAndClear({
      text: this.props.initialMessage || "",
      selectedItems: this.props.initialSelectedItems || [],
      subject: this.props.initialSubject || "",
      locked: false
    }, getStateIdentifier(this.props));
  }

  /**
   * inputContactsAutofillLoaders
   * @returns
   */
  inputContactsAutofillLoaders() {
    return {
      studentsLoader: (searchString: string) => promisify(mApi().communicator.recipientsUsersSearch.read({
        q: searchString
      }), 'callback'),
      workspacesLoader: (searchString: string) => promisify(mApi().communicator.recipientsWorkspacesSearch.read({
        q: searchString
      }), 'callback')
    }
  }

  /**
   * render
   * @returns
   */
  render() {
    let editorTitle = this.props.i18n.text.get('plugin.communicator.createmessage.label') + " - " + this.props.i18n.text.get('plugin.communicator.createmessage.title.content');

    let content = (closeDialog: () => any) => [
      (<InputContactsAutofill identifier="communicatorRecipients" modifier="new-message" key="new-message-1"
        loaders={this.inputContactsAutofillLoaders()}
        hasGroupPermission={this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING}
        hasWorkspacePermission={this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING}
        placeholder={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        label={this.props.i18n.text.get('plugin.communicator.createmessage.title.recipients')}
        selectedItems={this.state.selectedItems} onChange={this.setSelectedItems}
        autofocus={!this.props.initialSelectedItems}
        showFullNames={!this.props.status.isStudent} />),
      (
        <div className="env-dialog__row" key="new-message-2">
          <div className="env-dialog__form-element-container">
            <label htmlFor="messageTitle" className="env-dialog__label">{this.props.i18n.text.get('plugin.communicator.createmessage.title.subject')}</label>
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
      ),
      (
        <div className="env-dialog__row env-dialog__row--ckeditor" key="new-message-3">
          <div className="env-dialog__form-element-container">
            <label className="env-dialog__label">{this.props.i18n.text.get('plugin.communicator.createmessage.title.content')}</label>
            <CKEditor editorTitle={editorTitle} onChange={this.onCKEditorChange}>{this.state.text}</CKEditor>
          </div>
        </div>
      ),
      (this.props.signature ? <div key="new-message-4" className="env-dialog__row env-dialog__row--communicator-signature">
        <input id="messageSignature" className="env-dialog__input" type="checkbox" checked={this.state.includesSignature} onChange={this.onSignatureToggleClick} />
        <label htmlFor="messageSignature" className="env-dialog__input-label">{this.props.i18n.text.get('plugin.communicator.createmessage.checkbox.signature')}</label>
        <span className="env-dialog__input-description">
          <i className="mf-signature" dangerouslySetInnerHTML={{ __html: this.props.signature.signature }} />
        </span>
      </div> : null)
    ]
    let footer = (closeDialog: () => any) => {
      return (
        <div className="env-dialog__actions">
          <Button buttonModifiers="dialog-execute" onClick={this.sendMessage.bind(this, closeDialog)}>
            {this.props.i18n.text.get('plugin.communicator.createmessage.button.send')}
          </Button>
          <Button buttonModifiers="dialog-cancel" onClick={closeDialog} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.communicator.createmessage.button.cancel')}
          </Button>
          {this.recovered ? <Button buttonModifiers="dialog-clear" onClick={this.clearUp} disabled={this.state.locked}>
            {this.props.i18n.text.get('plugin.communicator.createmessage.button.clearDraft')}
          </Button> : null}
        </div>
      )
    }

    return <EnvironmentDialog modifier="new-message"
      title={this.props.i18n.text.get('plugin.communicator.createmessage.label')}
      content={content} footer={footer} onOpen={this.checkAgainstStoredState}
      onClose={this.props.onClose} isOpen={this.props.isOpen}>
      {this.props.children}
    </EnvironmentDialog>
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    signature: state.messages && state.messages.signature,
    status: state.status
  }
};

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ sendMessage }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorNewMessage);
