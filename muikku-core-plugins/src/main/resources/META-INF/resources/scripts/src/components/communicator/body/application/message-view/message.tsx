import NewMessage from "../../../dialogs/new-message";
import * as React from "react";
import {
  MessageType,
  MessageThreadLabelListType,
} from "~/reducers/main-function/messages";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { connect, Dispatch } from "react-redux";
import { ContactRecipientType, UserType } from '~/reducers/user-index';
import { StatusType } from "~/reducers/base/status";
import { colorIntToHex, getName } from "~/util/modifiers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/link.scss";
import AnswerMessageDrawer from "./message-editor/answer-message-drawer";
import { MessageSignatureType } from "~/reducers/main-function/messages";

interface MessageProps {
  message: MessageType;
  status: StatusType;
  signature: MessageSignatureType;
  i18n: i18nType;
  labels?: MessageThreadLabelListType;
}

interface MessageState {
  openNewMessageType?: "person" | "all";
}

class Message extends React.Component<MessageProps, MessageState> {
  constructor(props: MessageProps) {
    super(props);

    this.state = {};

    this.getMessageRecipients = this.getMessageRecipients.bind(this);
    this.getMessageSender = this.getMessageSender.bind(this);
  }

  /**
   * getMessageSender
   * @param sender
   * @returns
   * Returns span element with sender name
   */
  getMessageSender(sender: UserType): JSX.Element {
    if (sender.archived === true) {
      return (
        <span key={sender.userEntityId} className="message__user-archived">
          {this.props.i18n.text.get("plugin.communicator.sender.archived")}
        </span>
      );
    }
    if (sender.studiesEnded === true) {
      return (
        <span key={sender.userEntityId} className="message__user-studies-ended">
          {getName(sender as any, !this.props.status.isStudent)}
        </span>
      );
    }
    return (
      <span key={sender.userEntityId}>
        {getName(sender as any, !this.props.status.isStudent)}
      </span>
    );
  }

  /**
   * getMessageRecipients
   * @param message MessageType
   * @returns JSX.Element[][]
   *
   * Returns array of arrays that contains span elements with corresponding
   * recipients depending are they recipients, userGroups or workspaceRecipients
   */
  getMessageRecipients(message: MessageType): JSX.Element[][] {
    let messageRecipientsList = message.recipients.map((recipient) => {
      if (recipient.archived === true) {
        return (
          <span key={recipient.recipientId} className="message__user-archived">
            {this.props.i18n.text.get("plugin.communicator.sender.archived")}
          </span>
        );
      }
      if (recipient.studiesEnded === true) {
        return (
          <span
            key={recipient.recipientId}
            className="message__user-studies-ended"
          >
            {getName(recipient as any, !this.props.status.isStudent)}
          </span>
        );
      }
      return (
        <span key={recipient.recipientId}>
          {getName(recipient as any, !this.props.status.isStudent)}
        </span>
      );
    });

    let userGroupRecipientsList = message.userGroupRecipients.map((group) => {
      return <span>{group.name}</span>;
    });

    let workspaceRecipientsList = message.workspaceRecipients
      .filter((w, pos, self) => {
        return (
          self.findIndex(
            (w2) => w2.workspaceEntityId === w.workspaceEntityId
          ) === pos
        );
      })
      .map((workspace) => {
        return <span>{workspace.workspaceName}</span>;
      });

    return [
      messageRecipientsList,
      userGroupRecipientsList,
      workspaceRecipientsList,
    ];
  }

  /**
   * handleOpenNewMessage
   * sets state new message type to indicating that with type there
   * is new message editor visible/open. If clicking second time
   * same then close exixting dialog
   * @param type
   */
  handleOpenNewMessage =
    (type: "person" | "all") =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        this.setState({
          openNewMessageType:
            type !== this.state.openNewMessageType ? type : undefined,
        });
      };

  /**
   * handleCancelNewMessage
   */
  handleCancelNewMessage = () => {
    setTimeout(() => {
      this.setState({
        openNewMessageType: undefined,
      });
    }, 250);
  };

  /**
   * render
   * @returns
   */
  render() {
    /**
     * This is the sender of the message
     */
    const senderObject: ContactRecipientType = {
      type: "user",
      value: {
        id: this.props.message.sender.userEntityId,
        name: getName(this.props.message.sender, true)
      }
    };

    /**
     * These are the receipients of the message that are mapped to new array
     * Then filtering the logged sender away from the recepients,
     * recipient who has ended his studies and recipient who has been archived
     */

    const recipientsList: Array<ContactRecipientType> = this.props.message.recipients.map((r): ContactRecipientType => ({
      type: "user",
      value: {
        id: r.userEntityId,
        name: getName(r, true),
        studiesEnded: r.studiesEnded,
        archived: r.archived
      }
    })).filter(user =>
      user.value.id !== this.props.status.userId
      && user.value.studiesEnded !== true
      && user.value.archived !== true)

    /**
     * These are the usergroup recepients
     */
    const userGroupList: Array<ContactRecipientType> =
      this.props.message.userGroupRecipients.map((ug): ContactRecipientType => ({
        type: "usergroup",
        value: ug
      }));

    const workspaceRecepientsFiltered =
      this.props.message.workspaceRecipients.filter((w, pos, self) => {
        return (
          self.findIndex(
            (w2) => w2.workspaceEntityId === w.workspaceEntityId
          ) === pos
        );
      });

    /**
     * And the workspace recepients, sadly has to force it
     */
    const workspaceList: Array<ContactRecipientType> = workspaceRecepientsFiltered.map((w): ContactRecipientType => ({
      type: "workspace",
      value: {
        id: w.workspaceEntityId,
        name: w.workspaceName,
      }
    }));


    /**
     * The basic reply target is the sender
     */
    let replyTarget = [senderObject];

    /**
     * If the logged in user is the message sender, we filter him out from the message recipients
     * so "reply to self" is not possible. Therefore reply will target the message recipients instead.
     * Also we filter message recipients based on whether logged in user has permission to sent message to
     * usergroups or workspaces.
     * replyTarget can have multiple recipients IF message sender is the same as currently logged in user
     * AND message has been sent to multiple recipients AND currently logged in user has permissions to
     * send the message to said recipients.
     * The last filter will filter out currently logged in user from userGroupList and workspaceList so
     * user cannot send messages to him self.
     */

    if (senderObject.value.id === this.props.status.userId) {
      replyTarget = [senderObject]
        .concat(recipientsList as any)
        .concat(
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
            ? (userGroupList as any)
            : []
        )
        .concat(
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
            ? (workspaceList as any)
            : []
        )
        .filter((t) => t.value.id !== this.props.status.userId);
    }

    /**
     * Defining what all recipients will get messages depending their
     * permissions
     */
    const replyAllTarget = [senderObject]
      .concat(recipientsList as any)
      .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? userGroupList as any : [])
      .concat(this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING ? workspaceList as any : [])
      .filter((t) => t.value.id !== senderObject.value.id)
      .concat(senderObject as any).filter((t) => t.value.id !== this.props.status.userId);

    return (
      <div className="application-list__item application-list__item--communicator-message">
        <div className="application-list__item-header application-list__item-header--communicator-message-thread">
          <div className="application-list__item-meta">
            <div className="application-list__item-header-main application-list__item-header-main--communicator-message-participants">
              <span
                className="application-list__item-header-main-content application-list__item-header-main-content--communicator-sender"
                aria-label={this.props.i18n.text.get(
                  "plugin.wcag.messageSender.aria.label"
                )}
              >
                {this.getMessageSender(this.props.message.sender)}
              </span>
              <span
                className="application-list__item-header-main-content application-list__item-header-main-content--communicator-recipients"
                aria-label={this.props.i18n.text.get(
                  "plugin.wcag.messageRecipients.aria.label"
                )}
              >
                {this.getMessageRecipients(this.props.message)}
              </span>
            </div>
            <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
              <span
                aria-label={this.props.i18n.text.get(
                  "plugin.wcag.messageSendDate.aria.label"
                )}
              >
                {this.props.i18n.time.format(this.props.message.created)}
              </span>
            </div>
          </div>
          {this.props.labels && this.props.labels.length ? (
            <div className="labels labels--communicator-message">
              {this.props.labels &&
                this.props.labels.map((label) => {
                  return (
                    <span
                      className="label"
                      key={label.id}
                      aria-label={this.props.i18n.text.get(
                        "plugin.wcag.messageLabel.aria.label"
                      )}
                    >
                      <span
                        className="label__icon icon-tag"
                        style={{ color: colorIntToHex(label.labelColor) }}
                      ></span>
                      <span className="label__text">{label.labelName}</span>
                    </span>
                  );
                })}
            </div>
          ) : null}
        </div>
        <div
          className="application-list__item-body application-list__item-body--communicator-message-thread"
          aria-label={this.props.i18n.text.get(
            "plugin.wcag.messageContent.aria.label"
          )}
        >
          <header className="application-list__item-content-header">
            {this.props.message.caption}
          </header>
          <section
            className="application-list__item-content-body rich-text"
            dangerouslySetInnerHTML={{ __html: this.props.message.content }}
          ></section>
          <footer className="application-list__item-footer application-list__item-footer--communicator-message-thread-actions">
            {this.props.message.sender.studiesEnded ||
              this.props.message.sender.archived ? null : (
              <Link
                tabIndex={0}
                className="link link--application-list-item-footer"
                onClick={this.handleOpenNewMessage("person")}
              >
                {this.props.i18n.text.get("plugin.communicator.reply")}
              </Link>
            )}
            {this.props.message.sender.studiesEnded ||
              this.props.message.sender.archived ? null : (
              <Link
                tabIndex={0}
                className="link link--application-list-item-footer"
                onClick={this.handleOpenNewMessage("all")}
              >
                {this.props.i18n.text.get("plugin.communicator.replyAll")}
              </Link>
            )}
          </footer>
        </div>
        <div
          className="application-list__item-body application-list__item-body--communicator-message-thread"
          aria-label={this.props.i18n.text.get(
            "plugin.wcag.messageContent.aria.label"
          )}
        >
          <div className="application-list__item-content-body">
            {this.state.openNewMessageType &&
              this.state.openNewMessageType === "person" ? (
              <AnswerMessageDrawer
                onClickCancel={this.handleCancelNewMessage}
                replyThreadId={this.props.message.communicatorMessageId}
                messageId={this.props.message.id}
                initialSelectedItems={replyTarget}
                initialSubject={this.props.i18n.text.get(
                  "plugin.communicator.createmessage.title.replySubject",
                  this.props.message.caption
                )}
              />
            ) : null}

            {this.state.openNewMessageType &&
              this.state.openNewMessageType === "all" ? (
              <AnswerMessageDrawer
                onClickCancel={this.handleCancelNewMessage}
                replyThreadId={this.props.message.communicatorMessageId}
                messageId={this.props.message.id}
                initialSelectedItems={replyAllTarget}
                replyToAll
                initialSubject={this.props.i18n.text.get(
                  "plugin.communicator.createmessage.title.replySubject",
                  this.props.message.caption
                )}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
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
    status: state.status,
    signature: state.messages && state.messages.signature,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Message);
