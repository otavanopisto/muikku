import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";

/**
 * NewChatRoomDialogProps
 */
interface ChatUserSettingDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * NewChatRoomDialog
 * @param props props
 */
const ChatUserSettingsDialog = (props: ChatUserSettingDialogProps) => {
  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles save click
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDisabled(true);
      /* await saveNewRoom(); */
      setDisabled(false);
    };

  /**
   * Handles name change
   * @param e e
   */
  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* updateNewRoomEditor("name", e.target.value); */
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div className="chat-rooms-editor">
      <h3>Uusi chatti huone</h3>
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
          //value={newChatRoom.name}
          onChange={handleUserNameChange}
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
      localElementId="chat-window__body"
      disableScroll={true}
      title="Chatti asetukset"
      content={content}
      modifier={["wizard", "local"]}
    >
      {props.children}
    </Dialog>
  );
};

export default ChatUserSettingsDialog;
