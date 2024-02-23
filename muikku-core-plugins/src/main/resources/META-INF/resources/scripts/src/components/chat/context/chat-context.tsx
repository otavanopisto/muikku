// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import { ChatUser } from "~/generated/client";
import useChat, { UseChat } from "../hooks/useChat";

/**
 * ChatPrivateContextType
 */
export interface ChatContextValue extends UseChat {}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatContextProviderProps {
  currentUser: ChatUser;
}

/**
 * Chat context provider
 * @param props props
 */
const ChatContextProvider: React.FC<ChatContextProviderProps> = (props) => {
  const { children, currentUser } = props;

  const useChatValue = useChat(currentUser);

  return (
    <ChatContext.Provider value={useChatValue}>{children}</ChatContext.Provider>
  );
};

/**
 * Method to returns context of chat.
 * Check if context is defined and if not, throw an error
 */
function useChatContext() {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}

export { ChatContextProvider, useChatContext };
