// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import useChatWindow, { UseChatWindow } from "../hooks/useChatWindow";

/**
 * ChatWindowContext
 */
export interface ChatWindowContext extends UseChatWindow {}

const ChatWindowBreakpointsContext = createContext<
  ChatWindowContext | undefined
>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatWindowContextProviderProps {
  children: React.ReactNode;
}

/**
 * ChatPrivateContextProvider
 * @param props props
 */
function ChatWindowContextProvider(props: ChatWindowContextProviderProps) {
  const { children } = props;

  const chatWindowValues = useChatWindow();

  return (
    <ChatWindowBreakpointsContext.Provider value={chatWindowValues}>
      {children}
    </ChatWindowBreakpointsContext.Provider>
  );
}

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatWindowContext() {
  const context = React.useContext(ChatWindowBreakpointsContext);
  if (context === undefined) {
    throw new Error(
      "useChatWindowContext must be used within a ChatWindowContextProvider"
    );
  }
  return context;
}

export { ChatWindowContextProvider, useChatWindowContext };
