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
    <div {...props}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ChatProfileAvatar
          id={userMe.id}
          nick={userMe.nick}
          hasImage={userMe.hasImage}
          status="online"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          <div>{userMe.nick}</div>
          <div>Paikalla</div>
        </div>
      </div>

      <IconButton icon="cog" onClick={openChatProfileSettings} />
    </div>
  );
}

export default ChatProfile;
