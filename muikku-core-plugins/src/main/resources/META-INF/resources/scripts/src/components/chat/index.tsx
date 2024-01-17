import * as React from "react";
import "~/sass/elements/chat.scss";
import ChatContextProvider, { useChatContext } from "./context/chat-context";
import ChatWindow from "./chat-window";
import ChatMain from "./chat-main";
import ChatMainMobile from "./chat-main-mobile";
import { ChatWindowContextProvider } from "./context/chat-window-context";
import useChatSettings from "./hooks/useChatSettings";
import ChatUnblockDiscussionDialog from "./dialogs/chat-unblock-discussion-dialog";
import ChatCloseAndBlockDiscussionDialog from "./dialogs/chat-close-and-block-discussion-dialog";

/**
 * Chat component. Renders or not depending on chat settings
 * @returns JSX.Element
 */
const Chat = () => {
  const { currentUser, chatEnabled } = useChatSettings();

  if (!chatEnabled) {
    return null;
  }

  return (
    <ChatContextProvider currentUser={currentUser}>
      <ChatContent />
    </ChatContextProvider>
  );
};

/**
 * Actual chat content. Renders chat bubble and chat window
 * @returns JSX.Element
 */
const ChatContent = () => {
  const { minimized, toggleControlBox, isMobileWidth, discussionInstances } =
    useChatContext();

  // Use effect to destroy all messages instances when component unmounts
  React.useEffect(
    () => () => {
      discussionInstances.map((instance) => {
        instance.destroy();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Render chat mobile or desktop version
  const mobileOrDesktop = React.useMemo(() => {
    if (minimized) {
      return null;
    }
    if (isMobileWidth) {
      return <ChatMainMobile />;
    }
    return (
      <ChatWindow>
        <ChatMain />
      </ChatWindow>
    );
  }, [isMobileWidth, minimized]);

  return (
    <ChatWindowContextProvider>
      {/* Chat bubble */}
      {minimized && (
        <div onClick={toggleControlBox} className="chat-bubble">
          <span className="icon-chat"></span>
        </div>
      )}

      {mobileOrDesktop}
      <ChatUnblockDiscussionDialog />
      <ChatCloseAndBlockDiscussionDialog />
    </ChatWindowContextProvider>
  );
};

export default Chat;
