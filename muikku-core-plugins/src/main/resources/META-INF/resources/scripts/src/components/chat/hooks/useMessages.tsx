import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatMessage } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * useMessages
 * @param targetIdentifier targetIdentifier
 */
function useMessages(targetIdentifier: string) {
  const websocket = useChatWebsocketContext();

  const [chatMsgs, setChatMsgs] = React.useState<ChatMessage[]>([]);
  const [loadingChatMsgs, setLoadingChatMsgs] = React.useState<boolean>(false);

  const [newMessage, setNewMessage] = React.useState<string>("");

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * Fetch Messages
     */
    const fetchMsgs = async () => {
      setLoadingChatMsgs(true);

      const msgs = await chatApi.getChatMessagesByTarget({
        targetIdentifier: targetIdentifier,
      });

      unstable_batchedUpdates(() => {
        setChatMsgs(msgs);
        setLoadingChatMsgs(false);
      });
    };

    fetchMsgs();
  }, [targetIdentifier]);

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
   * editMessage
   * @param msg msg
   */
  /* const editMessage = async (msg: ChatMessage) => {
    await chatApi.updateChatMessage({
      messageId: msg.id,
      updateChatMessageRequest: {
        message: msg.message,
      },
    });
  }; */

  /**
   * deleteMessage
   * @param msg msg
   */
  /* const deleteMessage = async (msg: ChatMessage) => {
    await chatApi.deleteChatMessage({
      messageId: msg.id,
    });
  }; */

  React.useEffect(() => {
    /**
     * onChatMsgSentMsg
     * @param data created ChatMessage.
     */
    const onChatMsgSentMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

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
  }, [websocket]);

  return { chatMsgs, loadingChatMsgs, newMessage, setNewMessage, postMessage };
}

export default useMessages;
