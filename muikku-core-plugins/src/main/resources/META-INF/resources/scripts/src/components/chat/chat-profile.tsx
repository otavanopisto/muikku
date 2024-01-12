import * as React from "react";
import { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import { useChatContext } from "./context/chat-context";
import ChatUserSettingsDialog from "./dialogs/chat-user-settings-dialog";

/**
 * ChatMeProps
 */
interface ChatProfileProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

/**
 * ChatMe
 * @param props props
 */
function ChatProfile(props: ChatProfileProps) {
  const { currentUser } = useChatContext();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chat__profile-container">
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
        <IconButton buttonModifiers={["chat"]} icon="cog" />
      </ChatUserSettingsDialog>
    </div>
  );
}

export default ChatProfile;
