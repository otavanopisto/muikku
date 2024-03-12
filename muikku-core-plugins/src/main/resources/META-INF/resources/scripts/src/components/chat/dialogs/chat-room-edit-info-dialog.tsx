import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import ChatDialog from "./chat-dialog";

/**
 * NewChatRoomDialogProps
 */
interface ChatRoomEditAndInfoDialogProps {
  /**
   * Chat room
   */
  room: ChatRoom;
  /**
   * What is dialogs default functionality
   */
  defaults: "edit" | "info";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * ChatRoomInfoDialog
 * @param props props
 */
function ChatRoomEditAndInfoDialog(props: ChatRoomEditAndInfoDialogProps) {
  const { room, defaults } = props;

  const { saveEditedRoom, canModerate, deleteCustomRoom } = useChatContext();

  const [roomEdit, setRoomEdit] = React.useState<ChatRoom>(room);
  const [editing, setEditing] = React.useState<boolean>(defaults === "edit");
  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles name change
   * @param e e
   */
  const handlesNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomEdit({ ...roomEdit, name: e.target.value });
  };

  /**
   * Handles description change
   * @param e e
   */
  const handlesDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRoomEdit({ ...roomEdit, description: e.target.value });
  };

  /**
   * Handles delete click
   * @param callback callback
   */
  const handleDeleteClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      await deleteCustomRoom(room.identifier);
      callback();
    };

  /**
   * handleEditClick
   * @param e e
   */
  const handleEditClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setEditing(true);
  };

  /**
   * Handles save click
   *
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await saveEditedRoom(room.identifier, {
        name: roomEdit.name,
        description: roomEdit.description,
      });

      if (defaults === "info") {
        unstable_batchedUpdates(() => {
          setEditing(false);
          setRoomEdit(room);
        });
      } else {
        callback();
      }

      setDisabled(false);
    };

  /**
   * Handles cancel click
   *
   * @param callback callback
   */
  const handlesCancelEditClick =
    (callback: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // if dialog default functionality is info, then canceling will just revert back to info
      // else we will call callback that will close the dialog
      if (defaults === "info") {
        unstable_batchedUpdates(() => {
          setEditing(false);
          setRoomEdit(room);
        });
      } else {
        callback();
      }
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) =>
    editing ? (
      <div>
        <DialogRow>
          <div className="form-element">
            <label className="chat__label" htmlFor="editRoomName">
              Nimi
            </label>
            <input
              id="editRoomName"
              type="text"
              className="chat__textfield"
              value={roomEdit.name}
              onChange={handlesNameChange}
            />
          </div>
        </DialogRow>
        <DialogRow>
          <div className="form-element">
            <label className="chat__label" htmlFor="editRoowDescription">
              Kuvaus
            </label>
            <textarea
              id="editRoowDescription"
              className="chat__memofield"
              value={roomEdit.description || ""}
              onChange={handlesDescriptionChange}
            />
          </div>
        </DialogRow>
      </div>
    ) : (
      <div>
        <DialogRow>
          <strong>{room.name}</strong>
        </DialogRow>
        <DialogRow>{room.description}</DialogRow>
      </div>
    );

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => {
    if (!canModerate) {
      return null;
    }

    return (
      <div className="dialog__button-set">
        {editing ? (
          <>
            <Button
              buttonModifiers={["standard-ok", "execute"]}
              onClick={handleSaveClick(closeDialog)}
              disabled={disabled}
            >
              Tallenna
            </Button>
            <Button
              buttonModifiers={["standard-cancel", "cancel"]}
              onClick={handlesCancelEditClick(closeDialog)}
              disabled={disabled}
            >
              Peruuta
            </Button>
          </>
        ) : (
          <>
            <Button
              buttonModifiers={["standard-ok", "info"]}
              onClick={handleEditClick}
            >
              Muokkaa
            </Button>
            <Button
              onClick={handleDeleteClick(closeDialog)}
              buttonModifiers={["standard-ok", "fatal"]}
            >
              Poista
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <ChatDialog
      localElementId="chat__body"
      disableScroll={true}
      title={editing ? "Muokkaa huoneen tietoja" : "Huoneen tiedot"}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </ChatDialog>
  );
}

export default ChatRoomEditAndInfoDialog;
