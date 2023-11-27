import { AnimatePresence } from "framer-motion";
import * as React from "react";
import ChatViews from "./animated-views";
import { PeopleList } from "./people";
import { Rooms } from "./rooms";

/**
 * ChatMainProps
 */
interface ChatMainProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMain(props: ChatMainProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <div
        className="chat-rooms__wrapper"
        style={{
          display: "flex",
          background: "azure",
        }}
      >
        <Rooms />
      </div>
      <div
        className="chat__panel-wrapper"
        style={{
          display: "flex",
          flexGrow: 3,
          background: "antiquewhite",
        }}
      >
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </div>
      <div
        className="chat-people__wrapper"
        style={{
          display: "flex",
          background: "cadetblue",
          padding: "10px",
        }}
      >
        <PeopleList />
      </div>
    </div>
  );
}

export default ChatMain;
