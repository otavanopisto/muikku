import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";

/**
 * ChatUnblockDiscussionDialog
 */
const ChatUnblockDiscussionDialog = () => {
  const {
    unblockDiscussionWithUser,
    userToBeUnblocked,
    closeCancelUnblockDialog,
  } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles close and block user click
   * @param callback callback
   */
  const handleUnblockClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setDisabled(true);
      await unblockDiscussionWithUser(userToBeUnblocked);
      setDisabled(false);
    };

  /**
   * handleCancelUnblockClick
   * @param e e
   */
  const handleCancelUnblockClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    closeCancelUnblockDialog();
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!userToBeUnblocked) {
      return null;
    }

    return (
      <div>
        <h3>Keskustelun eston poisto</h3>
        <p>
          Olet poistamassa estoa käyttäjän:{" "}
          <strong>{userToBeUnblocked.nick}</strong>
          kanssa. Poiston jälkeen käyttäjä voi näkee statuksesi ja hän voi
          lähettää sinulle viestejä.
        </p>
        <button onClick={handleUnblockClick(closeDialog)} disabled={disabled}>
          Poista keskustelu
        </button>
        <button onClick={handleCancelUnblockClick} disabled={disabled}>
          Peruuta
        </button>
      </div>
    );
  };

  return (
    <Dialog
      isOpen={!!userToBeUnblocked}
      localElementId="chat__body"
      disableScroll={true}
      title="Keskustelun eston poisto"
      content={content}
      modifier={["wizard", "local"]}
    />
  );
};

export default ChatUnblockDiscussionDialog;
