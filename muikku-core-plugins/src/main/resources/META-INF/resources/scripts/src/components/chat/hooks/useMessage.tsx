/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { useTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { ChatMessage } from "~/generated/client";
import { useChatContext } from "../context/chat-context";

/**
 * MessageAction
 */
export interface MessageAction {
  icon: string;
  text: string;
  modifiers: string[];
  onClick: (e: React.MouseEvent) => void;
}

const chatApi = MApi.getChatApi();

/**
 * UseMessageProps
 */
interface UseMessageProps {
  msg: ChatMessage;
  onEditClick: (msg: ChatMessage) => void;
}

/**
 * useMessage
 * @param props props.
 */
function useMessage(props: UseMessageProps) {
  const { msg, onEditClick } = props;

  const { currentUser, canModerate, displayNotification } = useChatContext();

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const [editedMessage, setEditedMessage] = React.useState<string>(msg.message);
  const myMsg = msg.sourceUserEntityId === currentUser.id;

  const { t } = useTranslation("chat");

  /**
   * Delete message
   */
  const deleteMessage = React.useCallback(async () => {
    try {
      await chatApi.deleteChatMessage({
        messageId: msg.id,
      });

      setShowDeleteDialog(false);
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      //displayNotification("Viestin poisto epäonnistui", "error");
      displayNotification(
        t("notifications.deleteError", {
          context: "message",
        }),
        "error"
      );
    }
  }, [displayNotification, msg.id, t]);

  /**
   * Close delete dialog
   */
  const closeDeleteDialog = React.useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  /**
   * Toggles edit mode
   */
  const toggleEditMode = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setEditMode(nextState);
    } else {
      setEditMode((panelRightOpen) => !panelRightOpen);
    }
  }, []);

  /**
   * Save edited message
   */
  const saveEditedMessage = React.useCallback(async () => {
    try {
      await chatApi.updateChatMessage({
        messageId: msg.id,
        updateChatMessageRequest: {
          message: editedMessage,
        },
      });

      toggleEditMode(false);
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      //displayNotification("Viestin muokkaus epäonnistui", "error");
      displayNotification(
        t("notifications.updateError", {
          context: "message",
        }),
        "error"
      );
    }
  }, [displayNotification, editedMessage, msg.id, t, toggleEditMode]);

  /**
   * Handles edited message change
   */
  const handleEditedMessageChange = React.useCallback(
    (htmlAsString: string) => {
      setEditedMessage(htmlAsString);
    },
    []
  );

  /**
   * Handles delete click
   */
  const handleDeleteClick = React.useCallback(
    async (e: React.MouseEvent) => {
      // If shift key and mouse left button is pressed delete message
      if (e.shiftKey && e.button === 0) {
        await deleteMessage();
      } else {
        setShowDeleteDialog(true);
      }
    },
    [deleteMessage]
  );

  /**
   * Handles edit click
   */
  const handleEditClick = React.useCallback(() => {
    toggleEditMode(true);
    onEditClick && onEditClick(msg);
  }, [msg, onEditClick, toggleEditMode]);

  const mainModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [
      {
        icon: "pencil",
        text: "Muokkaa",
        onClick: handleEditClick,
        modifiers: ["info"],
      },
      {
        icon: "trash",
        text: "Poista",
        onClick: handleDeleteClick,
        modifiers: ["fatal"],
      },
    ];

    // If message is archived, no actions are available
    if (msg.archived) {
      return [];
    }

    // If message is user's own, return default actions
    if (myMsg) {
      return defaultActions;
    }

    // If user can moderate, return default actions without edit
    if (canModerate) {
      defaultActions.shift();
      return defaultActions;
    }

    // default is no actions
    return [];
  }, [canModerate, handleDeleteClick, handleEditClick, msg.archived, myMsg]);

  const secondaryModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [];

    return canModerate ? defaultActions : [];
  }, [canModerate]);

  const mobileModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [...mainModerationActions];

    return defaultActions;
  }, [mainModerationActions]);

  return {
    editedMessage,
    showDeleteDialog,
    closeDeleteDialog,
    toggleEditMode,
    deleteMessage,
    editMode,
    mainModerationActions,
    secondaryModerationActions,
    mobileModerationActions,
    myMsg,
    saveEditedMessage,
    handleEditedMessageChange,
  };
}

export default useMessage;
