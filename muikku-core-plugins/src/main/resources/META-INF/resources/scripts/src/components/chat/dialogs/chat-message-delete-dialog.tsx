import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatMessage } from "~/generated/client";
import Button from "~/components/general/button";
import { localize } from "~/locales/i18n";
import ChatProfileAvatar from "../chat-profile-avatar";
import { parseLines } from "../chat-helpers";
import ChatDialog from "./chat-dialog";

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
function ChatDeleteMessageDialog(props: ChatDeleteMessageDialogProps) {
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
  const content = (closeDialog: () => void) => {
    if (!message.message) return null;

    return (
      <div>
        <DialogRow>
          <strong>Olet poistamassa viestiä:</strong>
        </DialogRow>
        <DialogRow>
          <div className="chat__message chat__message--deleting">
            <ChatProfileAvatar
              id={message.sourceUserEntityId}
              nick={message.nick}
              hasImage={message.hasImage}
            />
            <div className="chat__message-content-container">
              <div className="chat__message-meta">
                <span className={`chat__message-meta-sender`}>
                  {message.nick}
                </span>
                <span className="chat__message-meta-timestamp">
                  {localize.formatDaily(message.sentDateTime)}
                </span>
              </div>
              <div className="chat__message-body">
                {parseLines(message.message)}
                {message.editedDateTime && (
                  <div className="chat__message-edited-info">
                    (Muokattu {localize.formatDaily(message.editedDateTime)})
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogRow>
      </div>
    );
  };

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
    <ChatDialog
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
}

export default ChatDeleteMessageDialog;
