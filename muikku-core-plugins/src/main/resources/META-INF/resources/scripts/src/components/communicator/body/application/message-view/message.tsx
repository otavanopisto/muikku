import * as React from "react";
import Link from "~/components/general/link";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { ContactRecipientType } from "~/reducers/user-index";
import { StatusType } from "~/reducers/base/status";
import { colorIntToHex, getName } from "~/util/modifiers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/link.scss";
import AnswerMessageDrawer from "./message-editor/answer-message-drawer";
import CkeditorLoaderContent from "../../../../base/ckeditor-loader/content";
import { isStringHTML } from "~/helper-functions/shared";
import { WithTranslation, withTranslation } from "react-i18next";
import InfoPopover from "~/components/general/info-popover";
// Message imported as IMessage to avoid conflict with Message component
// Component can be renamed to something else if needed later
import {
  CommunicatorSignature,
  CommunicatorUserBasicInfo,
  Message as IMessage,
  MessageThreadLabel,
} from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MessageProps
 */
interface MessageProps extends WithTranslation {
  message: IMessage;
  status: StatusType;
  signature: CommunicatorSignature;
  labels?: MessageThreadLabel[];
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
   * Renders sender of message with popover if sender is not current user
   *
   * @param sender sender object of message
   * @param userId userId of current logged in user
   * @returns Returns span element with sender name
   */
  getMessageSender(
    sender: CommunicatorUserBasicInfo,
    userId: number
  ): React.JSX.Element {
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

    // If sender is me
    const senderIsMe = sender.userEntityId === userId;

    // If sender has ended studies different styling
    if (sender.studiesEnded === true) {
      // And if sender is me then no popover
      return senderIsMe ? (
        <span key={sender.userEntityId} className="message__user-studies-ended">
          {name}
        </span>
      ) : (
        <InfoPopover userId={sender.userEntityId}>
          <span
            key={sender.userEntityId}
            className="message__user-studies-ended"
          >
            {name}
          </span>
        </InfoPopover>
      );
    }

    return senderIsMe ? (
      <span key={sender.userEntityId}>{name}</span>
    ) : (
      <InfoPopover userId={sender.userEntityId}>
        <span key={sender.userEntityId}>{name}</span>
      </InfoPopover>
    );
  }

  /**
   * Returns array of arrays that contains span elements with corresponding
   * recipients depending are they recipients, userGroups or workspaceRecipients
   *
   * @param message MessageType
   * @param userId userId of current logged in user
   * @returns React.JSX.Element[][]
   */
  getMessageRecipients(
    message: IMessage,
    userId: number
  ): React.JSX.Element[][] {
    const messageRecipientsList = message.recipients.map((recipient) => {
      // If recipient is me
      const recipientIsMe = recipient.userEntityId === userId;

      if (recipient.archived === true) {
        return (
          <span key={recipient.userEntityId} className="message__user-archived">
            {this.props.t("labels.archived", { ns: "users" })}
          </span>
        );
      }

      // If recipient has ended studies different styling
      if (recipient.studiesEnded === true) {
        // And if recipient is me then no popover
        return recipientIsMe ? (
          <span
            key={recipient.userEntityId}
            className="message__user-studies-ended"
          >
            {getName(recipient, !this.props.status.isStudent)}
          </span>
        ) : (
          <InfoPopover
            key={recipient.userEntityId}
            userId={recipient.userEntityId}
          >
            <span
              key={recipient.userEntityId}
              className="message__user-studies-ended"
            >
              {getName(recipient as any, !this.props.status.isStudent)}
            </span>
          </InfoPopover>
        );
      }

      return recipientIsMe ? (
        <span key={recipient.userEntityId}>
          {getName(recipient, !this.props.status.isStudent)}
        </span>
      ) : (
        <InfoPopover
          key={recipient.userEntityId}
          userId={recipient.userEntityId}
        >
          <span key={recipient.userEntityId}>
            {getName(recipient as any, !this.props.status.isStudent)}
          </span>
        </InfoPopover>
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
      .map((workspace) => {
        let workspaceName = workspace.workspaceName;

        if (workspace.workspaceExtension) {
          workspaceName += ` (${workspace.workspaceExtension})`;
        }

        return <span key={workspace.workspaceEntityId}>{workspaceName}</span>;
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
   * @returns React.JSX.Element
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
          value: ug as any,
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
                {this.getMessageSender(
                  this.props.message.sender,
                  this.props.status.userId
                )}
              </span>
              <span
                className="application-list__item-header-main-content application-list__item-header-main-content--communicator-recipients"
                aria-label={this.props.t("wcag.recipients", {
                  ns: "messaging",
                })}
              >
                {this.getMessageRecipients(
                  this.props.message,
                  this.props.status.userId
                )}
              </span>
            </div>
            <div className="application-list__item-header-aside application-list__item-header-aside--communicator-message-time">
              <span aria-label={this.props.t("wcag.date", { ns: "messaging" })}>
                {`${localize.date(
                  this.props.message.created
                )} - ${localize.date(this.props.message.created, "LT")}`}
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
                onClick={this.handleOpenNewMessage("person")}
              >
                {this.props.t("actions.reply", { ns: "messaging" })}
              </Link>
            )}
            {this.props.message.sender.studiesEnded ||
            this.props.message.sender.archived ? null : (
              <Link
                tabIndex={0}
                className="link link--application-list"
                onClick={this.handleOpenNewMessage("all")}
              >
                {this.props.t("actions.replyAll", { ns: "messaging" })}
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
                initialSubject={this.props.t("labels.replySubject", {
                  ns: "messaging",
                  topic: this.props.message.caption,
                })}
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
                initialSubject={this.props.t("labels.replySubject", {
                  ns: "messaging",
                  topic: this.props.message.caption,
                })}
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
    status: state.status,
    signature: state.messages && state.messages.signature,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["messaging", "users"])(
  connect(mapStateToProps, mapDispatchToProps)(Message)
);
