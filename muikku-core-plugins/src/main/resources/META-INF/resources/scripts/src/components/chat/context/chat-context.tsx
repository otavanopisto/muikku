// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import { ChatUser } from "~/generated/client";
import useChat, { UseChat } from "../hooks/useChat";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { ChatPermissions } from "../chat-helpers";

/**
 * ChatPrivateContextType
 */
export interface ChatContextValue extends UseChat {
  chatPermissions: ChatPermissions;
  displayNotification: DisplayNotificationTriggerType;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatContextProviderProps {
  children: React.ReactNode;
  currentUser: ChatUser;
  chatPermissions: ChatPermissions;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Chat context provider
 * @param props props
 */
function ChatContextProvider(props: ChatContextProviderProps) {
  const { children, currentUser, chatPermissions, displayNotification } = props;

  const useChatValue = useChat(currentUser, displayNotification);

  return (
    <ChatContext.Provider
      value={{ ...useChatValue, chatPermissions, displayNotification }}
    >
      {children}
    </ChatContext.Provider>
  );
}

/**
 * Method to returns context of chat.
 * Check if context is defined and if not, throw an error
 */
export function useChatContext() {
  const context = React.useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatContextProvider");
  }
  return context;
}

export default ChatContextProvider;
