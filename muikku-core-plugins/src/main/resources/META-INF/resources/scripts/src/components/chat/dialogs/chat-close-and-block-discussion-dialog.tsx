import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";

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
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDisabled(true);
      await closeAndBlockDiscussionWithUser(userToBeBlocked);
      setDisabled(false);
    };

  /**
   * handleCancelUnblockClick
   * @param e e
   */
  const handleCancelUnblockClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    closeBlockUserDialog();
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
        <h3>Käyttäjän esto</h3>
        <p>
          Haluatko varmasti estää käyttäjän:{" "}
          <strong>{userToBeBlocked.nick}</strong>. Tämä estää käyttäjää
          lähettämästä sinulle uusia viestejä.
        </p>
        <button onClick={handleBlockUserClick(closeDialog)} disabled={disabled}>
          Estä käyttäjä
        </button>
        <button onClick={handleCancelUnblockClick} disabled={disabled}>
          Peruuta
        </button>
      </div>
    );
  };

  return (
    <Dialog
      isOpen={!!userToBeBlocked}
      localElementId="chat__body"
      disableScroll={true}
      title="Käyttäjän estäminen"
      content={content}
      modifier={["wizard", "local"]}
    />
  );
};

export default ChatCloseAndBlockDiscussionDialog;
