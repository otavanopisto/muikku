import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatMessage } from "~/generated/client";

/**
 * ChatDeleteRoomDialogProps
 */
interface ChatDeleteMessageDialogProps {
  /**
   * Is dialog open
   */
  open: boolean;
  /**
   * Chat room
   */
  message: ChatMessage;
  /**
   * On delete
   */
  onDelete: () => Promise<void>;
  /**
   * On close
   */
  onClose: () => void;
}

/**
 * ChatDeleteRoomDialog
 * @param props props
 */
const ChatDeleteMessageDialog = (props: ChatDeleteMessageDialogProps) => {
  const { open, message, onClose, onDelete } = props;

  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles save click
   * @param callback callback
   */
  const handleDeleteClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDisabled(true);

      try {
        await onDelete();
        setDisabled(false);
        callback();
      } catch (err) {
        setDisabled(false);
      }
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <h3>Uusi chatti huone</h3>
      <p>
        Olet poistamassa viestiä: <strong>{message.message}</strong>
      </p>
      <button onClick={handleDeleteClick(closeDialog)} disabled={disabled}>
        Poista
      </button>
      <button onClick={closeDialog} disabled={disabled}>
        Peruuta
      </button>
    </div>
  );

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      localElementId="chat__body"
      disableScroll={true}
      title="Viestin poisto"
      content={content}
      modifier={["wizard", "local"]}
    />
  );
};

export default ChatDeleteMessageDialog;
