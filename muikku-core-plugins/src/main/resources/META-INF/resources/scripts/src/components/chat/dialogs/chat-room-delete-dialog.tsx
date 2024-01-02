import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "../context/chat-context";

/**
 * ChatDeleteRoomDialogProps
 */
interface ChatRoomDeleteDialogProps {
  /**
   * Chat room
   */
  room: ChatRoom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * ChatDeleteRoomDialog
 * @param props props
 */
const ChatRoomDeleteDialog = (props: ChatRoomDeleteDialogProps) => {
  const { room } = props;

  const { deleteCustomRoom } = useChatContext();

  /**
   * Handles save click
   * @param callback callback
   */
  const handleDeleteClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      await deleteCustomRoom(room.identifier);
      callback();
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <h3>Uusi chatti huone</h3>
      <p>
        Olet poistamassa huonetta: <strong>{room.name}</strong>
      </p>

      <button onClick={handleDeleteClick(closeDialog)}>Poista</button>
      <button onClick={closeDialog}>Peruuta</button>
    </div>
  );

  return (
    <Dialog
      localElementId="chat__body"
      disableScroll={true}
      title="Huoneen poisto"
      content={content}
      modifier={["wizard", "local"]}
    >
      {props.children}
    </Dialog>
  );
};

export default ChatRoomDeleteDialog;
