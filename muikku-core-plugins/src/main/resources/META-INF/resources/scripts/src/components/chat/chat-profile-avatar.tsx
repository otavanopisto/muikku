import * as React from "react";
import Avatar from "../general/avatar";

/**
 * ChatProfileAvatarProps
 */
interface ChatProfileAvatarProps {
  nick: string;
  hasImage: boolean;
  id: number;
  status?: "online" | "away" | "busy" | "offline";
}

/**
 * ChatProfileAvatar
 * @param props props
 */
function ChatProfileAvatar(props: ChatProfileAvatarProps) {
  const { nick, hasImage, id } = props;

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
      <Avatar firstName={nick} hasImage={hasImage} id={id} />

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

export default ChatProfileAvatar;
