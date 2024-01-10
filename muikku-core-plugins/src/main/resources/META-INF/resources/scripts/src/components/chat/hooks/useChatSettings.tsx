import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatSettings } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

export type UseChatSettings = ReturnType<typeof useChatSettings>;

/**
 * Custom hook to handle loading chat settings from rest api.
 */
function useChatSettings() {
  const websocket = useChatWebsocketContext();

  const [chatSettings, setChatSettings] = React.useState<ChatSettings>(null);
  const [chatEnabled, setChatEnabled] = React.useState<boolean>(false);
  const [loadingChatSettings, setLoadingChatSettings] = React.useState(false);

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchChatSettings();
  }, []);

  /**
   * Fetch chat settings
   */
  const fetchChatSettings = async () => {
    setLoadingChatSettings(true);

    const settings = await chatApi.getChatSettings();

    unstable_batchedUpdates(() => {
      setChatSettings(settings);
      setLoadingChatSettings(false);
    });
  };

  React.useEffect(() => {
    /**
     * onChatSettingsChange
     * @param data data
     */
    const onChatSettingsChange = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const parsedData = JSON.parse(data) as ChatSettings;
          setChatSettings(parsedData);
          setChatEnabled(parsedData.enabled);
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
    chatSettings,
    chatEnabled,
    loadingChatSettings,
  };
}

export default useChatSettings;
