import * as React from "react";
import { ChatPrivatePanel, ChatRoomPanel } from "./chat-panel";
import { useChatContext } from "./context/chat-context";
import { isChatRoom } from "./chat-helpers";

/**
 * ChatDiscussionProps
 */
interface ChatDiscussionProps {}

/**
 * ChatDiscussion
 * @param props props
 * @returns JSX.Element
 */
function ChatDiscussion(props: ChatDiscussionProps) {
  const { activeDiscussion, userId, discussionInstances } = useChatContext();

  const activeDiscussionInstance = React.useMemo(() => {
    if (!activeDiscussion) {
      return null;
    }

    return discussionInstances.find(
      (instance) => instance.targetIdentifier === activeDiscussion.identifier
    );
  }, [activeDiscussion, discussionInstances]);

  const activeDiscussionPanel = React.useMemo(() => {
    if (!activeDiscussion || !activeDiscussionInstance) {
      return null;
    }

    return isChatRoom(activeDiscussion) ? (
      <ChatRoomPanel
        key={activeDiscussion.identifier}
        title={activeDiscussion.name}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
        targetRoom={activeDiscussion}
        discussionInstance={activeDiscussionInstance}
      />
    ) : (
      <ChatPrivatePanel
        key={activeDiscussion.identifier}
        title={activeDiscussion.nick}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
        targetUser={activeDiscussion}
        discussionInstance={activeDiscussionInstance}
      />
    );
  }, [activeDiscussion, activeDiscussionInstance, userId]);

  return activeDiscussionPanel;
}

export default ChatDiscussion;
