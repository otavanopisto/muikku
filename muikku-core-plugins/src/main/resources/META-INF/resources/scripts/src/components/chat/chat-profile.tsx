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
  const { userMe } = useChatContext();

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
          <span>{userMe.nick}</span>
          <span>Paikalla</span>
        </div>
      </div>

      <ChatUserSettingsDialog>
        <IconButton icon="cog" />
      </ChatUserSettingsDialog>
    </div>
  );
}

export default ChatProfile;
