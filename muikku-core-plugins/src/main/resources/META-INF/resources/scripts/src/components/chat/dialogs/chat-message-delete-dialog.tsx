import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatMessage } from "~/generated/client";
import Button from "~/components/general/button";
import { localize } from "~/locales/i18n";
import ChatProfileAvatar from "../chat-profile-avatar";
import { generateHash, parseLines } from "../chat-helpers";
import ChatDialog from "./chat-dialog";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation(["chat", "common"]);

  /**
   * Handles save click
   * @param closeDialog closeDialog
   */
  const handleDeleteClick =
    (closeDialog: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);

      try {
        await onDelete();
        setDisabled(false);
        closeDialog();
      } catch (err) {
        setDisabled(false);
      }
    };

  /**
   * Handles dialog close with delay
   */
  const handleDialogClose = () => {
    setTimeout(() => {
      onClose();
    }, 200);
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!message.message) return null;

    // If message nick exists, use it, else use a generated hash that indicates that the
    // user has closed the chat for good
    const nick =
      message.nick ||
      `${t("labels.gone", {
        ns: "chat",
      })}#${generateHash(`user-${message.sourceUserEntityId}`)}`;

    return (
      <div>
        <DialogRow>
          <strong>
            {t("labels.deletingMsg", {
              ns: "chat",
            })}
          </strong>
        </DialogRow>
        <DialogRow>
          <div className="chat__message chat__message--deleting">
            <ChatProfileAvatar
              id={message.sourceUserEntityId}
              nick={nick}
              hasImage={message.hasImage}
            />
            <div className="chat__message-content-container">
              <div className="chat__message-meta">
                <span className={`chat__message-meta-sender`}>{nick}</span>
                <span className="chat__message-meta-timestamp">
                  {localize.formatDaily(message.sentDateTime, "LT")}
                </span>
              </div>
              <div className="chat__message-body">
                {parseLines(message.message)}
                {message.editedDateTime && (
                  <div className="chat__message-edited-info">
                    {t("content.msgEdited", {
                      date: localize.formatDaily(message.editedDateTime, "LT"),
                      ns: "chat",
                    })}
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
        {t("actions.remove")}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
        disabled={disabled}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <ChatDialog
      isOpen={open}
      onClose={handleDialogClose}
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.deletingMsg", { ns: "chat" })}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
}

export default ChatDeleteMessageDialog;
