import * as React from "react";
import useMessages from "../hooks/useMessages";
import ChatMessage from "../message";

/**
 * ChatPanel
 */
export interface ChatPanel {
  index: number;
  identifier: string;
  name: string;
  component: React.ReactNode;
}

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  userId: number;
  targetIdentifier: string;
  modifiers?: string[];
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPrivatePanel = (props: ChatPanelProps) => {
  const [minimized, setMinimized] = React.useState<boolean>(false);

  /**
   * toggleMinized
   */
  const toggleMinized = React.useCallback(() => {
    setMinimized(!minimized);
  }, [minimized]);

  const notificationOn = true;

  if (minimized) {
    return (
      <div className="chat__panel-wrapper chat__panel-wrapper--reorder">
        <div
          className={
            notificationOn
              ? "chat__minimized chat__minimized--private chat__nofication--private"
              : "chat__minimized chat__minimized--private"
          }
          onClick={toggleMinized}
        >
          <div className="chat__minimized-title">
            <span className="chat__target-nickname">Niccki</span>
          </div>
          <div className="chat__button chat__button--close icon-cross"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat__panel-wrapper">
      <div className="chat__panel chat__panel--private">
        <div className="chat__panel-header chat__panel-header--private">
          <div className="chat__panel-header-title">
            <span
              className={"chat__online-indicator chat__online-indicator--"}
            ></span>
            <span className="chat__target-nickname">Niccki</span>
          </div>
          <div
            className="chat__button chat__button--minimize icon-minus"
            onClick={toggleMinized}
          ></div>
          <div className="chat__button chat__button--close icon-cross"></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <div className="chat__messages-container chat__messages-container--private">
            {/* {this.state.messages.map((message, index) => (
            <ChatMessage
              key={index}
              chatType="private"
              canToggleInfo={!this.state.isStudent}
              message={message}
            />
          ))} */}
            <div className="chat__messages-last-message"></div>
          </div>
        </div>
        <form className="chat__panel-footer chat__panel-footer--chatroom">
          <textarea className="chat__memofield chat__memofield--muc-message" />
          <button
            className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private"
            type="submit"
            value=""
          >
            <span className="icon-arrow-right"></span>
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * ChatPublicPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPublicPanel = (props: ChatPanelProps) => {
  const [minimized, setMinimized] = React.useState<boolean>(false);
  const [showOccupantsList, setShowOccupantsList] =
    React.useState<boolean>(false);
  const [openChatSettings, setOpenChatSettings] =
    React.useState<boolean>(false);

  const { chatMsgs, newMessage, setNewMessage, postMessage } = useMessages(
    props.targetIdentifier
  );

  /* const clonedChildren = React.useMemo(
    () =>
      React.cloneElement(useChatTabsValues.tab.component, {
        key: `subpanel-${useChatTabsValues.tab.index}`,
      }),
    [useChatTabsValues.tab.component, useChatTabsValues.tab.index]
  );

  const enhancedActiveTabContent = React.useMemo(
    () =>
      props.wrapper
        ? React.cloneElement(props.wrapper, {
            children: clonedChildren,
          })
        : clonedChildren,
    [clonedChildren, props.wrapper]
  ); */

  /**
   * toggleMinized
   */
  const toggleMinized = React.useCallback(() => {
    setMinimized(!minimized);
  }, [minimized]);

  const toggleOccupantsList = React.useCallback(() => {
    setShowOccupantsList(!showOccupantsList);
  }, [showOccupantsList]);

  const toggleChatRoomSettings = React.useCallback(() => {
    setOpenChatSettings(!openChatSettings);
  }, [openChatSettings]);

  const notificationOn = true;

  if (minimized) {
    return (
      <div className="chat__panel-wrapper chat__panel-wrapper--reorder">
        <div
          className={
            notificationOn
              ? "chat__minimized chat__minimized--public chat__nofication--public"
              : "chat__minimized chat__minimized--public"
          }
          onClick={toggleMinized}
        >
          <div className="chat__minimized-title">
            <span className="chat__target-nickname">Niccki</span>
          </div>
          <div className="chat__button chat__button--close icon-cross"></div>
        </div>
      </div>
    );
  }

  const isWorkspace = true;

  const chatRoomTypeClassName = isWorkspace ? "workspace" : "other";

  return (
    <div
      className={`chat__panel-wrapper ${
        minimized ? "chat__panel-wrapper--reorder" : ""
      }`}
    >
      {minimized === true ? (
        <div
          className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}
        >
          <div onClick={toggleMinized} className="chat__minimized-title">
            Huoneen nimi
          </div>
          <div className="chat__button chat__button--close icon-cross"></div>
        </div>
      ) : (
        <div
          className={`chat__panel chat__panel--${chatRoomTypeClassName} ${"chat__panel--active"}`}
        >
          <div
            className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}
          >
            <div className="chat__panel-header-title">Huoneen nimi</div>
            <div
              onClick={toggleOccupantsList}
              className="chat__button chat__button--occupants icon-users"
            ></div>
            <div
              onClick={toggleMinized}
              className="chat__button chat__button--minimize icon-minus"
            ></div>

            <div
              onClick={toggleChatRoomSettings}
              className="chat__button chat__button--room-settings icon-cogs"
            ></div>

            <div className="chat__button chat__button--close icon-cross"></div>
          </div>

          <div className="chat__panel-body chat__panel-body--chatroom">
            <div
              className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}
            >
              {chatMsgs.map((message) => (
                <ChatMessage
                  key={message.id}
                  msg={message}
                  senderIsMe={message.sourceUserEntityId === props.userId}
                />
              ))}
              <div className="chat__messages-last-message"></div>
            </div>
            {showOccupantsList && (
              <div className="chat__occupants-container">
                <div className="chat__occupants-staff"></div>
                <div className="chat__occupants-student"></div>
              </div>
            )}
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
      )}
    </div>
  );
};

export { ChatPrivatePanel, ChatPublicPanel };
