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
 * @returns React.JSX.Element
 */
function ChatDiscussion(props: ChatDiscussionProps) {
  const { activeDiscussion, discussionInstances } = useChatContext();

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
        targetRoom={activeDiscussion}
        discussionInstance={activeDiscussionInstance}
      />
    ) : (
      <ChatPrivatePanel
        key={activeDiscussion.identifier}
        targetUser={activeDiscussion}
        discussionInstance={activeDiscussionInstance}
      />
    );
  }, [activeDiscussion, activeDiscussionInstance]);

  return activeDiscussionPanel;
}

export default ChatDiscussion;
