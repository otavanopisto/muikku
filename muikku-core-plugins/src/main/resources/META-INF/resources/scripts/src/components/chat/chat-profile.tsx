import * as React from "react";
import { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import { useChatContext } from "./context/chat-context";

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
  const { userMe, openChatProfileSettings } = useChatContext();

  if (!userMe) {
    return null;
  }

  return (
    <div className="chat-window__profile-container">
      <ChatProfileAvatar
        id={userMe.id}
        nick={userMe.nick}
        hasImage={userMe.hasImage}
        status="online"
      />
      <div className="chat-window__profile-name-container">
        <span className="chat-window__profile-name">{userMe.nick}</span>
        <span className="chat-window__profile-literal-status">Paikalla</span>
      </div>

      <IconButton
        buttonModifiers={["chat"]}
        icon="cog"
        onClick={openChatProfileSettings}
      />
    </div>
  );
}

export default ChatProfile;
