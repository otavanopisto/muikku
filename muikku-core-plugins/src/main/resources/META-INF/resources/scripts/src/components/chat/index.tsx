import { AnimatePresence } from "framer-motion";
import * as React from "react";
import "~/sass/elements/chat.scss";
import ChatPanel from "./chat-panel";
import ChatTabs, { ChatTab, ChatTabsHeader } from "./chat-tabs";
import AnimatedTab from "./chat-tabs/animated-tab";
import { ChatTabsProvider } from "./chat-tabs/context/chat-tabs-context";
import { useChatTabs } from "./chat-tabs/context/hooks/useChatTabs";
import { useChatContext } from "./context/chat-context";
import { ChatRoomContextProvider } from "./context/chat-room-context";
import { PeopleList } from "./people";
import { RoomsList } from "./rooms";

/**
 * Chat
 * @returns JSX.Element
 */
const Chat = () => {
  const { minimized, toggleControlBox, openPrivateRooms, openPublicRooms } =
    useChatContext();

  const previousStep = React.useRef<number>(0);

  /**
   * Default steps
   */
  const listOfTabs: ChatTab[] = [
    {
      index: 0,
      name: "Huoneet",
      component: (
        <AnimatedTab previousStep={previousStep}>
          <RoomsList />
        </AnimatedTab>
      ),
    },
    {
      index: 1,
      name: "Ihmiset",
      component: (
        <AnimatedTab previousStep={previousStep}>
          <PeopleList />
        </AnimatedTab>
      ),
    },
  ];

  const { ...useChatTabsValues } = useChatTabs({
    tabs: listOfTabs,
  });

  return (
    <div className="chat">
      {/* Chat bubble */}
      {minimized ? null : (
        <div onClick={toggleControlBox} className="chat__bubble">
          <span className="icon-chat"></span>
        </div>
      )}
      {/* Chat controlbox */}
      {minimized && (
        <div
          className="chat__controlbox"
          style={{
            width: "400px",
            height: "500px",
          }}
        >
          <ChatTabsProvider value={useChatTabsValues}>
            <div className="chat__controlbox-header">
              <ChatTabsHeader />
              <span
                onClick={toggleControlBox}
                className="chat__button chat__button--close icon-cross"
              ></span>
            </div>

            <ChatTabs
              wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
            />
          </ChatTabsProvider>
        </div>
      )}
      {/* Chat chatrooms */}
      <div className="chat__chatrooms-container">
        {openPrivateRooms.map((room) => (
          <ChatRoomContextProvider key={room.id}>
            <ChatPanel />
          </ChatRoomContextProvider>
        ))}
      </div>
    </div>
  );
};

export default Chat;
