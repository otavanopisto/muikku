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
      <ChatMyCounselorsDiscussions />
      <ChatMyActiveDiscussions />
    </div>
  );
}

/**
 * ChatMyCounselors
 * @returns JSX.Element
 */
function ChatMyCounselorsDiscussions() {
  const { counselorUsers, currentUser } = useChatContext();

  if (currentUser.type !== "STUDENT") {
    return null;
  }

  if (counselorUsers.length === 0) {
    return (
      <>
        <div
          style={{
            margin: "10px",
          }}
        >
          You dont have student counserlors set yet or they havent activated
          their chat
        </div>
        <hr
          style={{
            margin: "5px",
          }}
        />
      </>
    );
  }

  return (
    <>
      {counselorUsers.map((user) => (
        <ChatMyActiveDiscussion key={user.id} user={user} />
      ))}
      <hr
        style={{
          margin: "5px",
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
  const {
    usersWithActiveDiscussion,
    chatActivity,
    closeDiscussionWithUser,
    openDiscussion,
  } = useChatContext();

  // Sort discussion by last message activity
  const sortedDiscussions = React.useMemo(
    () =>
      usersWithActiveDiscussion.sort((a, b) => {
        const aActivity = chatActivity.find(
          (activity) => activity.targetIdentifier === a.identifier
        );

        const bActivity = chatActivity.find(
          (activity) => activity.targetIdentifier === b.identifier
        );

        const aLastMessage = aActivity.latestMessage;
        const bLastMessage = bActivity.latestMessage;

        if (!aLastMessage) {
          return 1;
        }

        if (!bLastMessage) {
          return -1;
        }

        return bLastMessage.getTime() - aLastMessage.getTime();
      }),
    [usersWithActiveDiscussion, chatActivity]
  );

  return (
    <>
      {sortedDiscussions.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          onOpenClick={openDiscussion}
          onRemoveClick={closeDiscussionWithUser}
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
  onOpenClick?: (targetIdentifier: string) => void;
  onRemoveClick?: (user: ChatUser) => void;
}

/**
 * Active discussion item
 * @param props props
 * @returns JSX.Element
 */
function ChatMyActiveDiscussion(props: ChatMyDiscussionProps) {
  const { user, onRemoveClick, onOpenClick } = props;

  /**
   * Handles open click
   */
  const handleOpenClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      if (onOpenClick) {
        onOpenClick(user.identifier);
      }
    },
    [onOpenClick, user]
  );

  /**
   * Handles remove click
   */
  const handleRemoveClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      if (onRemoveClick) {
        onRemoveClick(user);
      }
    },
    [onRemoveClick, user]
  );

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
      onClick={handleOpenClick}
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
          color: "black",
        }}
      >
        <span>{user.nick}</span>
        {onRemoveClick && (
          <div className="chat__button-wrapper">
            <IconButton
              icon="cross"
              buttonModifiers={["chat"]}
              onClick={handleRemoveClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { ChatMyDiscussions };
