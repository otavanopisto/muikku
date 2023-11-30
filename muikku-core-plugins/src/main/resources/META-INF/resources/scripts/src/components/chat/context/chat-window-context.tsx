// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import useWindowBreakpoints, {
  UseWindowBreakpoints,
} from "../hooks/use-window-breakpoints";

/**
 * ChatPrivateContextType
 */
export interface ChatWindowContext extends UseWindowBreakpoints {}

const ChatWindowContext = createContext<ChatWindowContext | undefined>(
  undefined
);

/**
 * ChatContextProviderProps
 */
interface ChatContextProviderProps {
  windowRef: React.RefObject<HTMLDivElement>;
}

/**
 * ChatPrivateContextProvider
 * @param props props
 */
const ChatWindowContextProvider: React.FC<ChatContextProviderProps> = (
  props
) => {
  const { children, windowRef } = props;

  const windowBreakPoints = useWindowBreakpoints({
    windowRef,
  });

  return (
    <ChatWindowContext.Provider value={windowBreakPoints}>
      {children}
    </ChatWindowContext.Provider>
  );
};

/**
 * Method to returns context of follow up.
 * Check if context is defined and if not, throw an error
 */
function useChatWindowContext() {
  const context = React.useContext(ChatWindowContext);
  if (context === undefined) {
    throw new Error(
      "useChatContext must be used within a ChatWindowContextProvider"
    );
  }
  return context;
}

export { ChatWindowContextProvider, useChatWindowContext };
