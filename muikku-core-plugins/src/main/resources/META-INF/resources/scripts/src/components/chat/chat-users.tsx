import * as React from "react";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import ChatProfileAvatar from "./chat-profile-avatar";

/**
 * PeopleListProps
 */
interface ChatUsersListProps {
  minimized: boolean;
}

/**
 * PeopleList
 * @param props props
 * @returns JSX.Element
 */
function ChatUsersList(props: ChatUsersListProps) {
  const { minimized } = props;

  const { usersWithoutMe, loadingPeople } = useChatContext();

  if (loadingPeople) {
    return <div>Loading...</div>;
  }

  if (usersWithoutMe.length === 0) {
    return <div>No people found</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {usersWithoutMe.map((user) => (
        <ChatUser key={user.id} user={user} minimized={minimized} />
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
 * ChatUserItemProps
 */
interface ChatUserProps {
  user: ChatUser;
  minimized: boolean;
}

/**
 * ChatUserItem
 * @param props props
 * @returns JSX.Element
 */
function ChatUser(props: ChatUserProps) {
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
          status="online"
        />
      </div>
      <div
        className="user-item__name"
        style={{
          marginLeft: "10px",
        }}
      >
        <span>{user.nick}</span>
      </div>
    </div>
  );
}

export { ChatUsersList, ChatUser };
