import Dialog, { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatSettingVisibilityOption, selectOptions } from "../chat-helpers";
import Select from "react-select";
import { useChatContext } from "../context/chat-context";
import MApi from "~/api/api";
import { StateType } from "~/reducers";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { displayNotification } from "~/actions/base/notifications";
import { connect } from "react-redux";
import Button from "~/components/general/button";

const chatApi = MApi.getChatApi();

/**
 * NewChatRoomDialogProps
 */
interface ChatUserSettingDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * NewChatRoomDialog
 * @param props props
 */
const ChatUserSettingsDialog = (props: ChatUserSettingDialogProps) => {
  const { currentUser } = useChatContext();
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const [currentNickValue, setCurrentNickValue] = React.useState(
    currentUser.nick
  );
  const [currentSelectValue, setCurrentSelectValue] =
    React.useState<ChatSettingVisibilityOption>(
      selectOptions.find((option) => option.value === currentUser.visibility)
    );

  /**
   * Handles save click
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);

      try {
        await chatApi.updateChatSettings({
          updateChatSettingsRequest: {
            ...currentUser,
            nick: currentNickValue,
            visibility: currentSelectValue.value,
          },
        });
        setDisabled(false);
        callback();
      } catch (err) {
        props.displayNotification(
          "Virhe chatin asetuksia päivittäessä",
          "error"
        );
        setDisabled(false);
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
    setCurrentSelectValue(selectedOption);
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
            Nimimerkki
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
          <label className="chat__label" htmlFor="chatVisibility">
            Näkyvyys
          </label>
          <Select<ChatSettingVisibilityOption>
            id="chatVisibility"
            className="react-select-override"
            classNamePrefix="react-select-override"
            isDisabled={disabled}
            value={currentSelectValue}
            onChange={handleSelectChange}
            options={selectOptions}
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
        Tallenna
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
        disabled={disabled}
      >
        Peruuta
      </Button>
    </div>
  );

  return (
    <Dialog
      localElementId="chat__body"
      disableScroll={true}
      title="Chatin asetukset"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </Dialog>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {
    displayNotification,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatUserSettingsDialog);
