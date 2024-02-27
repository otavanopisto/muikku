import * as React from "react";
import { ChatActivity, ChatUser } from "~/generated/client";
import { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import { ChatUnreadMsgCounter } from "./chat-unread-msg-counter";
import { useChatContext } from "./context/chat-context";
import ChatUserSettingsDialog from "./dialogs/chat-user-settings-dialog";

/**
 * ChatMeProps
 */
interface ChatProfileProps {
  user: ChatUser;
  primaryInfo: string;
  secondaryInfo?: string;
  chatActivity?: ChatActivity;
}

/**
 * ChatProfile
 * @param props props
 */
function ChatProfile(props: ChatProfileProps) {
  const { user, primaryInfo, secondaryInfo, chatActivity } = props;

  return (
    <div className="chat__profile-container">
      <ChatProfileAvatar
        id={user.id}
        nick={user.nick}
        hasImage={user.hasImage}
        status={user.presence === "ONLINE" ? "online" : "offline"}
      />
      {chatActivity && (
        <ChatUnreadMsgCounter number={chatActivity.unreadMessages} />
      )}
      <div className="chat__profile-name-container">
        <div className="chat__profile-name">{primaryInfo}</div>
        {secondaryInfo && (
          <div className="chat__profile-literal-status">{secondaryInfo}</div>
        )}
      </div>
    </div>
  );
}

/**
 * ChatProfileWithSettingsProps
 */
interface ChatProfileWithSettingsProps {}

/**
 * ChatMyProfileWithSettings
 * @param props props
 */
export function ChatMyProfileWithSettings(props: ChatProfileWithSettingsProps) {
  const { currentUser } = useChatContext();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chat__profile-container chat__profile-container--my-profile">
      <ChatProfileAvatar
        id={currentUser.id}
        nick={currentUser.nick}
        hasImage={currentUser.hasImage}
        status="online"
      />
      <div className="chat__profile-name-container">
        <div className="chat__profile-name">{currentUser.nick}</div>
        <div className="chat__profile-literal-status">Paikalla</div>
      </div>

      <ChatUserSettingsDialog>
        <div className="chat__button-wrapper">
          <IconButton buttonModifiers={["chat"]} icon="cog" />
        </div>
      </ChatUserSettingsDialog>
    </div>
  );
}

export default ChatProfile;
