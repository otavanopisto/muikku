import * as React from "react";
import { ChatUser } from "~/generated/client";
import Avatar from "../general/avatar";
import { IconButton } from "../general/button";
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
        <ChatProfileAvatar userMe={userMe} status="online" />
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

      <IconButton icon="cog" />
    </div>
  );
}

/**
 * ChatProfileAvatarProps
 */
interface ChatProfileAvatarProps {
  userMe: ChatUser;
  status?: "online" | "away" | "busy" | "offline";
}

/**
 * ChatProfileAvatar
 * @param props props
 */
function ChatProfileAvatar(props: ChatProfileAvatarProps) {
  const { userMe } = props;

  const statusColor = React.useMemo(() => {
    switch (props.status) {
      case "online":
        return "green";
      case "away":
        return "yellow";
      case "busy":
        return "red";
      case "offline":
        return "gray";
      default:
        return null;
    }
  }, [props.status]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Avatar
        firstName={userMe.nick}
        hasImage={userMe.hasImage}
        id={userMe.id}
      />

      {statusColor && (
        <div
          className="status-indicator"
          style={{
            width: "15px",
            height: "15px",
            borderRadius: "50%",
            background: statusColor,
            border: "1px solid white",
            position: "absolute",
            zIndex: 1,
            bottom: "-3px",
            right: "5px",
          }}
        />
      )}
    </div>
  );
}

export default ChatProfile;
