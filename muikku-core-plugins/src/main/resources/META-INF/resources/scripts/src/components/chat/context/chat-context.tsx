// Create chat context to control whether showing chat bubble or chat control box
// State manageses opened private chat list and opened room chat list
import * as React from "react";
import { createContext } from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { ChatUser } from "~/generated/client";
import { StateType } from "~/reducers";
import useChat, { UseChat } from "../hooks/useChat";

/**
 * ChatPrivateContextType
 */
export interface ChatContextValue extends UseChat {
  canManagePublicRooms: boolean;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

/**
 * ChatContextProviderProps
 */
interface ChatContextProviderProps {
  children: React.ReactNode;
  currentUser: ChatUser;
  canManagePublicRooms: boolean;
}

/**
 * Chat context provider
 * @param props props
 */
function ChatContextProvider(props: ChatContextProviderProps) {
  const { children, currentUser, canManagePublicRooms } = props;

  const useChatValue = useChat(currentUser);

  return (
    <ChatContext.Provider value={{ ...useChatValue, canManagePublicRooms }}>
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    canManagePublicRooms: state.status.permissions.CHAT_MANAGE_PUBLIC_ROOMS,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContextProvider);
