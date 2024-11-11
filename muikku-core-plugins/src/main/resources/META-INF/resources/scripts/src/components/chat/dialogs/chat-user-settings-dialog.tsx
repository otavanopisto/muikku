import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatSettingVisibilityOption, selectOptions } from "../chat-helpers";
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
  const { currentUser, displayNotification } = useChatContext();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [currentNickValue, setCurrentNickValue] = React.useState(
    currentUser.nick
  );
  const [currentSelectValue, setCurrentSelectValue] =
    React.useState<ChatUserVisibilityEnum>(currentUser.visibility);

  const { t } = useTranslation(["chat", "common"]);

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
        onClick={closeDialog}
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
