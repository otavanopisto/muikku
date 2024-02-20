import * as React from "react";
import { ChatActivity, ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import { IconButton } from "../general/button";
import ChatProfile from "./chat-profile";

/**
 * ChatMyCounselorsDiscussionsProps
 */
interface ChatMyCounselorsDiscussionsProps {
  onItemClick?: () => void;
}

/**
 * ChatMyCounselorsDiscussions
 * @param props props
 * @returns JSX.Element
 */
function ChatMyCounselorsDiscussions(props: ChatMyCounselorsDiscussionsProps) {
  const { onItemClick } = props;
  const {
    myDiscussionsCouncelors,
    currentUser,
    activeDiscussion,
    openDiscussion,
    chatActivityByUserObject,
  } = useChatContext();

  /**
   * handleOpenClick
   * @param targetIdentifier targetIdentifier
   */
  const handleOpenClick = (targetIdentifier: string) => {
    openDiscussion(targetIdentifier);
    onItemClick && onItemClick();
  };

  if (currentUser.type !== "STUDENT") {
    return null;
  }

  if (myDiscussionsCouncelors.length === 0) {
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

  return (
    <div className="chat__users chat__users--guidance-councelors" role="menu">
      <div className="chat__users-category-title">Ohjaajat</div>
      {myDiscussionsCouncelors.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          chatActivity={chatActivityByUserObject[user.id]}
          isActive={activeDiscussion?.identifier === user.identifier}
          onOpenClick={handleOpenClick}
        />
      ))}
    </div>
  );
}

/**
 * ChatMyDiscussionsProps
 */
interface ChatMyDiscussionsProps {
  onItemClick?: () => void;
}

/**
 * ChatMyActiveDiscussions
 * @param props props
 * @returns JSX.Element
 */
function ChatMyActiveDiscussions(props: ChatMyDiscussionsProps) {
  const { onItemClick } = props;

  const {
    closeDiscussionWithUser,
    openDiscussion,
    activeDiscussion,
    myDiscussionsOthers,
    chatActivityByUserObject,
  } = useChatContext();

  /**
   * handleOpenClick
   * @param targetIdentifier targetIdentifier
   */
  const handleOpenClick = (targetIdentifier: string) => {
    openDiscussion(targetIdentifier);
    onItemClick && onItemClick();
  };

  return (
    <>
      {myDiscussionsOthers.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          isActive={activeDiscussion?.identifier === user.identifier}
          chatActivity={chatActivityByUserObject[user.id]}
          onOpenClick={handleOpenClick}
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
  chatActivity?: ChatActivity;
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
  const { user, chatActivity, isActive, onRemoveClick, onOpenClick } = props;

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
      <ChatProfile user={user} chatActivity={chatActivity} />

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

export { ChatMyCounselorsDiscussions, ChatMyActiveDiscussions };
