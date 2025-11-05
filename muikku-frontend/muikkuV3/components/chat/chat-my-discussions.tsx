import * as React from "react";
import { ChatActivity, ChatUser } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import { IconButton } from "../general/button";
import { ChatProfile } from "./chat-profile";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";

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

  const { t } = useTranslation("chat");

  /**
   * handleOpenClick
   * @param targetIdentifier targetIdentifier
   */
  const handleOpenClick = (targetIdentifier: string) => {
    openDiscussion(targetIdentifier);
    onItemClick && onItemClick();
  };

  if (currentUser.type !== "STUDENT" || myDiscussionsCouncelors.length === 0) {
    return null;
  }

  return (
    <div className="chat__users chat__users--guidance-councelors" role="menu">
      <div className="chat__users-category-title">{t("labels.councelors")}</div>
      {myDiscussionsCouncelors.map((user) => (
        <ChatMyActiveDiscussion
          key={user.id}
          user={user}
          currentUser={currentUser}
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
    currentUser,
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
          currentUser={currentUser}
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
  currentUser: ChatUser;
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
  const {
    user,
    currentUser,
    chatActivity,
    isActive,
    onRemoveClick,
    onOpenClick,
  } = props;

  const { t } = useTranslation("chat");

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
      <ChatProfile
        user={user}
        primaryInfo={user.nick}
        secondaryInfo={currentUser.type === "STAFF" && user.name}
        chatActivity={chatActivity}
      />

      {onRemoveClick && (
        <div className="chat__button-wrapper chat__button-wrapper--close-discussion">
          <Dropdown
            alignSelfVertically="top"
            openByHover
            content={<p>{t("actions.closeDiscussion", { ns: "chat" })}</p>}
          >
            <IconButton
              icon="cross"
              buttonModifiers={["chat"]}
              onClick={handleRemoveClick}
            />
          </Dropdown>
        </div>
      )}
    </div>
  );
}

export { ChatMyCounselorsDiscussions, ChatMyActiveDiscussions };
