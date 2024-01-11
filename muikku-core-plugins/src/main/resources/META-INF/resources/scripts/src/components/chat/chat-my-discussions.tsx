import * as React from "react";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import ChatProfileAvatar from "./chat-profile-avatar";
import { IconButton } from "../general/button";

/**
 * ChatUsersWithActiveDiscussionProps
 */
interface ChatMyDiscussionsProps {
  minimized: boolean;
}

/**
 * ChatUsersWithActiveDiscussion
 * @param props props
 * @returns JSX.Element
 */
function ChatMyDiscussions(props: ChatMyDiscussionsProps) {
  const { minimized } = props;

  const { usersWithActiveDiscussion, loadingUsersWithActiveDiscussion } =
    useChatContext();

  if (loadingUsersWithActiveDiscussion) {
    return <div>Loading...</div>;
  }

  if (usersWithActiveDiscussion.length === 0) {
    return <div>No active discussions</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {usersWithActiveDiscussion.map((user) => (
        <ChatMyDiscussion key={user.id} user={user} minimized={minimized} />
      ))}
    </div>
  );
}

/* const variants = {
  visible: { opacity: 1, x: 0, width: "auto", marginLeft: "10px" },
  minimized: { opacity: 0, x: "-100%", width: "0px", marginLeft: "0px" },
};
 */
/**
 * ChatMyDiscussionProps
 */
interface ChatMyDiscussionProps {
  user: ChatUser;
  minimized: boolean;
}

/**
 * MyDiscussion
 * @param props props
 * @returns JSX.Element
 */
function ChatMyDiscussion(props: ChatMyDiscussionProps) {
  const { user } = props;

  const { openDiscussion } = useChatContext();

  const handlePeopleClick = React.useCallback(() => {
    openDiscussion(user.identifier);
  }, [openDiscussion, user.identifier]);

  return (
    <div
      className="user-item"
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "50px 0 0 50px",
        color: "white",
        margin: "10px",
        marginBottom: "0",
        overflowX: "clip",
      }}
      onClick={handlePeopleClick}
    >
      <div className="user-item__avatar">
        <ChatProfileAvatar
          id={user.id}
          hasImage={user.hasImage}
          nick={user.nick}
          status={user.isOnline ? "online" : "offline"}
        />
      </div>
      <div
        className="user-item__name"
        style={{
          marginLeft: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <span>{user.nick}</span>
        <div className="chat__button-wrapper">
          <IconButton icon="cross" buttonModifiers={["chat"]} />
        </div>
      </div>
    </div>
  );
}

export { ChatMyDiscussions, ChatMyDiscussion };
