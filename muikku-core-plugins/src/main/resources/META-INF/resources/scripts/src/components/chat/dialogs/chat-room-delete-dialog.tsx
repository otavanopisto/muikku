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
      await deleteCustomRoom(roomToBeDeleted.identifier);
      setDisabled(false);
      closeDialog();
    };

  /**
   * Handles dialog close with delay
   */
  const handleDialogClose = () => {
    setTimeout(() => {
      closeDeleteRoomDialog();
    }, 200);
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
          <div
            dangerouslySetInnerHTML={{
              __html: t("content.deleteRoomMsg", {
                name: roomToBeDeleted.name,
                ns: "chat",
              }),
            }}
          />
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
      isOpen={!!roomToBeDeleted}
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.deletingRoom", { ns: "chat" })}
      content={content}
      footer={footer}
      onClose={handleDialogClose}
      modifier={["chat", "local"]}
    >
      {props.children}
    </ChatDialog>
  );
}

export default ChatDeleteRoomDialog;
