import * as React from "react";
import { UseChatViewsType } from "./hooks/useChatTabs";

/**
 * WizardProviderProps
 */
interface ChatViewsProviderProps {
  children: React.ReactNode;
  value: UseChatViewsType;
}

const ChatViewsContext = React.createContext<UseChatViewsType | undefined>(
  undefined
);

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function ChatViewsProvider(props: ChatViewsProviderProps) {
  const { children, value } = props;

  return (
    <ChatViewsContext.Provider value={value}>
      {children}
    </ChatViewsContext.Provider>
  );
}

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatViewsContext() {
  const context = React.useContext(ChatViewsContext);
  if (context === undefined) {
    throw new Error(
      "useChatViewsContext must be used within a ChatViewsProvider"
    );
  }
  return context;
}

export { useChatViewsContext, ChatViewsProvider };
