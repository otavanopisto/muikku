import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";

/**
 * NewChatRoomDialogProps
 */
interface ChatRoomNewDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * NewChatRoomDialog
 * @param props props
 */
const ChatRoomNewDialog = (props: ChatRoomNewDialogProps) => {
  const { newChatRoom, updateNewRoomEditor, saveNewRoom } = useChatContext();
  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles save click
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await saveNewRoom();
      setDisabled(false);
      callback();
    };

  /**
   * Handles name change
   * @param e e
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewRoomEditor("name", e.target.value);
  };

  /**
   * Handles description change
   * @param e e
   */
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    updateNewRoomEditor("description", e.target.value);
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label" htmlFor="newRoomName">
            Nimi
          </label>
          <input
            id="newRoomName"
            type="text"
            className="chat__textfield"
            value={newChatRoom.name}
            onChange={handleNameChange}
          />
        </div>
      </DialogRow>
      <DialogRow>
        <div className="form-element">
          <label className="chat__label" htmlFor="newRoowDescription">
            Kuvaus
          </label>
          <textarea
            id="newRoowDescription"
            className="chat__memofield"
            value={newChatRoom.description}
            onChange={handleDescriptionChange}
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
    <ChatDialog
      localElementId="chat__body"
      disableScroll={true}
      title="Luo uusi huone"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </ChatDialog>
  );
};

export default ChatRoomNewDialog;
