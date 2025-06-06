import * as React from "react";
import Avatar from "../general/avatar";
import { ChatUserTypeEnum } from "~/generated/client";

/**
 * ChatProfileAvatarProps
 */
interface ChatProfileAvatarProps {
  nick: string;
  hasImage: boolean;
  id: number;
  status?: "online" | "away" | "busy" | "offline";
  userType?: ChatUserTypeEnum;
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
    <div className="chat__profile-avatar-container">
      <Avatar modifier="chat" name={nick} hasImage={hasImage} id={id} />

      {statusColorModifier && (
        <div
          className={`chat__avatar-status chat__avatar-status--${statusColorModifier}`}
        />
      )}

      {props.userType && props.userType === "STAFF" ? (
        <div className="chat__staff-user-indicator">
          <span className="icon-star-full"></span>
        </div>
      ) : null}
    </div>
  );
}

export default ChatProfileAvatar;
