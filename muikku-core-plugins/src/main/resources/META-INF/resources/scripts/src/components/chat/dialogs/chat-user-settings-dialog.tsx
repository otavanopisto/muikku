import Dialog from "~/components/general/dialog";
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
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
    <div className="chat-rooms-editor">
      <h3>Asetukset</h3>
      <div
        className="new-room-form"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label>Nimimerkki</label>
        <input
          type="text"
          value={currentNickValue}
          onChange={handleUserNameChange}
          disabled={disabled}
        />
        <Select<ChatSettingVisibilityOption>
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

        <button onClick={handleSaveClick(closeDialog)} disabled={disabled}>
          Tallenna
        </button>
        <button onClick={closeDialog} disabled={disabled}>
          Peruuta
        </button>
      </div>
    </div>
  );

  return (
    <Dialog
      localElementId="chat__body"
      disableScroll={true}
      title="Chatti asetukset"
      content={content}
      modifier={["wizard", "local"]}
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
