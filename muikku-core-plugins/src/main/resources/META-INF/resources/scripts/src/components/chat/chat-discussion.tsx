import * as React from "react";
import { ChatPrivatePanel, ChatRoomPanel } from "./chat-panel";
import { useChatContext } from "./context/chat-context";
import { isChatRoom } from "./helpers";

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
  const { activeDiscussion, userId } = useChatContext();

  const activeDiscussionPanel = React.useMemo(() => {
    if (!activeDiscussion) {
      return null;
    }

    return isChatRoom(activeDiscussion) ? (
      <ChatRoomPanel
        title={activeDiscussion.name}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
      />
    ) : (
      <ChatPrivatePanel
        title={activeDiscussion.nick}
        userId={userId}
        targetIdentifier={activeDiscussion.identifier}
      />
    );
  }, [activeDiscussion, userId]);

  return activeDiscussionPanel;
}

export default ChatDiscussion;
