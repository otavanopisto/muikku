import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import i18n from "~/locales/i18n";
import {
  getRoomSettingsKey,
  NotificationSettings,
  toggleRoomNotification,
} from "../chat-helpers";

const userApi = MApi.getUserApi();

export type UseChatNotificationSettings = ReturnType<
  typeof useChatNotificationSettings
>;

// Default values for notification settings
const defaultValues: NotificationSettings = {
  notificationsEnabled: false,
  privateMessagesEnabled: false,
  publicRoomEnabled: [],
  privateRoomEnabled: [],
};

/**
 * Custom hook to handle loading chat settings from rest api.
 * @param userEntityId user entity id
 * @param displayNotification displayNotification
 */
function useChatNotificationSettings(
  userEntityId: number,
  displayNotification: DisplayNotificationTriggerType
) {
  const [notificationSettings, setNotificationSettings] =
    React.useState<NotificationSettings>(defaultValues);
  const [loadingNotificationSettings, setLoadingNotificationSettings] =
    React.useState(false);

  // Reference to the original notification settings
  const originalRef = React.useRef<NotificationSettings>(defaultValues);

  React.useEffect(() => {
    /**
     * Fetch chat settings
     */
    const fetchChatNotificationSettings = async () => {
      setLoadingNotificationSettings(true);

      try {
        // If notification settings are not set, response is null/undefined
        const notificationSettings = await userApi.getUserProperties({
          userEntityId,
          properties: "chat-notification-settings",
        });

        unstable_batchedUpdates(() => {
          if (notificationSettings[0].value !== null) {
            setNotificationSettings(JSON.parse(notificationSettings[0].value));
            originalRef.current = JSON.parse(notificationSettings[0].value);
          }

          setLoadingNotificationSettings(false);
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(
          i18n.t("notifications.loadError", {
            context: "settings",
          }),
          "error"
        );

        setLoadingNotificationSettings(false);
      }
    };

    fetchChatNotificationSettings();
  }, [displayNotification, userEntityId]);

  /**
   * Batch update: Update notification settings
   * @param settings settings
   */
  const updateNotificationSettings = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
  };

  /**
   * Batch update: Save all pending changes
   */
  const saveNotificationSettingsChanges = async () => {
    await saveNotificationSettings(notificationSettings);
  };

  /**
   * Immediate update: Toggle room notifications and save
   * @param roomId room id
   * @param isPrivate is private
   */
  const toggleRoomNotificationsImmediate = async (
    roomId: string,
    isPrivate: boolean
  ) => {
    const roomType = getRoomSettingsKey(isPrivate);
    const newSettings = toggleRoomNotification(
      notificationSettings,
      roomId,
      roomType
    );
    setNotificationSettings(newSettings);
    originalRef.current = newSettings;
    await saveNotificationSettings(newSettings);
  };

  /**
   * Save notification settings
   * @param settings settings
   */
  const saveNotificationSettings = async (settings: NotificationSettings) => {
    try {
      await userApi.setUserProperty({
        setUserPropertyRequest: {
          userEntityId,
          key: "chat-notification-settings",
          value: JSON.stringify(settings),
        },
      });
      originalRef.current = settings;
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      displayNotification(
        i18n.t("notifications.saveError", {
          context: "settings",
        }),
        "error"
      );
    }
  };

  /**
   * Reset changes
   */
  const resetNotificationSettingsChanges = () => {
    setNotificationSettings(originalRef.current);
  };

  return {
    notificationSettings,
    loadingNotificationSettings,
    saveNotificationSettingsChanges,
    toggleRoomNotificationsImmediate,
    updateNotificationSettings,
    resetNotificationSettingsChanges,
  };
}

export default useChatNotificationSettings;
