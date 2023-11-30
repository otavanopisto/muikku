// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import useChatWindow, { UseChatWindow } from "../hooks/useChatWindow";

/**
 * ChatPrivateContextType
 */
export interface ChatWindowContext extends UseChatWindow {}

const ChatWindowBreakpointsContext = createContext<
  ChatWindowContext | undefined
>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatWindowContextProviderProps {}

/**
 * ChatPrivateContextProvider
 * @param props props
 */
const ChatWindowContextProvider: React.FC<ChatWindowContextProviderProps> = (
  props
) => {
  const { children } = props;

  const chatWindowValues = useChatWindow();

  return (
    <ChatWindowBreakpointsContext.Provider value={chatWindowValues}>
      {children}
    </ChatWindowBreakpointsContext.Provider>
  );
};

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
