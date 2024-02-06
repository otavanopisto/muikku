import Dialog, { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";

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
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      await deleteCustomRoom(room.identifier);
      callback();
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <DialogRow>
        Oletko varma että haluat poistaa huoneen: <strong>{room.name}</strong>?
        Kaikki huoneen viestit poistuvat myös.
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
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleDeleteClick(closeDialog)}
      >
        Poista
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
      >
        Peruuta
      </Button>
    </div>
  );

  return (
    <Dialog
      localElementId="chat__body"
      disableScroll={true}
      title="Huoneen poisto"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </Dialog>
  );
};

export default ChatRoomDeleteDialog;
