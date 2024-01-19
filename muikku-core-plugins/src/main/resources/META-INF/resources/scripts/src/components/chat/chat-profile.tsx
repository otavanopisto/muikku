import * as React from "react";
import { ChatUser } from "~/generated/client";
import { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import { useChatContext } from "./context/chat-context";
import ChatUserSettingsDialog from "./dialogs/chat-user-settings-dialog";

/**
 * ChatMeProps
 */
interface ChatProfileProps {
  user: ChatUser;
}

/**
 * ChatProfile
 * @param props props
 */
function ChatProfile(props: ChatProfileProps) {
  const { user } = props;

  return (
    <div className="chat__profile-container">
      <ChatProfileAvatar
        id={user.id}
        nick={user.nick}
        hasImage={user.hasImage}
        status={user.isOnline ? "online" : "offline"}
      />
      <div className="chat__profile-name-container">
        <span className="chat__profile-name">{user.nick}</span>
        <span className="chat__profile-literal-status">
          {user.isOnline ? "Paikalla" : "Ei paikalla"}
        </span>
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
        <span className="chat__profile-name">{currentUser.nick}</span>
        <span className="chat__profile-literal-status">Paikalla</span>
      </div>

      <ChatUserSettingsDialog>
        <IconButton buttonModifiers={["chat-invert"]} icon="cog" />
      </ChatUserSettingsDialog>
    </div>
  );
}

export default ChatProfile;
