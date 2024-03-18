import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";
import { useTranslation } from "react-i18next";

/**
 * ChatDeleteRoomDialogProps
 */
interface ChatRoomDeleteDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * ChatDeleteRoomDialog
 * @param props props
 */
function ChatDeleteRoomDialog(props: ChatRoomDeleteDialogProps) {
  const { deleteCustomRoom, closeDeleteRoomDialog, roomToBeDeleted } =
    useChatContext();

  const { t } = useTranslation(["chat", "common"]);

  /**
   * Handles save click
   * @param callback callback
   */
  const handleDeleteClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      await deleteCustomRoom(roomToBeDeleted.identifier);
      callback();
    };

  /**
   * handleCloseClick
   * @param e e
   */
  const handleCloseClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    closeDeleteRoomDialog();
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!roomToBeDeleted) {
      return null;
    }

    return (
      <div>
        <DialogRow>
          {t("content.deleteRoomMsg", {
            name: <strong>{roomToBeDeleted.name}</strong>,
            ns: "chat",
          })}
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
      >
        {t("actions.remove")}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCloseClick}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <ChatDialog
      isOpen={!!roomToBeDeleted}
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.deletingRoom", { ns: "chat" })}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    >
      {props.children}
    </ChatDialog>
  );
}

export default ChatDeleteRoomDialog;
