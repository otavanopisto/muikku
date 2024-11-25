import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import {
  ChatSettingVisibilityOption,
  getRoomSettingsKey,
  selectOptions,
  toggleRoomNotification,
} from "../chat-helpers";
import Select from "react-select";
import { useChatContext } from "../context/chat-context";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";
import { ChatUserVisibilityEnum } from "~/generated/client";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";

const chatApi = MApi.getChatApi();

/**
 * NewChatRoomDialogProps
 */
interface ChatUserSettingDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * ChatUserSettingsDialog
 * @param props props
 */
function ChatUserSettingsDialog(props: ChatUserSettingDialogProps) {
  const {
    currentUser,
    displayNotification,
    notificationSettings,
    roomsPrivate,
    roomsPublic,
    saveNotificationSettingsChanges,
    updateNotificationSettings,
    resetNotificationSettingsChanges,
  } = useChatContext();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [currentNickValue, setCurrentNickValue] = React.useState(
    currentUser.nick
  );
  const [currentSelectValue, setCurrentSelectValue] =
    React.useState<ChatUserVisibilityEnum>(currentUser.visibility);

  const { t } = useTranslation(["chat", "common"]);

  const allPublicRoomsEnabled = React.useMemo(() => {
    if (!roomsPublic || !notificationSettings) {
      return false;
    }

    return roomsPublic.every((room) =>
      notificationSettings.publicRoomEnabled.includes(room.identifier)
    );
  }, [roomsPublic, notificationSettings]);

  const allPrivateRoomsEnabled = React.useMemo(() => {
    if (!roomsPrivate || !notificationSettings) {
      return false;
    }

    return roomsPrivate.every((room) =>
      notificationSettings.privateRoomEnabled.includes(room.identifier)
    );
  }, [roomsPrivate, notificationSettings]);

  React.useEffect(() => {
    unstable_batchedUpdates(() => {
      setCurrentNickValue(currentUser.nick);
      setCurrentSelectValue(currentUser.visibility);
    });
  }, [currentUser]);

  /**
   * Handles save click
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);

      try {
        const updatedData = await chatApi.updateChatSettings({
          updateChatSettingsRequest: {
            ...currentUser,
            nick: currentNickValue.trim(),
            visibility: currentSelectValue,
          },
        });

        await saveNotificationSettingsChanges();

        unstable_batchedUpdates(() => {
          setCurrentNickValue(updatedData.nick);
          setDisabled(false);
        });

        callback();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        } else if (isResponseError(err)) {
          if (err.response.status === 400) {
            displayNotification(
              t("notifications.400", {
                context: "settings",
              }),
              "error"
            );
          }

          if (err.response.status === 409) {
            displayNotification(
              t("notifications.409", {
                context: "settings",
              }),
              "error"
            );
          }
        } else {
          displayNotification(
            t("notifications.updateError", {
              context: "settings",
            }),
            "error"
          );
        }

        unstable_batchedUpdates(() => {
          setCurrentNickValue(currentUser.nick.trim());
          setDisabled(false);
        });
      }
    };

  /**
   * Handles name change
   * @param e e
   */
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentNickValue(e.target.value);
  };

  /**
   * Handles select change
   * @param selectedOption selectedOption
   */
  const handleSelectChange = (selectedOption: ChatSettingVisibilityOption) => {
    setCurrentSelectValue(selectedOption.value);
  };

  const selectValues = selectOptions(t);

  const selectedValue = selectValues.find(
    (option) => option.value === currentSelectValue
  );

  /**
   * Handles toggle global notifications
   */
  const handleToggleGlobalNotifications = () => {
    updateNotificationSettings({
      ...notificationSettings,
      notificationsEnabled: !notificationSettings.notificationsEnabled,
    });
  };

  /**
   * Handles toggle private messages
   */
  const handleTogglePrivateMessages = () => {
    updateNotificationSettings({
      ...notificationSettings,
      privateMessagesEnabled: !notificationSettings.privateMessagesEnabled,
    });
  };

  /**
   * Handles toggle all private room notifications
   */
  const handleToggleAllPrivateRoomNotifications = () => {
    // If all rooms are enabled, we want to unselect all rooms
    if (allPrivateRoomsEnabled) {
      updateNotificationSettings({
        ...notificationSettings,
        privateRoomEnabled: [],
      });
    } else {
      updateNotificationSettings({
        ...notificationSettings,
        privateRoomEnabled: roomsPrivate.map((room) => room.identifier),
      });
    }
  };

  /**
   * Handles toggle all public room notifications
   */
  const handleToggleAllPublicRoomNotifications = () => {
    // If all rooms are enabled, we want to unselect all rooms
    if (allPublicRoomsEnabled) {
      updateNotificationSettings({
        ...notificationSettings,
        publicRoomEnabled: [],
      });
    } else {
      updateNotificationSettings({
        ...notificationSettings,
        publicRoomEnabled: roomsPublic.map((room) => room.identifier),
      });
    }
  };

  /**
   * Handles toggle room notifications
   * @param roomId roomId
   * @param isPrivate isPrivate
   */
  const handleToggleRoomNotifications =
    (roomId: string, isPrivate: boolean) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const roomType = getRoomSettingsKey(isPrivate);
      const newSettings = toggleRoomNotification(
        notificationSettings,
        roomId,
        roomType
      );
      updateNotificationSettings(newSettings);
    };

  /**
   * Handles close dialog
   * @param closeDialog closeDialog
   */
  const handleCloseDialog =
    (closeDialog: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      resetNotificationSettingsChanges();
      closeDialog();
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label" htmlFor="chatNickName">
            {t("labels.nick", {
              ns: "chat",
            })}
          </label>
          <input
            id="chatNickName"
            type="text"
            className="chat__textfield"
            value={currentNickValue}
            onChange={handleUserNameChange}
            disabled={disabled}
          />
        </div>
      </DialogRow>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label" htmlFor="selectVisibility">
            {t("labels.selectVisibility", {
              ns: "chat",
            })}
          </label>
          <Select<ChatSettingVisibilityOption>
            id="selectVisibility"
            className="react-select-override react-select-override--chat"
            classNamePrefix="react-select-override"
            isDisabled={disabled}
            value={selectedValue}
            options={selectValues}
            onChange={handleSelectChange}
            styles={{
              // eslint-disable-next-line jsdoc/require-jsdoc
              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
        </div>
      </DialogRow>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label chat__label--checkbox">
            {t("labels.chatNotifications", {
              ns: "chat",
            })}
          </label>
          <input
            type="checkbox"
            checked={notificationSettings.notificationsEnabled}
            onChange={handleToggleGlobalNotifications}
            disabled={disabled}
          />
        </div>
      </DialogRow>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label chat__label--checkbox">
            {t("labels.privateMessageNotifications", {
              ns: "chat",
            })}
          </label>
          <input
            type="checkbox"
            checked={notificationSettings.privateMessagesEnabled}
            onChange={handleTogglePrivateMessages}
            disabled={disabled}
          />
        </div>
      </DialogRow>
      <DialogRow>
        <div className="form-element">
          {t("labels.rooms_public", {
            ns: "chat",
          })}
          <Button
            buttonModifiers={["link"]}
            onClick={handleToggleAllPublicRoomNotifications}
            disabled={disabled}
          >
            {allPublicRoomsEnabled
              ? t("actions.unselectAll", {
                  ns: "chat",
                })
              : t("actions.selectAll", {
                  ns: "chat",
                })}
          </Button>
        </div>
      </DialogRow>

      {roomsPublic.map((room) => (
        <DialogRow key={room.identifier}>
          <div className="form-element">
            <label
              key={room.identifier}
              className="chat__label chat__label--checkbox"
            >
              {room.name}
            </label>
            <input
              type="checkbox"
              checked={notificationSettings.publicRoomEnabled.includes(
                room.identifier
              )}
              onChange={handleToggleRoomNotifications(room.identifier, false)}
              disabled={disabled}
            />
          </div>
        </DialogRow>
      ))}

      <DialogRow>
        <div className="form-element">
          {t("labels.rooms_workspace", {
            ns: "chat",
          })}
          <Button
            buttonModifiers={["link"]}
            onClick={handleToggleAllPrivateRoomNotifications}
            disabled={disabled}
          >
            {allPrivateRoomsEnabled
              ? t("actions.unselectAll", {
                  ns: "chat",
                })
              : t("actions.selectAll", {
                  ns: "chat",
                })}
          </Button>
        </div>
      </DialogRow>

      {roomsPrivate.map((room) => (
        <DialogRow key={room.identifier}>
          <div className="form-element">
            <label
              key={room.identifier}
              className="chat__label chat__label--checkbox"
            >
              {room.name}
            </label>
            <input
              type="checkbox"
              checked={notificationSettings.privateRoomEnabled.includes(
                room.identifier
              )}
              onChange={handleToggleRoomNotifications(room.identifier, true)}
              disabled={disabled}
            />
          </div>
        </DialogRow>
      ))}
    </div>
  );

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={handleSaveClick(closeDialog)}
        disabled={disabled}
      >
        {t("actions.save", {
          ns: "common",
        })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCloseDialog(closeDialog)}
        disabled={disabled}
      >
        {t("actions.cancel", {
          ns: "common",
        })}
      </Button>
    </div>
  );

  return (
    <ChatDialog
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.chatSettings", {
        ns: "chat",
      })}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </ChatDialog>
  );
}

export default ChatUserSettingsDialog;
