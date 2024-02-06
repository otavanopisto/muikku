import Dialog, { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatMessage } from "~/generated/client";
import Button from "~/components/general/button";

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
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
      <DialogRow>
        <strong>Olet poistamassa viestiä:</strong>
      </DialogRow>
      <DialogRow>{message.message}</DialogRow>
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
        disabled={disabled}
      >
        Poista
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
      isOpen={open}
      onClose={onClose}
      localElementId="chat__body"
      disableScroll={true}
      title="Viestin poisto"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
};

export default ChatDeleteMessageDialog;
