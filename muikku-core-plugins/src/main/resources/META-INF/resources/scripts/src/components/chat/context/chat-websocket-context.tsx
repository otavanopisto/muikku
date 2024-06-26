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
  children: React.ReactNode;
  /**
   * Websocket instance, if not logged in, it will be null
   */
  websocket: Websocket | null;
}

/**
 * Chat websocket context provider
 * @param props props
 */
function ChatWebsocketContextProvider(
  props: ChatWebsocketContextProviderProps
) {
  const { children, websocket } = props;

  if (!websocket) {
    return null;
  }

  return (
    <ChatWebsocketContext.Provider value={websocket}>
      {children}
    </ChatWebsocketContext.Provider>
  );
}

/**
 * Method to returns context of websocket.
 * Check if context is defined and if not, throw an error
 */
function useChatWebsocketContext() {
  const context = React.useContext(ChatWebsocketContext);
  if (context === undefined) {
    throw new Error(
      "useChatWebsocketContext must be used within a ChatWebsocketContextProvider"
    );
  }
  return context;
}

export { ChatWebsocketContextProvider, useChatWebsocketContext };
