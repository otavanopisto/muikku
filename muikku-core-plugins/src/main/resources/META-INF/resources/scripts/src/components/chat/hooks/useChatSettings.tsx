import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { ChatUser, ChatUserVisibilityEnum } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

export type UseChatSettings = ReturnType<typeof useChatSettings>;

/**
 * Custom hook to handle loading chat settings from rest api.
 * @param displayNotification displayNotification
 */
function useChatSettings(displayNotification: DisplayNotificationTriggerType) {
  const websocket = useChatWebsocketContext();

  const [currentUser, setCurrentUser] = React.useState<ChatUser>(null);
  const [chatEnabled, setChatEnabled] = React.useState<boolean>(false);
  const [loadingChatSettings, setLoadingChatSettings] = React.useState(false);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    /**
     * Fetch chat settings
     */
    const fetchChatSettings = async () => {
      setLoadingChatSettings(true);

      try {
        const chatUserSettings = await chatApi.getChatSettings();

        unstable_batchedUpdates(() => {
          setCurrentUser(chatUserSettings);
          setChatEnabled(chatUserSettings.visibility !== "NONE");
          setLoadingChatSettings(false);
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification("Chat asetusten hakeminen epäonnistui", "error");
        setLoadingChatSettings(false);
      }
    };

    fetchChatSettings();
  }, [displayNotification]);

  React.useEffect(() => {
    /**
     * Handles chat settings change event
     * @param data data
     */
    const onChatSettingsChange = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const parsedData: {
            nick: string;
            visibility: ChatUserVisibilityEnum;
          } = JSON.parse(data);

          setCurrentUser((prev) => ({
            ...prev,
            nick: parsedData.nick,
            visibility: parsedData.visibility,
          }));
          setChatEnabled(parsedData.visibility !== "NONE");
        }
      }
    };
    websocket.addEventCallback("chat:settings-change", onChatSettingsChange);

    return () => {
      websocket.removeEventCallback(
        "chat:settings-change",
        onChatSettingsChange
      );
    };
  }, [websocket]);

  return {
    currentUser,
    chatEnabled,
    loadingChatSettings,
  };
}

export default useChatSettings;
