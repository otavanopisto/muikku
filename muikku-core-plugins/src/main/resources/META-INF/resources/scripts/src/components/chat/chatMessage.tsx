import * as React from "react";
import "~/sass/elements/chat.scss";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { IBareMessageType } from "./chat";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import DeleteMessageDialog from "./deleteMessageDialog";

interface IChatUserInfoType {
  name: string;
  nick: string;
  studyProgramme: string;
}

const USER_INFO_CACHE: {
  [key: string]: IChatUserInfoType;
} = {};

interface IChatMessageProps {
  canToggleInfo: boolean;
  message: IBareMessageType;
  i18n: i18nType;
  canModerate?: boolean;
  editMessage?: (stanzaId: string, textContent: string) => void;
  deleteMessage?: (stanzaId: string) => void;
  chatType: string;
}

interface IChatMessageState {
  showInfo: boolean;
  realName: string;
  studyProgramme: string;
  showRemoveButton: boolean;
  messageDeleted: boolean;
  messageIsInEditMode: boolean;
  deleteMessageDialogOpen: boolean;
}

export class ChatMessage extends React.Component<
  IChatMessageProps,
  IChatMessageState
> {
  private unmounted = false;
  private contentEditableRef: React.RefObject<HTMLDivElement>;

  constructor(props: IChatMessageProps) {
    super(props);

    this.state = {
      showInfo: false,
      realName: null,
      studyProgramme: null,
      showRemoveButton: false,
      messageDeleted: false,
      deleteMessageDialogOpen: false,
      messageIsInEditMode: false,
    };

    this.contentEditableRef = React.createRef();

    this.toggleInfo = this.toggleInfo.bind(this);
    this.toggleDeleteMessageDialog = this.toggleDeleteMessageDialog.bind(this);
    this.onMessageDeleted = this.onMessageDeleted.bind(this);
    this.toggleMessageEditMode = this.toggleMessageEditMode.bind(this);
    this.onMessageEdited = this.onMessageEdited.bind(this);
    this.placeCaretToEnd = this.placeCaretToEnd.bind(this);
    this.onContentEditableKeyDown = this.onContentEditableKeyDown.bind(this);
  }
  async toggleInfo() {
    if (this.state.showInfo) {
      this.setState({
        showInfo: false,
        realName: null,
      });
    } else if (this.props.message.userId && this.props.canToggleInfo) {
      let userName: string = null;
      let studyProgramme: string = null;
      if (USER_INFO_CACHE[this.props.message.userId]) {
        userName = USER_INFO_CACHE[this.props.message.userId].name;
        studyProgramme =
          USER_INFO_CACHE[this.props.message.userId].studyProgramme;
      } else {
        const user: IChatUserInfoType = (await promisify(
          mApi().chat.userInfo.read(this.props.message.userId, {}),
          "callback",
        )()) as any;
        USER_INFO_CACHE[this.props.message.userId] = user;
        userName = user.name;
        studyProgramme = user.studyProgramme;
      }

      this.setState({
        showInfo: true,
        realName: userName,
        studyProgramme,
      });
    }
  }
  componentWillUnmount() {
    this.unmounted = true;
  }
  toggleDeleteMessageDialog(e?: React.MouseEvent) {
    e && e.stopPropagation();
    e && e.preventDefault();

    if (!this.unmounted) {
      this.setState({
        deleteMessageDialogOpen: !this.state.deleteMessageDialogOpen,
      });
    }
  }
  onMessageDeleted() {
    this.props.deleteMessage(this.props.message.stanzaId);
  }
  getMessageModerationListDropdown() {
    const messageModerationItemsOptions: Array<any> = [
      {
        icon: "trash",
        text: "plugin.chat.messages.deleteMessage",
        onClick: this.toggleDeleteMessageDialog,
      },
      {
        icon: "pencil",
        text: "plugin.chat.messages.editMessage",
        onClick: this.toggleMessageEditMode,
      },
    ];

    // Student/staff member can only edit their own messages
    if (!this.props.message.isSelf) {
      messageModerationItemsOptions.pop();
    }

    return messageModerationItemsOptions;
  }
  toggleMessageEditMode() {
    if (this.state.messageIsInEditMode) {
      this.setState({
        messageIsInEditMode: false,
      });
    } else {
      this.setState(
        {
          messageIsInEditMode: true,
        },
        () => {
          this.contentEditableRef.current.focus();
        },
      );
    }
  }
  onMessageEdited(e: React.MouseEvent) {
    e.preventDefault();
    let finalText = "";
    const childNodes = this.contentEditableRef.current.childNodes;
    childNodes.forEach((n: Node, index) => {
      finalText += n.textContent;
      const isLast = childNodes.length - 1 === index;
      if ((n as HTMLElement).tagName && !isLast) {
        finalText += "\n";
      }
    });

    this.toggleMessageEditMode();
    this.props.editMessage(this.props.message.stanzaId, finalText);
  }
  placeCaretToEnd(event: React.FocusEvent) {
    const e = event.currentTarget;
    const range = document.createRange();
    range.setStart(e, e.childNodes.length);
    range.setEnd(e, e.childNodes.length);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  onContentEditableKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.stopPropagation();
      this.onMessageEdited(event as any);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      this.toggleMessageEditMode();
    }
  }
  render() {
    const senderClass = this.props.message.isSelf ? "sender-me" : "sender-them";
    const messageDeletedClass = this.props.message.deleted
      ? "chat__message--deleted"
      : "";

    return (
      <div
        className={`chat__message chat__message--${senderClass} ${messageDeletedClass}`}
      >
        <div className="chat__message-meta">
          <span
            className={`chat__message-meta-sender ${
              this.props.canToggleInfo &&
              "chat__message-meta-sender--access-to-realname"
            }`}
            onClick={this.toggleInfo}
          >
            {this.props.message.nick}
            {this.state.showInfo && (
              <span className="chat__message-meta-sender-real-name">
                ({this.state.realName}
                {this.state.showInfo &&
                  this.state.studyProgramme &&
                  this.state.studyProgramme !== "null" && (
                    <span> - {this.state.studyProgramme}</span>
                  )}
                )
              </span>
            )}
          </span>
          <span className="chat__message-meta-timestamp">
            {this.props.i18n.time.formatDaily(this.props.message.timestamp)}
          </span>
          {(this.props.canModerate || this.props.message.isSelf) &&
          !this.props.message.deleted &&
          this.props.chatType != "private" ? (
            <span
              className={`chat__message-actions ${
                this.props.message.isSelf
                  ? "chat__message-actions--sender-me"
                  : "chat__message-actions--sender-them"
              }`}
            >
              <Dropdown
                alignSelf={this.props.message.isSelf ? "right" : "left"}
                modifier="chat"
                items={this.getMessageModerationListDropdown().map(
                  (item) => (closeDropdown: () => any) =>
                    (
                      <Link
                        href={item.href}
                        to={item.to ? item.href : null}
                        className={`link link--full link--chat-dropdown`}
                        onClick={(...args: any[]) => {
                          closeDropdown();
                          item.onClick && item.onClick(...args);
                        }}
                      >
                        <span className={`link__icon icon-${item.icon}`}></span>
                        <span>{this.props.i18n.text.get(item.text)}</span>
                      </Link>
                    ),
                )}
              >
                <span className="chat__message-action icon-more_vert"></span>
              </Dropdown>
            </span>
          ) : null}
        </div>
        {this.state.messageIsInEditMode && !this.props.message.deleted ? (
          <div className="chat__message-content-container" key="editable">
            <div
              className="chat__message-content chat__message-content--edit-mode"
              contentEditable
              ref={this.contentEditableRef}
              onFocus={this.placeCaretToEnd}
              onKeyDown={this.onContentEditableKeyDown}
            >
              {this.props.message.message}
            </div>
            <div className="chat__message-footer">
              <span
                className="chat__message-footer-action"
                onClick={this.toggleMessageEditMode}
              >
                {this.props.i18n.text.get(
                  "plugin.chat.messages.editMessage.cancelLink",
                )}
              </span>
              <span>
                {this.props.i18n.text.get(
                  "plugin.chat.messages.editMessage.orText",
                )}
              </span>
              <span
                className="chat__message-footer-action"
                onClick={this.onMessageEdited}
              >
                {this.props.i18n.text.get(
                  "plugin.chat.messages.editMessage.saveLink",
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="chat__message-content-container" key="nonEditable">
            <div className="chat__message-content">
              {this.props.message.deleted ? (
                <i>
                  {this.props.i18n.text.get(
                    "plugin.chat.messages.messageIsDeleted",
                  )}
                </i>
              ) : (
                this.props.message.message
              )}
              {this.props.message.edited && (
                <div className="chat__message-edited-info">
                  {this.props.i18n.text.get("plugin.chat.messages.edited")}{" "}
                  {this.props.i18n.time.formatDaily(
                    this.props.message.edited.timestamp,
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <DeleteMessageDialog
          isOpen={this.state.deleteMessageDialogOpen}
          onClose={this.toggleDeleteMessageDialog}
          onDelete={this.onMessageDeleted}
        />
      </div>
    );
  }
}
