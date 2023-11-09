// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import useChat, { UseChat } from "../hooks/useChat";

/**
 * ChatPrivateContextType
 */
export interface ChatPrivateContextType extends UseChat {}

const ChatContext = createContext<ChatPrivateContextType | undefined>(
  undefined
);

/**
 * ChatContextProviderProps
 */
interface ChatContextProviderProps {
  userId: number;
}

/**
 * ChatPrivateContextProvider
 * @param props props
 */
const ChatContextProvider: React.FC<ChatContextProviderProps> = (props) => {
  const { children, userId } = props;

  const useChatValue = useChat(userId);

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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    userId: state.status.userId,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContextProvider);

export { ChatContextProvider, useChatContext };
