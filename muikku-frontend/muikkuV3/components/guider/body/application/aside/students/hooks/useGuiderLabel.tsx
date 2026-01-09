import * as React from "react";
import { useDispatch } from "react-redux";
import { displayNotification } from "~/actions/base/notifications";
import { hexToColorInt } from "~/util/modifiers";
import MApi, { isMApiError } from "~/api/api";
import {
  GenericTag,
  Collaborator,
} from "~/components/general/tag-update-dialog";
import {
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
} from "~/actions/main-function/guider";
import { UserFlag } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * useGuiderLabel
 * @param label label
 * @returns tag and functions to handle label actions
 */
export const useGuiderLabel = (label: UserFlag) => {
  const dispatch = useDispatch();
  const [tag, setTag] = React.useState<GenericTag>({
    id: label.id,
    label: label.name,
    color: hexToColorInt(label.color),
    description: label.description || "",
    ownerIdentifier: label.ownerIdentifier,
    collaborators: { all: [], toAdd: [], toRemove: [] },
  });
  const { t } = useTranslation(["flags"]);
  /**
   * Handles delete category
   * @param tag tag to be deleted
   */
  const handleDelete = (tag: GenericTag) => {
    dispatch(removeGuiderFilterLabel({ id: tag.id }));
  };

  /**
   * Handles update category
   * @param tag tag to be updated
   * @param onSuccess optional success callback
   * @param onFail optional fail callback
   */
  const handleUpdate = (
    tag: GenericTag,
    onSuccess?: () => void,
    onFail?: () => void
  ) => {
    if (tag.collaborators.toAdd.length > 0) {
      handleAddCollaborators(tag);
    }
    if (tag.collaborators.toRemove.length > 0) {
      handleRemoveCollaborators(tag);
    }
    dispatch(
      updateGuiderFilterLabel({
        id: tag.id,
        name: tag.label,
        color: "#" + tag.color.toString(16).padStart(6, "0"),
        description: tag.description || "",
        ownerIdentifier: tag.ownerIdentifier,
        success: onSuccess,
        fail: onFail,
      })
    );
  };

  /**
   * Handles adding collaborators to a tag
   * @param tag tag
   * @param success success
   * @param fail fail
   */
  const handleAddCollaborators = async (
    tag: GenericTag,
    success?: () => void,
    fail?: () => void
  ) => {
    const flagId = tag.id;
    const userApi = MApi.getUserApi();

    try {
      for (const collaborator of tag.collaborators.toAdd) {
        await userApi.createFlagShare({
          flagId,
          createFlagShareRequest: {
            flagId,
            userIdentifier: collaborator.identifier,
          },
        });
      }

      success && success();
      dispatch(
        displayNotification(
          t("notifications.addCollaboratorSuccess", {
            ns: "flags",
            collaboratorCount: tag.collaborators.toAdd.length,
          }),
          "success"
        )
      );
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      fail && fail();
      dispatch(
        displayNotification(
          t("notifications.addCollaboratorError", {
            ns: "flags",
            error: e.message,
          }),
          "error"
        )
      );
    }
  };

  /**
   * Handles removing collaborators from a tag
   * @param tag tag
   * @param success success
   * @param fail fail
   */
  const handleRemoveCollaborators = async (
    tag: GenericTag,
    success?: () => void,
    fail?: () => void
  ) => {
    const flagId = tag.id;
    const userApi = MApi.getUserApi();

    try {
      let collaborators: Collaborator[] = [];
      const flagShares = await userApi.getFlagShares({
        flagId,
      });

      // If no collaborators are given, remove all collaborators

      if (!tag.collaborators || tag.collaborators.toRemove.length === 0) {
        collaborators = flagShares.map((share) => ({
          id: share.id,
          identifier: share.userIdentifier,
        }));
      } else {
        collaborators = flagShares
          .filter((share) =>
            tag.collaborators.toRemove.find(
              (c) => c.id === share.user.userEntityId
            )
          )
          .map((share) => ({
            id: share.id,
            identifier: share.userIdentifier,
          }));
      }
      for (const collaborator of collaborators) {
        await userApi.deleteFlagShare({
          flagId,
          shareId: collaborator.id,
        });
      }
      loadCollaborators();
      success && success();
      dispatch(
        displayNotification(
          t("notifications.removeCollaboratorSuccess", {
            ns: "flags",
            collaboratorCount: collaborators.length,
          }),
          "success"
        )
      );
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      fail && fail();
      dispatch(
        displayNotification(
          t("notifications.removeCollaboratorError", {
            ns: "flags",
            error: e.message,
          }),
          "error"
        )
      );
    }
  };

  /**
   * Load collaborators
   */
  const loadCollaborators = React.useCallback(async () => {
    const userApi = MApi.getUserApi();
    try {
      const sharesResult = await userApi.getFlagShares({
        flagId: label.id,
      });

      setTag((prevTag) => ({
        ...prevTag,
        collaborators: { all: sharesResult, toRemove: [], toAdd: [] },
      }));
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      dispatch(displayNotification(e.message, "error"));
    }
  }, [dispatch, label.id]);

  React.useEffect(() => {
    loadCollaborators();
  }, [loadCollaborators]);

  return {
    tag,
    handleDelete,
    handleUpdate,
    setTag,
    handleAddCollaborators,
    handleRemoveCollaborators,
  };
};
