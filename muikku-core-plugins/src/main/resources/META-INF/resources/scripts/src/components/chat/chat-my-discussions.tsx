import * as React from "react";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import ChatProfileAvatar from "./chat-profile-avatar";
import { IconButton } from "../general/button";

/**
 * ChatUsersWithActiveDiscussion
 * @returns JSX.Element
 */
function ChatMyDiscussions() {
  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatMyCounselors />
      <ChatMyActiveDiscussions />
    </div>
  );
}

/**
 * ChatMyCounselors
 * @returns JSX.Element
 */
function ChatMyCounselors() {
  const { counselorUsers, currentUser } = useChatContext();

  if (currentUser.type !== "STUDENT") {
    return null;
  }

  if (counselorUsers.length === 0) {
    return <div>You dont have student counserlors set yet</div>;
  }

  return (
    <>
      {counselorUsers.map((user) => (
        <ChatMyActiveDiscussion key={user.id} user={user} />
      ))}
      <hr
        style={{
          margin: "10px",
        }}
      />
    </>
  );
}

/**
 * ChatMyDiscussionsProps
 */
interface ChatMyDiscussionsProps {}

/**
 * ChatMyActiveDiscussions
 * @param props props
 * @returns JSX.Element
 */
function ChatMyActiveDiscussions(props: ChatMyDiscussionsProps) {
  const { usersWithActiveDiscussion, removeUserFromActiveDiscussionsList } =
    useChatContext();

  return (
    <>
      {usersWithActiveDiscussion.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          onDeleteClick={removeUserFromActiveDiscussionsList}
        />
      ))}
    </>
  );
}

/**
 * ChatMyDiscussionProps
 */
interface ChatMyDiscussionProps {
  user: ChatUser;
  onDeleteClick?: (user: ChatUser) => void;
}

/**
 * MyDiscussion
 * @param props props
 * @returns JSX.Element
 */
function ChatMyActiveDiscussion(props: ChatMyDiscussionProps) {
  const { user, onDeleteClick } = props;

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
        {onDeleteClick && (
          <div className="chat__button-wrapper">
            <IconButton icon="cross" buttonModifiers={["chat"]} />
          </div>
        )}
      </div>
    </div>
  );
}

export { ChatMyDiscussions };
