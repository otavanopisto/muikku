import { AnimatePresence } from "framer-motion";
import * as React from "react";
import ChatTabs, { ChatTabsHeader } from "./chat-tabs";

/**
 * ChatOverview
 * @returns JSX.Element
 */
function ChatOverview() {
  return (
    <>
      <div className="chat__controlbox-header">
        <ChatTabsHeader />
        <span
          /* onClick={toggleControlBox} */
          className="chat__button chat__button--close icon-cross"
        ></span>
      </div>

      <ChatTabs wrapper={<AnimatePresence initial={false} exitBeforeEnter />} />
    </>
  );
}

export default ChatOverview;
