import * as React from "react";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import { IconButton } from "../general/button";
import ChatProfile from "./chat-profile";
import { sortUsersAlphabetically } from "./chat-helpers";

/**
 * ChatUsersWithActiveDiscussion
 * @returns JSX.Element
 */
function ChatMyDiscussions() {
  return (
    <div className="chat__users-container">
      <div className="chat__users chat__users--guidance-councelors" role="menu">
        <ChatMyCounselorsDiscussions />
      </div>
      <div className="chat__users chat__users--others" role="menu">
        <div className="chat__users-category-title">Keskustelut</div>
        <ChatMyActiveDiscussions />
      </div>
    </div>
  );
}

/**
 * ChatMyCounselors
 * @returns JSX.Element
 */
function ChatMyCounselorsDiscussions() {
  const { counselorUsers, currentUser, activeDiscussion, openDiscussion } =
    useChatContext();

  if (currentUser.type !== "STUDENT") {
    return null;
  }

  if (counselorUsers.length === 0) {
    return (
      <>
        <div
          style={{
            margin: "5px",
          }}
        >
          ...
        </div>
      </>
    );
  }

  const sortedCounclors = counselorUsers.sort(sortUsersAlphabetically);

  return (
    <>
      <div className="chat__users-category-title">Ohjaajat</div>
      {sortedCounclors.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          isActive={activeDiscussion?.identifier === user.identifier}
          onOpenClick={openDiscussion}
        />
      ))}
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
    activeDiscussion,
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
          isActive={activeDiscussion?.identifier === user.identifier}
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
  isActive: boolean;
  onOpenClick?: (targetIdentifier: string) => void;
  onRemoveClick?: (user: ChatUser) => void;
}

/**
 * Active discussion item
 * @param props props
 * @returns JSX.Element
 */
function ChatMyActiveDiscussion(props: ChatMyDiscussionProps) {
  const { user, isActive, onRemoveClick, onOpenClick } = props;

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

  const className = isActive ? "chat__user chat__active-item" : "chat__user";

  return (
    <div className={className} role="menuitem" onClick={handleOpenClick}>
      <ChatProfile user={user} />

      {onRemoveClick && (
        <div className="chat__button-wrapper chat__button-wrapper--close-discussion">
          <IconButton
            icon="cross"
            buttonModifiers={["chat"]}
            onClick={handleRemoveClick}
          />
        </div>
      )}
    </div>
  );
}

export { ChatMyDiscussions };
