import * as React from "react";
import { ChatUser } from "~/generated/client";
import Avatar from "../general/avatar";
import { useChatContext } from "./context/chat-context";
import { AnimatePresence, motion } from "framer-motion";

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

const variants = {
  visible: { opacity: 1, x: 0, width: "auto", marginLeft: "10px" },
  minimized: { opacity: 0, x: "-100%", width: "0px", marginLeft: "0px" },
};

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
  const { user, minimized } = props;

  const { openDiscussion } = useChatContext();

  const handlePeopleClick = React.useCallback(() => {
    openDiscussion(user.identifier);
  }, [openDiscussion, user.identifier]);

  return (
    <div
      className="people-item"
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "50px 0 0 50px",
        color: "white",
        marginBottom: "10px",
        padding: "10px",
      }}
      onClick={handlePeopleClick}
    >
      <div className="people-item__avatar">
        <Avatar
          id={user.id}
          hasImage={user.hasImage}
          firstName={user.nick[0]}
        />
      </div>
      <AnimatePresence initial={false}>
        <motion.div
          className="people-item__name"
          variants={variants}
          animate={!minimized ? "visible" : "minimized"}
          transition={{
            duration: 0.3,
          }}
        >
          {user.nick} ONLINE
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { ChatUsersList, ChatUser };
