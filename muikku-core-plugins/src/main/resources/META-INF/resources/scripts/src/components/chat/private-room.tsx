import * as React from "react";
import ChatPanel from "./chat-panel";
import { ChatRoomContextProvider } from "./context/chat-room-context";
import useRoom from "./hooks/useRoom";

const ChatPrivateRoom = () => {
  const { chatMsgs } = useRoom();

  return (
    <ChatRoomContextProvider>
      <ChatPanel />
    </ChatRoomContextProvider>
  );
};
