// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import useWindowBreakpoints, {
  UseWindowBreakpoints,
} from "../hooks/useWindowBreakpoints";

/**
 * ChatWindowBreakpointsContext
 */
export interface ChatWindowBreakpointsContext extends UseWindowBreakpoints {}

const ChatWindowBreakpointsContext = createContext<
  ChatWindowBreakpointsContext | undefined
>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatWindowBreakpointsContextProviderProps {
  children: React.ReactNode;
  windowRef: React.RefObject<HTMLDivElement>;
}

/**
 * Chat window breakpoints context provider
 * @param props props
 */
function ChatWindowBreakpointsContextProvider(
  props: ChatWindowBreakpointsContextProviderProps
) {
  const { children, windowRef } = props;

  const windowBreakPoints = useWindowBreakpoints({
    windowRef,
  });

  return (
    <ChatWindowBreakpointsContext.Provider value={windowBreakPoints}>
      {children}
    </ChatWindowBreakpointsContext.Provider>
  );
}

/**
 * Method to returns context of window breakpoint context.
 * Check if context is defined and if not, throw an error
 */
function useChatWindowBreakpointsContext() {
  const context = React.useContext(ChatWindowBreakpointsContext);
  if (context === undefined) {
    throw new Error(
      "useChatWindowBreakpointsContext must be used within a ChatWindowBreakpointsContextProvider"
    );
  }
  return context;
}

export {
  ChatWindowBreakpointsContextProvider,
  useChatWindowBreakpointsContext,
};
