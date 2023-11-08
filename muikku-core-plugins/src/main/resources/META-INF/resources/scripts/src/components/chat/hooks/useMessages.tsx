import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatMessage } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * useMessages
 */
function useMessages() {
  const websocket = useChatWebsocketContext();

  const [chatMsgs, setChatMsgs] = React.useState<ChatMessage[]>([]);
  const [loadingChatMsgs, setLoadingChatMsgs] = React.useState<boolean>(false);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchMsgs();
  }, []);

  /**
   * Fetch Messages
   */
  const fetchMsgs = async () => {
    setLoadingChatMsgs(true);

    const msgs = await chatApi.getChatMessagesByTarget({
      targetIdentifier: "1",
    });

    unstable_batchedUpdates(() => {
      setChatMsgs(msgs);
      setLoadingChatMsgs(false);
    });
  };

  React.useEffect(() => {
    /**
     * onChatMsgSentMsg
     * @param data created ChatMessage.
     */
    const onChatMsgSentMsg = (data: ChatMessage) => {
      if (componentMounted.current) {
        setChatMsgs((msgs) => [...msgs, data]);
      }
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:room-created", onChatMsgSentMsg);

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:room-created", onChatMsgSentMsg);
    };
  }, [websocket]);

  return { chatMsgs, loadingChatMsgs };
}

export default useMessages;
