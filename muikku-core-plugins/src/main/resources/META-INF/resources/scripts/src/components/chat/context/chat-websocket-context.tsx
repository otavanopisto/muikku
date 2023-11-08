// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import Websocket from "~/util/websocket";

const ChatWebsocketContext = createContext<Websocket | undefined>(undefined);

/**
 * ChatWebsocketContextProviderProps
 */
interface ChatWebsocketContextProviderProps {
  websocket: Websocket;
}

/**
 * ChatPrivateContextProvider
 * @param props props
 */
export const ChatWebsocketContextProvider: React.FC<
  ChatWebsocketContextProviderProps
> = (props) => {
  const { children, websocket } = props;

  return (
    <ChatWebsocketContext.Provider value={websocket}>
      {children}
    </ChatWebsocketContext.Provider>
  );
};

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatWebsocketContext() {
  const context = React.useContext(ChatWebsocketContext);
  if (context === undefined) {
    throw new Error(
      "useChatContext must be used within a ChatWebsocketContextProvider"
    );
  }
  return context;
}

export { ChatWebsocketContext, useChatWebsocketContext };
