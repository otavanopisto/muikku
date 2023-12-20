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
  const { activeDiscussion, userId, messagesInstances } = useChatContext();

  const activeMessageInstance = React.useMemo(() => {
    if (!activeDiscussion) {
      return null;
    }

    return messagesInstances.find(
      (instance) => instance.targetIdentifier === activeDiscussion.identifier
    );
  }, [activeDiscussion, messagesInstances]);

  const activeDiscussionPanel = React.useMemo(() => {
    if (!activeDiscussion || !activeMessageInstance) {
      return null;
    }

    return isChatRoom(activeDiscussion) ? (
      <ChatRoomPanel
        title={activeDiscussion.name}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
        targetRoom={activeDiscussion}
        messagesInstance={activeMessageInstance}
      />
    ) : (
      <ChatPrivatePanel
        title={activeDiscussion.nick}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
        targetUser={activeDiscussion}
        messagesInstance={activeMessageInstance}
      />
    );
  }, [activeDiscussion, activeMessageInstance, userId]);

  return activeDiscussionPanel;
}

export default ChatDiscussion;
