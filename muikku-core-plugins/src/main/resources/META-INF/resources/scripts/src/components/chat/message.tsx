import * as React from "react";
import MApi from "~/api/api";
import { ChatMessage } from "~/generated/client";
import { localize } from "~/locales/i18n";
import Dropdown from "../general/dropdown";
import Link from "../general/link";

/**
 * ChatMessageProps
 */
interface ChatMessageProps {
  senderIsMe: boolean;
  msg: ChatMessage;
}

const chatApi = MApi.getChatApi();

/**
 * ChatMessage
 * @param props props
 * @returns JSX.Element
 */
const ChatMessage = (props: ChatMessageProps) => {
  const { senderIsMe, msg } = props;
  const { archived, editedDateTime } = msg;

  const contentEditableRef = React.useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = React.useState<boolean>(true);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const [editedMsg, setEditedMsg] = React.useState<string>(msg.message);

  const senderClass = senderIsMe ? "sender-me" : "sender-them";
  const messageLoadingClassName = !isLoaded
    ? "chat__message--loading"
    : "chat__message--loaded";

  const messageDeletedClass = archived ? "chat__message--deleted" : "";

  /**
   * onMessageEdited
   * @param e e
   */
  const onMessageEdited = (e: React.MouseEvent) => {
    e.preventDefault();
    let finalText = "";
    const childNodes = contentEditableRef.current.childNodes;
    childNodes.forEach((n: Node, index) => {
      finalText += n.textContent;
      const isLast = childNodes.length - 1 === index;
      if ((n as HTMLElement).tagName && !isLast) {
        finalText += "\n";
      }
    });

    setEditedMsg(finalText);
  };

  /**
   * onContentEditableKeyDown
   * @param event event
   */
  const onContentEditableKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.stopPropagation();
      onMessageEdited(event as any);
    } else if (event.key === "Escape") {
      event.stopPropagation();
      event.preventDefault();
      setIsEditing(false);
    }
  };

  /**
   * deleteMsg
   */
  const deleteMsg = async () => {
    await chatApi.deleteChatMessage({
      messageId: msg.id,
    });
  };

  const updateMsg = async () => {
    await chatApi.updateChatMessage({
      messageId: msg.id,
      updateChatMessageRequest: {
        message: editedMsg,
      },
    });

    setIsEditing(false);
  };

  /**
   * getMessageModerationListDropdown
   */
  const getMessageModerationListDropdown = () => {
    const messageModerationItemsOptions: Array<any> = [
      {
        icon: "trash",
        text: "Poista",
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClick: () => deleteMsg(),
      },
      {
        icon: "pencil",
        text: "Muokkaa",
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClick: () => setIsEditing(true),
      },
    ];

    // Student/staff member can only edit their own messages
    if (!senderIsMe) {
      messageModerationItemsOptions.pop();
    }

    return messageModerationItemsOptions;
  };
  return (
    <div
      className={`chat__message chat__message--${senderClass} ${messageDeletedClass} ${messageLoadingClassName}`}
    >
      <div className="chat__message-meta">
        <span className={`chat__message-meta-sender`}>{msg.nick}</span>
        <span className="chat__message-meta-timestamp">
          {localize.formatDaily(msg.sentDateTime)}
        </span>

        <span
          className={`chat__message-actions ${
            senderIsMe
              ? "chat__message-actions--sender-me"
              : "chat__message-actions--sender-them"
          }`}
        >
          <Dropdown
            alignSelf={senderIsMe ? "right" : "left"}
            modifier="chat"
            items={getMessageModerationListDropdown().map(
              // eslint-disable-next-line react/display-name
              (item) => (closeDropdown: () => any) =>
                (
                  <Link
                    className={`link link--full link--chat-dropdown`}
                    onClick={item.onClick}
                  >
                    <span className={`link__icon icon-${item.icon}`}></span>
                    <span>{item.text}</span>
                  </Link>
                )
            )}
          >
            <span className="chat__message-action icon-more_vert"></span>
          </Dropdown>
        </span>
      </div>
      {isEditing && !archived ? (
        <div className="chat__message-content-container" key="editable">
          <div
            ref={contentEditableRef}
            className="chat__message-content chat__message-content--edit-mode"
            contentEditable
            onKeyUp={onContentEditableKeyDown}
          >
            {msg.message}
          </div>
          <div className="chat__message-footer">
            <span
              className="chat__message-footer-action"
              onClick={(e) => setIsEditing(false)}
            >
              Peruuta
            </span>
            <span>tai</span>
            <span className="chat__message-footer-action" onClick={updateMsg}>
              Tallenna
            </span>
          </div>
        </div>
      ) : (
        <div className="chat__message-content-container" key="nonEditable">
          <div className="chat__message-content">
            {archived ? <i>Poistettu</i> : msg.message}
            {editedDateTime && (
              <div className="chat__message-edited-info">
                Muokattu {localize.formatDaily(editedDateTime)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
