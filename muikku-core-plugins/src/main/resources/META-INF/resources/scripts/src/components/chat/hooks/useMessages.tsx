import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatMessage } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * useMessages
 * @param targetIdentifier targetIdentifier use to load messages.
 * @param targetIdentifiersToListen List of targetIdentifiers to listen to which will cause message list to update.
 */
function useMessages(
  targetIdentifier: string,
  targetIdentifiersToListen: string[]
) {
  const websocket = useChatWebsocketContext();

  const [chatMsgs, setChatMsgs] = React.useState<ChatMessage[]>([]);
  const [loadingInitialChatMsgs, setLoadingInitialChatMsgs] =
    React.useState<boolean>(false);
  const [loadingMoreChatMsgs, setLoadingMoreChatMsgs] =
    React.useState<boolean>(false);

  const [canLoadMore, setCanLoadMore] = React.useState<boolean>(true);

  const [newMessage, setNewMessage] = React.useState<string>("");

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * Fetch Messages
     */
    const fetchMsgs = async () => {
      unstable_batchedUpdates(() => {
        setCanLoadMore(true);
        setLoadingInitialChatMsgs(true);
      });

      const msgs = await chatApi.getChatMessagesByTarget({
        targetIdentifier: targetIdentifier,
        count: 35,
      });

      unstable_batchedUpdates(() => {
        setChatMsgs(msgs);
        setLoadingInitialChatMsgs(false);
      });
    };

    fetchMsgs();
  }, [targetIdentifier]);

  React.useEffect(() => {
    /**
     * onChatMsgSentMsg
     * @param data created ChatMessage.
     */
    const onChatMsgSentMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          targetIdentifiersToListen.includes(dataTyped.targetIdentifier) &&
            setChatMsgs((msgs) => [...msgs, dataTyped]);
        }
      }
    };

    /**
     * onChatMsgEditedMsg
     * @param data edited ChatMessage.
     */
    const onChatMsgEditedMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          targetIdentifiersToListen.includes(dataTyped.targetIdentifier) &&
            setChatMsgs((msgs) => {
              const index = msgs.findIndex((msg) => msg.id === dataTyped.id);

              if (index !== -1) {
                const updatedMsgs = [...msgs];
                updatedMsgs[index] = dataTyped;
                return updatedMsgs;
              }
              return msgs;
            });
        }
      }
    };

    /**
     * onChatMsgDeletedMsg
     * @param data data from server.
     */
    const onChatMsgDeletedMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          targetIdentifiersToListen.includes(dataTyped.targetIdentifier) &&
            setChatMsgs((msgs) => {
              const index = msgs.findIndex((msg) => msg.id === dataTyped.id);

              if (index !== -1) {
                const updatedMsgs = [...msgs];
                updatedMsgs[index] = dataTyped;
                return updatedMsgs;
              }
              return msgs;
            });
        }
      }
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:message-sent", onChatMsgSentMsg);
    websocket.addEventCallback("chat:message-edited", onChatMsgEditedMsg);
    websocket.addEventCallback("chat:message-deleted", onChatMsgDeletedMsg);

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:message-sent", onChatMsgSentMsg);
      websocket.removeEventCallback("chat:message-edited", onChatMsgEditedMsg);
      websocket.removeEventCallback(
        "chat:message-deleted",
        onChatMsgDeletedMsg
      );
    };
  }, [targetIdentifier, targetIdentifiersToListen, websocket]);

  /**
   * postMessage
   */
  const postMessage = async () => {
    await chatApi.createChatMessage({
      targetIdentifier: targetIdentifier,
      createChatMessageRequest: {
        message: newMessage,
      },
    });

    setNewMessage("");
  };

  /**
   * fetchMoreMessages
   */
  const fetchMoreMessages = async () => {
    if (loadingMoreChatMsgs) {
      return;
    }

    setLoadingMoreChatMsgs(true);

    const olderMsgs = await chatApi.getChatMessagesByTarget({
      targetIdentifier: targetIdentifier,
      count: 10,
      earlierThan: chatMsgs[0].sentDateTime,
    });

    if (olderMsgs.length === 0) {
      unstable_batchedUpdates(() => {
        setCanLoadMore(false);
        setLoadingMoreChatMsgs(false);
      });
    } else {
      unstable_batchedUpdates(() => {
        setChatMsgs((msgs) => [...olderMsgs, ...msgs]);
        setLoadingMoreChatMsgs(false);
      });
    }
  };

  return {
    chatMsgs,
    loadingMoreChatMsgs,
    loadingInitialChatMsgs,
    canLoadMore,
    newMessage,
    setNewMessage,
    postMessage,
    fetchMoreMessages,
  };
}

export default useMessages;
