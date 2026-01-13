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
  const [currentTag, setCurrentTag] = React.useState<GenericTag>({
    id: label.id,
    label: label.name,
    color: hexToColorInt(label.color),
    description: label.description || "",
    ownerIdentifier: label.ownerIdentifier,
    collaborators: [],
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
   * @param updatedTag tag to be updated
   * @param onSuccess optional success callback
   * @param onFail optional fail callback
   */
  const handleUpdate = (
    updatedTag: GenericTag,
    onSuccess?: () => void,
    onFail?: () => void
  ) => {
    const toRemove = currentTag.collaborators.filter(
      (c) => !updatedTag.collaborators.find((updatedC) => updatedC.id === c.id)
    );
    const toAdd = updatedTag.collaborators.filter(
      (c) => !currentTag.collaborators.find((oldC) => oldC.id === c.id)
    );
    if (toAdd.length > 0) {
      handleAddCollaborators(updatedTag, toAdd);
    }
    if (toRemove.length > 0) {
      handleRemoveCollaborators(updatedTag, toRemove);
    }
    dispatch(
      updateGuiderFilterLabel({
        id: updatedTag.id,
        name: updatedTag.label,
        color: "#" + updatedTag.color.toString(16).padStart(6, "0"),
        description: updatedTag.description || "",
        ownerIdentifier: updatedTag.ownerIdentifier,
        success: onSuccess,
        fail: onFail,
      })
    );
  };

  /**
   * Handles adding collaborators to a tag
   * @param tag tag to add the collaborators to
   * @param collaboratorsToAdd collaborators to add
   * @param success success
   * @param fail fail
   */
  const handleAddCollaborators = async (
    tag: GenericTag,
    collaboratorsToAdd: Collaborator[],
    success?: () => void,
    fail?: () => void
  ) => {
    const flagId = tag.id;
    const userApi = MApi.getUserApi();

    try {
      for (const collaborator of collaboratorsToAdd) {
        await userApi.createFlagShare({
          flagId,
          createFlagShareRequest: {
            flagId,
            userIdentifier: collaborator.identifier,
          },
        });
      }
      // Update local state
      setCurrentTag((prevTag) => ({
        ...prevTag,
        collaborators: [...prevTag.collaborators, ...collaboratorsToAdd],
      }));

      success && success();
      dispatch(
        displayNotification(
          t("notifications.addCollaboratorSuccess", {
            ns: "flags",
            collaboratorCount: collaboratorsToAdd.length,
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
   * Wrapper for removing all collaborators from a tag
   * @param tag tag tp remove collaborators from
   * @param success success
   * @param fail fail
   */
  const handleRemoveAllCollaborators = async (
    tag: GenericTag,
    success?: () => void,
    fail?: () => void
  ) => {
    handleRemoveCollaborators(tag, undefined, success, fail);
  };

  /**
   * Handles removing given collaborators from a tag
   * @param tag tag to remove collaborators from
   * @param collaboratorsToRemove collaborators to remove
   * @param success success
   * @param fail fail
   */
  const handleRemoveCollaborators = async (
    tag: GenericTag,
    collaboratorsToRemove?: Collaborator[],
    success?: () => void,
    fail?: () => void
  ) => {
    const flagId = tag.id;
    const userApi = MApi.getUserApi();

    try {
      let shares: { id: number; identifier: string }[] = [];

      const flagShares = await userApi.getFlagShares({
        flagId,
      });

      // If no collaborators are given, remove all collaborators

      if (!collaboratorsToRemove || collaboratorsToRemove.length === 0) {
        shares = flagShares.map((share) => ({
          id: share.id,
          identifier: share.userIdentifier,
        }));
      } else {
        shares = flagShares
          .filter((share) =>
            collaboratorsToRemove.find((c) => c.id === share.user.userEntityId)
          )
          .map((share) => ({
            id: share.id,
            identifier: share.userIdentifier,
          }));
      }
      for (const share of shares) {
        await userApi.deleteFlagShare({
          flagId,
          shareId: share.id,
        });
      }
      // Update local state
      const updatedCollaborators = currentTag.collaborators.filter(
        (c) => !shares.find((s) => s.identifier === c.identifier)
      );
      setCurrentTag((prevTag) => ({
        ...prevTag,
        collaborators: updatedCollaborators,
      }));
      success && success();
      dispatch(
        displayNotification(
          t("notifications.removeCollaboratorSuccess", {
            ns: "flags",
            collaboratorCount: shares.length,
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

      setCurrentTag((prevTag) => ({
        ...prevTag,
        collaborators: sharesResult.map((share) => ({
          name: share.user.firstName + " " + share.user.lastName,
          id: share.user.userEntityId,
          identifier: share.userIdentifier,
        })),
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
    currentTag,
    handleDelete,
    handleUpdate,
    setCurrentTag,
    handleRemoveAllCollaborators,
    handleAddCollaborators,
    handleRemoveCollaborators,
  };
};
