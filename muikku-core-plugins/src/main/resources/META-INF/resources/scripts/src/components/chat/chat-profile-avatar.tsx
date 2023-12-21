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

  const statusColorModifier = React.useMemo(() => {
    switch (props.status) {
      case "online":
        return "online";
      case "away":
        return "away";
      case "busy":
        return "dnd";
      case "offline":
        return "offline";
      default:
        return null;
    }
  }, [props.status]);

  return (
    <div className="chat-window__avatar-container">
      <Avatar modifier="chat" firstName={nick} hasImage={hasImage} id={id} />

      {statusColorModifier && (
        <div
          className={`chat-window__avatar-status chat-window__avatar-status--${statusColorModifier}`}
        />
      )}
    </div>
  );
}

export default ChatProfileAvatar;
