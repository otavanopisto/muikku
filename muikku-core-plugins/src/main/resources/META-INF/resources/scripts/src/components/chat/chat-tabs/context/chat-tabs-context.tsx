import * as React from "react";
import { UseChatTabsType } from "./hooks/useChatTabs";

/**
 * WizardProviderProps
 */
interface ChatTabsProviderProps {
  children: React.ReactNode;
  value: UseChatTabsType;
}

const ChatTabsContext = React.createContext<UseChatTabsType | undefined>(
  undefined
);

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 * @param props props
 */
function ChatTabsProvider(props: ChatTabsProviderProps) {
  const { children, value } = props;

  return (
    <ChatTabsContext.Provider value={value}>
      {children}
    </ChatTabsContext.Provider>
  );
}

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatTabsContext() {
  const context = React.useContext(ChatTabsContext);
  if (context === undefined) {
    throw new Error(
      "useChatTabsContext must be used within a ChatTabsProvider"
    );
  }
  return context;
}

export { useChatTabsContext, ChatTabsProvider };
