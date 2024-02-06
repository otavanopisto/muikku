import Dialog, { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";

/**
 * ChatDeleteRoomDialog
 */
const ChatCloseAndBlockDiscussionDialog = () => {
  const {
    closeAndBlockDiscussionWithUser,
    userToBeBlocked,
    closeBlockUserDialog,
  } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles block user click
   * @param callback callback
   */
  const handleBlockUserClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await closeAndBlockDiscussionWithUser(userToBeBlocked);
      setDisabled(false);
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!userToBeBlocked) {
      return null;
    }

    return (
      <div>
        <DialogRow>
          Haluatko varmasti estää käyttäjän{" "}
          <strong>{userToBeBlocked.nick}</strong>. Tämä estää käyttäjää
          lähettämästä sinulle uusia viestejä.
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
        onClick={handleBlockUserClick(closeDialog)}
        disabled={disabled}
      >
        Estä käyttäjä
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
      isOpen={!!userToBeBlocked}
      onClose={closeBlockUserDialog}
      localElementId="chat__body"
      disableScroll={true}
      title="Käyttäjän estäminen"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
};

export default ChatCloseAndBlockDiscussionDialog;
