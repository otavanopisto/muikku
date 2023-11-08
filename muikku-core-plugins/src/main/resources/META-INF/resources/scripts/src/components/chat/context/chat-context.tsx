// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import useChat, { UseChat } from "../hooks/useChat";

/**
 * ChatPrivateContextType
 */
export interface ChatPrivateContextType extends UseChat {}

const ChatContext = createContext<ChatPrivateContextType | undefined>(
  undefined
);

/**
 * ChatPrivateContextProvider
 * @param props props
 */
export const ChatContextProvider: React.FC = (props) => {
  const { children } = props;

  const useChatValue = useChat();

  return (
    <ChatContext.Provider value={useChatValue}>{children}</ChatContext.Provider>
  );
};

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatContext() {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}

export { ChatContext, useChatContext };
