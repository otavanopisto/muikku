import * as React from "react";

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  modifiers?: string[];
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPanel = (props: ChatPanelProps) => {
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
          <div className="chat__button chat__button--minimize icon-minus"></div>
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

export default ChatPanel;
