/* eslint-disable no-console */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import MApi from "~/api/api";
// eslint-disable-next-line camelcase
import { ChatMessage } from "~/generated/client";
import { useChatContext } from "../context/chat-context";

/**
 * MessageAction
 */
export interface MessageAction {
  icon: string;
  text: string;
  onClick: (e: React.MouseEvent) => void;
}

const chatApi = MApi.getChatApi();

/**
 * useMessage
 * @param msg id of message.
 */
function useMessage(msg: ChatMessage) {
  const { userId, canModerate } = useChatContext();

  const [editMode, setEditMode] = React.useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    React.useState<boolean>(false);

  const contentRef = React.useRef<HTMLDivElement>(null);

  const myMsg = msg.sourceUserEntityId === userId;

  /**
   * Delete message
   */
  const deleteMessage = React.useCallback(async () => {
    await chatApi.deleteChatMessage({
      messageId: msg.id,
    });

    setShowDeleteDialog(false);
  }, [msg]);

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
      setEditMode((rightPanelOpen) => !rightPanelOpen);
    }
  }, []);

  /**
   * Get edited message
   */
  const getEditedMessage = () => {
    let finalText = "";
    const childNodes = contentRef.current.childNodes;
    childNodes.forEach((n: Node, index) => {
      finalText += n.textContent;
      const isLast = childNodes.length - 1 === index;
      if ((n as HTMLElement).tagName && !isLast) {
        finalText += "\n";
      }
    });

    return finalText;
  };

  /**
   * Save edited message
   */
  const saveEditedMessage = async () => {
    const editedMessage = getEditedMessage();

    await chatApi.updateChatMessage({
      messageId: msg.id,
      updateChatMessageRequest: {
        message: editedMessage,
      },
    });

    toggleEditMode(false);
  };

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
  }, [toggleEditMode]);

  const mainModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [
      {
        icon: "pencil",
        text: "Muokkaa",
        onClick: handleEditClick,
      },
      {
        icon: "trash",
        text: "Poista",
        onClick: handleDeleteClick,
      },
    ];

    if (!myMsg) {
      defaultActions.pop();
    }

    return canModerate ? defaultActions : [];
  }, [canModerate, handleDeleteClick, handleEditClick, myMsg]);

  const secondaryModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [];

    return canModerate ? defaultActions : [];
  }, [canModerate]);

  const mobileModerationActions = React.useMemo(() => {
    const defaultActions: MessageAction[] = [
      ...mainModerationActions,
      ...secondaryModerationActions,
    ];

    return canModerate ? defaultActions : [];
  }, [canModerate, mainModerationActions, secondaryModerationActions]);

  return {
    showDeleteDialog,
    closeDeleteDialog,
    toggleEditMode,
    deleteMessage,
    contentRef,
    editMode,
    mainModerationActions,
    secondaryModerationActions,
    mobileModerationActions,
    myMsg,
    saveEditedMessage,
  };
}

export default useMessage;
