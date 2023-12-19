import * as React from "react";
import { motion } from "framer-motion";
import "~/sass/elements/chat.scss";
import { useChatContext } from "./context/chat-context";
import ChatWindow from "./chat-window";
import ChatMain from "./chat-main";
import ChatMainMobile from "./chat-main-mobile";
import { ChatWindowContextProvider } from "./context/chat-window-context";

/**
 * Chat
 * @returns JSX.Element
 */
const Chat = () => {
  const { minimized, toggleControlBox, isMobileWidth } = useChatContext();

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
      <motion.div className="chat">
        {/* Chat bubble */}
        {minimized && (
          <div onClick={toggleControlBox} className="chat__bubble">
            <span className="icon-chat"></span>
          </div>
        )}
      </motion.div>

      {mobileOrDesktop}
    </ChatWindowContextProvider>
  );
};

export default Chat;
