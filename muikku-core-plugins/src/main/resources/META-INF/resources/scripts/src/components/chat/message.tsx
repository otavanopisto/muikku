import * as React from "react";
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

/**
 * ChatMessage
 * @param props props
 * @returns JSX.Element
 */
const ChatMessage = (props: ChatMessageProps) => {
  const { senderIsMe, msg } = props;
  const { archived, editedDateTime } = msg;

  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);

  const senderClass = senderIsMe ? "sender-me" : "sender-them";
  const messageLoadingClassName = !isLoaded
    ? "chat__message--loading"
    : "chat__message--loaded";

  const messageDeletedClass = archived ? "chat__message--deleted" : "";

  /**
   * getMessageModerationListDropdown
   */
  const getMessageModerationListDropdown = () => {
    const messageModerationItemsOptions: Array<any> = [
      {
        icon: "trash",
        text: "Poista",
        // eslint-disable-next-line jsdoc/require-jsdoc
        onClick: () => {
          setIsLoaded(false);
        },
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
                  <Link className={`link link--full link--chat-dropdown`}>
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
            className="chat__message-content chat__message-content--edit-mode"
            contentEditable
          >
            {msg.message}
          </div>
          <div className="chat__message-footer">
            <span className="chat__message-footer-action">Peruuta</span>
            <span>tai</span>
            <span className="chat__message-footer-action">Tallenna</span>
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
