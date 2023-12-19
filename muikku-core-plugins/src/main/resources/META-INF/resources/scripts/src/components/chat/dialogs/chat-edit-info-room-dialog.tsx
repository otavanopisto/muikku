import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "../context/chat-context";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

/**
 * NewChatRoomDialogProps
 */
interface ChatEditAndInfoRoomDialogProps {
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
const ChatEditAndInfoRoomDialog = (props: ChatEditAndInfoRoomDialogProps) => {
  const { room, defaults } = props;

  const { saveEditedRoom } = useChatContext();

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
   * Handles save click
   *
   * @param callback callback
   */
  const handleSaveClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDisabled(true);
      await saveEditedRoom(room.identifier, {
        name: roomEdit.name,
        description: roomEdit.description,
      });

      if (defaults === "info") {
        unstable_batchedUpdates(() => {
          setEditing(false);
          setRoomEdit(room);
          setDisabled(false);
        });
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
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // if dialog default functionality is info, then canceling will just revert back to info
      // else we will call callback that will close the dialog
      if (defaults === "info") {
        unstable_batchedUpdates(() => {
          setEditing(false);
          setRoomEdit(room);
        });
      } else {
        setEditing(false);
        callback();
      }
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) =>
    editing ? (
      <div className="chat-rooms-editor">
        <h3>Uusi chatti huone</h3>
        <div
          className="new-room-form"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <label>Nimi</label>
          <input
            type="text"
            value={roomEdit.name}
            onChange={handlesNameChange}
          />

          <label>Kuvaus</label>
          <textarea
            value={roomEdit.description}
            onChange={handlesDescriptionChange}
          />
          <button onClick={handleSaveClick(closeDialog)} disabled={disabled}>
            Tallenna muokkaus
          </button>
          <button
            onClick={handlesCancelEditClick(closeDialog)}
            disabled={disabled}
          >
            Peruuta
          </button>
        </div>
      </div>
    ) : (
      <div>
        <h3>{room.name}</h3>
        <p>{room.description}</p>
        <button onClick={() => setEditing(true)}>Muokkaa</button>
      </div>
    );

  return (
    <Dialog
      localElementId="chat-window__main"
      disableScroll={true}
      title="Uusi huone"
      content={content}
      modifier={["wizard", "local"]}
    >
      {props.children}
    </Dialog>
  );
};

export default ChatEditAndInfoRoomDialog;
