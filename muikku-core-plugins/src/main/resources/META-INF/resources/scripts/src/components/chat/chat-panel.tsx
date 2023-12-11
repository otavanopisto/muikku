import * as React from "react";
import useMessages from "./hooks/useMessages";
import ChatMessage from "./chat-message";
import { useChatContext } from "./context/chat-context";

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  title: string;
  /**
   * Current user id.
   */
  userId: number;
  /**
   * Target identifier is used to load messages.
   */
  targetIdentifier: string;
  modifiers?: string[];
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPrivatePanel = (props: ChatPanelProps) => {
  const { closeDiscussion } = useChatContext();
  const { chatMsgs, newMessage, setNewMessage, postMessage } = useMessages(
    props.targetIdentifier,
    [props.targetIdentifier, `user-${props.userId}`]
  );

  return (
    <div className="chat__panel-wrapper">
      <div className={`chat__panel chat__panel--private`}>
        <div className="chat__panel-header chat__panel-header--private">
          <div className="chat__panel-header-title">
            <span
              className={"chat__online-indicator chat__online-indicator--"}
            ></span>
            <span className="chat__target-nickname">{props.title}</span>
          </div>

          <div
            onClick={closeDiscussion}
            className="chat__button chat__button--room-settings icon-cross"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <div className="chat__messages-container chat__messages-container--private">
            {chatMsgs.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            <div className="chat__messages-last-message"></div>
          </div>
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <textarea
            className="chat__memofield chat__memofield--muc-message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private"
            type="submit"
            onClick={postMessage}
          >
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ChatPublicPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatRoomPanel = (props: ChatPanelProps) => {
  const { closeDiscussion } = useChatContext();
  const { chatMsgs, newMessage, setNewMessage, postMessage } = useMessages(
    props.targetIdentifier,
    [props.targetIdentifier]
  );

  const isWorkspace = true;

  const chatRoomTypeClassName = isWorkspace ? "workspace" : "other";

  return (
    <div className="chat__panel-wrapper">
      <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
        <div
          className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}
        >
          <div className="chat__panel-header-title">{props.title}</div>

          <div className="chat__button chat__button--occupants icon-users"></div>

          <div className="chat__button chat__button--room-settings icon-cogs"></div>
          <div
            onClick={closeDiscussion}
            className="chat__button chat__button--room-settings icon-cross"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <div
            className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}
          >
            {chatMsgs.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            <div className="chat__messages-last-message"></div>
          </div>
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <input
            name="chatRecipient"
            className="chat__muc-recipient"
            readOnly
          />
          <label htmlFor={`sendGroupChatMessage`} className="visually-hidden">
            Lähetä
          </label>
          <textarea
            id={`sendGroupChatMessage-`}
            className="chat__memofield chat__memofield--muc-message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button
            className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`}
            type="submit"
            onClick={postMessage}
          >
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { ChatPrivatePanel, ChatRoomPanel };
