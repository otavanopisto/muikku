import * as React from "react";
import { createContext, useState } from "react";

const ChatPrivateRoomContext = createContext<any | undefined>(undefined);

/**
 * ChatPrivateRoomContextProvider
 * @param props props
 * @returns JSX.Element
 */
const ChatRoomContextProvider: React.FC = (props) => {
  const { children } = props;

  return (
    <ChatPrivateRoomContext.Provider value={undefined}>
      {children}
    </ChatPrivateRoomContext.Provider>
  );
};

/**
 * useChatPrivateRoomContext
 */
function useChatPrivateRoomContext() {
  const context = React.useContext(ChatPrivateRoomContext);
  if (context === undefined) {
    throw new Error(
      "useChatContext must be used within a ChatPrivateRoomContextProvider"
    );
  }
  return context;
}

export { ChatRoomContextProvider, useChatPrivateRoomContext };
