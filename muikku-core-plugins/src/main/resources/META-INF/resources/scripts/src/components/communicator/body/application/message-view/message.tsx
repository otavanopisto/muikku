import * as React from "react";
import {
  MessageType,
  MessageThreadLabelListType,
} from "~/reducers/main-function/messages";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { connect, Dispatch } from "react-redux";
import { ContactRecipientType, UserType } from "~/reducers/user-index";
import { StatusType } from "~/reducers/base/status";
import { colorIntToHex, getName } from "~/util/modifiers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/link.scss";
import AnswerMessageDrawer from "./message-editor/answer-message-drawer";
import { MessageSignatureType } from "~/reducers/main-function/messages";
import { AnyActionType } from "~/actions";
import CkeditorLoaderContent from "../../../../base/ckeditor-loader/content";
import { isStringHTML } from "~/helper-functions/shared";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * MessageProps
 */
interface MessageProps extends WithTranslation {
  message: MessageType;
  status: StatusType;
  signature: MessageSignatureType;
  i18nOLD: i18nType;
  labels?: MessageThreadLabelListType;
}

/**
 * MessageState
 */
interface MessageState {
  openNewMessageType?: "person" | "all";
}

/**
 * Message
 */
class Message extends React.Component<MessageProps, MessageState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MessageProps) {
    super(props);

    this.state = {};

    this.getMessageRecipients = this.getMessageRecipients.bind(this);
    this.getMessageSender = this.getMessageSender.bind(this);
  }

  /**
   * getMessageSender
   * @param sender sender
   * @returns Returns span element with sender name
   */
  getMessageSender(sender: UserType): JSX.Element {
    if (sender.archived === true) {
      return (
        <span key={sender.userEntityId} className="message__user-archived">
          {this.props.t("labels.archived")}
        </span>
      );
    }

    let name = `${getName(sender, !this.props.status.isStudent)}`;

    if (sender.studyProgrammeName) {
      name = `${getName(sender, !this.props.status.isStudent)} (${
        sender.studyProgrammeName
      })`;
    }

    if (sender.studiesEnded === true) {
      return (
        <span key={sender.userEntityId} className="message__user-studies-ended">
          {name}
        </span>
      );
    }
    return <span key={sender.userEntityId}>{name}</span>;
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
    const messageRecipientsList = message.recipients.map((recipient) => {
      if (recipient.archived === true) {
        return (
          <span key={recipient.userEntityId} className="message__user-archived">
            {this.props.t("labels.archived", { ns: "users" })}
          </span>
        );
      }
      if (recipient.studiesEnded === true) {
        return (
          <span
            key={recipient.userEntityId}
            className="message__user-studies-ended"
          >
            {getName(recipient, !this.props.status.isStudent)}
          </span>
        );
      }
      return (
        <span key={recipient.userEntityId}>
          {getName(recipient, !this.props.status.isStudent)}
        </span>
      );
    });

    const userGroupRecipientsList = message.userGroupRecipients.map((group) => (
      <span key={group.id}>{group.name}</span>
    ));

    const workspaceRecipientsList = message.workspaceRecipients
      .filter(
        (w, pos, self) =>
          self.findIndex(
            (w2) => w2.workspaceEntityId === w.workspaceEntityId
          ) === pos
      )
      .map((workspace) => (
        <span key={workspace.workspaceEntityId}>{workspace.workspaceName}</span>
      ));

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
   * @param type type
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
   * @returns JSX.Element
   */
  render() {
    /**
     * This is the sender of the message
     */
    const senderObject: ContactRecipientType = {
      type: "user",
      value: {
        id: this.props.message.sender.userEntityId,
        name: getName(this.props.message.sender, true),
      },
    };

    /**
     * These are the receipients of the message that are mapped to new array
     * Then filtering the logged sender away from the recepients,
     * recipient who has ended his studies and recipient who has been archived
     */

    const recipientsList: Array<ContactRecipientType> =
      this.props.message.recipients
        .map(
          (r): ContactRecipientType => ({
            type: "user",
            value: {
              id: r.userEntityId,
              name: getName(r, true),
              studiesEnded: r.studiesEnded,
              archived: r.archived,
            },
          })
        )
        .filter(
          (user) =>
            user.value.id !== this.props.status.userId &&
            user.value.studiesEnded !== true &&
            user.value.archived !== true
        );

    /**
     * These are the usergroup recepients
     */
    const userGroupList: Array<ContactRecipientType> =
      this.props.message.userGroupRecipients.map(
        (ug): ContactRecipientType => ({
          type: "usergroup",
          value: ug,
        })
      );

    const workspaceRecepientsFiltered =
      this.props.message.workspaceRecipients.filter(
        (w, pos, self) =>
          self.findIndex(
            (w2) => w2.workspaceEntityId === w.workspaceEntityId
          ) === pos
      );

    /**
     * And the workspace recepients, sadly has to force it
     */
    const workspaceList: Array<ContactRecipientType> =
      workspaceRecepientsFiltered.map(
        (w): ContactRecipientType => ({
          type: "workspace",
          value: {
            id: w.workspaceEntityId,
            name: w.workspaceName,
          },
        })
      );

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
     * The last filter will filter out currently logged in user from userGroupList and workspaceList so
     * user cannot send messages to him self.
     */

    if (senderObject.value.id === this.props.status.userId) {
      replyTarget = [senderObject]
        .concat(recipientsList)
        .concat(
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
            ? userGroupList
            : []
        )
        .concat(
          this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
            ? workspaceList
            : []
        )
        .filter((t) => t.value.id !== this.props.status.userId);
    }

    /**
     * Defining what all recipients will get messages depending their
     * permissions
     */
    const replyAllTarget = [senderObject]
      .concat(recipientsList)
      .concat(
        this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
          ? userGroupList
          : []
      )
      .concat(
        this.props.status.permissions.COMMUNICATOR_GROUP_MESSAGING
          ? workspaceList
          : []
      )
      .filter((t) => t.value.id !== senderObject.value.id)
      .concat(senderObject)
      .filter((t) => t.value.id !== this.props.status.userId);

    return (
      <div className="application-list__item application-list__item--communicator-message">
        <div className="application-list__item-header application-list__item-header--communicator-message-thread">
          <div className="application-list__item-meta">
            <div className="application-list__item-header-main application-list__item-header-main--communicator-message-participants">
              <span
                className="application-list__item-header-main-content application-list__item-header-main-content--communicator-sender"
                aria-label={this.props.t("wcag.sender", { ns: "messaging" })}
              >
                {this.getMessageSender(this.props.message.sender)}
              </span>
              <span
                className="application-list__item-header-main-content application-list__item-header-main-content--communicator-recipients"
                aria-label={this.props.t("wcag.recipients", {
                  ns: "messaging",
                })}
              >
                {this.getMessageRecipients(this.props.message)}
              </span>
            </div>
            <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
              <span
                // TODO: use i18next
                aria-label={this.props.t("wcag.date", { ns: "messaging" })}
              >
                {this.props.i18nOLD.time.format(this.props.message.created)}
              </span>
            </div>
          </div>
          {this.props.labels && this.props.labels.length ? (
            <div className="labels labels--communicator-message">
              {this.props.labels &&
                this.props.labels.map((label) => (
                  <span
                    className="label"
                    key={label.id}
                    aria-label={this.props.t("wcag.label", { ns: "messaging" })}
                  >
                    <span
                      className="label__icon icon-tag"
                      style={{ color: colorIntToHex(label.labelColor) }}
                    ></span>
                    <span className="label__text">{label.labelName}</span>
                  </span>
                ))}
            </div>
          ) : null}
        </div>
        <div
          className="application-list__item-body application-list__item-body--communicator-message-thread"
          aria-label={this.props.t("wcag.content", { ns: "messaging" })}
        >
          <header className="application-list__item-content-header">
            {this.props.message.caption}
          </header>
          <section className="application-list__item-content-body rich-text">
            {/*
             * Its possible that string content containg html as string is not valid
             * and can't be processed by CkeditorLoader, so in those cases just put content
             * inside of "valid" html tags and go with it
             */}
            {isStringHTML(this.props.message.content) ? (
              <CkeditorLoaderContent html={this.props.message.content} />
            ) : (
              <CkeditorLoaderContent
                html={`<p>${this.props.message.content}</p>`}
              />
            )}
          </section>
          <footer className="application-list__item-footer application-list__item-footer--communicator-message-thread-actions">
            {this.props.message.sender.studiesEnded ||
            this.props.message.sender.archived ? null : (
              <Link
                tabIndex={0}
                className="link link--application-list"
                onClick={this.handleOpenNewMessage("all")}
              >
                {this.props.t("actions.reply", { ns: "messaging" })}
              </Link>
            )}
          </footer>
        </div>
        <div
          className="application-list__item-body application-list__item-body--communicator-message-thread"
          aria-label={this.props.t("wcag.content", { ns: "messaging" })}
        >
          <div className="application-list__item-content-body">
            {this.state.openNewMessageType &&
            this.state.openNewMessageType === "person" ? (
              <AnswerMessageDrawer
                onClickCancel={this.handleCancelNewMessage}
                replyThreadId={this.props.message.communicatorMessageId}
                messageId={this.props.message.id}
                initialSelectedItems={replyTarget}
                initialSubject={this.props.t(
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
                initialSubject={this.props.t(
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    status: state.status,
    signature: state.messages && state.messages.signature,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["messaging", "users"])(
  connect(mapStateToProps, mapDispatchToProps)(Message)
);
