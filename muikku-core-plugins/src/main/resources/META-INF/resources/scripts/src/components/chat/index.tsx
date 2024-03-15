import * as React from "react";
import "~/sass/elements/chat.scss";
import ChatContextProvider, { useChatContext } from "./context/chat-context";
import ChatWindow from "./chat-window";
import ChatMain from "./chat-main";
import ChatMainMobile from "./chat-main-mobile";
import { ChatWindowContextProvider } from "./context/chat-window-context";
import useChatSettings from "./hooks/useChatSettings";
import ChatUnblockDiscussionDialog from "./dialogs/chat-unblock-discussion-dialog";
import ChatCloseAndBlockDiscussionDialog from "./dialogs/chat-close-and-block-discussion-dialog";
import ChatDeleteRoomDialog from "./dialogs/chat-room-delete-dialog";
import ChatUnreadMsgCounter from "./chat-unread-msg-counter";
import { ChatUserInfoProvider } from "./context/chat-user-info-context";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { ChatPermissions } from "./chat-helpers";

/**
 * ChatProps
 */
interface ChatProps {
  chatPermissions: ChatPermissions;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Chat component. Renders or not depending on chat settings
 * @param props props
 * @returns JSX.Element
 */
const Chat = (props: ChatProps) => {
  const { currentUser, chatEnabled } = useChatSettings(
    props.displayNotification
  );

  if (!chatEnabled || !currentUser) {
    return null;
  }

  return (
    <ChatContextProvider {...props} currentUser={currentUser}>
      <ChatUserInfoProvider>
        <ChatContent />
      </ChatUserInfoProvider>
    </ChatContextProvider>
  );
};

/**
 * Actual chat content. Renders chat bubble and chat window
 * @returns JSX.Element
 */
const ChatContent = () => {
  const {
    minimized,
    toggleControlBox,
    isMobileWidth,
    discussionInstances,
    unreadMsgCount,
  } = useChatContext();

  // Use effect to destroy all messages instances when component unmounts
  React.useEffect(
    () => () => {
      discussionInstances.map((instance) => {
        instance.destroy();
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Render chat mobile or desktop version
  const mobileOrDesktop = React.useMemo(() => {
    if (minimized) {
      return null;
    }
    if (isMobileWidth) {
      return <ChatMainMobile />;
    }
    return (
      <ChatWindow>
        <ChatMain />
      </ChatWindow>
    );
  }, [isMobileWidth, minimized]);

  return (
    <ChatWindowContextProvider>
      {/* Chat bubble */}
      {minimized && (
        <div onClick={toggleControlBox} className="chat-bubble">
          <span className="icon-chat"></span>
          <ChatUnreadMsgCounter number={unreadMsgCount} />
        </div>
      )}

      {mobileOrDesktop}
      <ChatUnblockDiscussionDialog />
      <ChatCloseAndBlockDiscussionDialog />
      <ChatDeleteRoomDialog />
    </ChatWindowContextProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    chatPermissions: {
      canManagePublicRooms: state.status.permissions.CHAT_MANAGE_PUBLIC_ROOMS,
    } as ChatPermissions,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
