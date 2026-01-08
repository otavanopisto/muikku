import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { UserGroup } from "~/generated/client";
import { GuiderContext } from "../../../context";
import { useTranslation } from "react-i18next";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { breakpoints } from "~/util/breakpoints";

import {
  Collaborator,
  GenericTag,
} from "~/components/general/tag-update-dialog";
import { displayNotification } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";

import {
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
} from "~/actions/main-function/guider";
import GuiderLabel from "./students/label";

/**
 * NavigationAside
 */
const StudentNavigationAside = () => {
  const { view, setView } = React.useContext(GuiderContext);
  const { guider } = useSelector((state: StateType) => state);

  const { t } = useTranslation(["flags"]);
  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);
  const dispatch = useDispatch();

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

  const locationData = queryString.parse(
    document.location.hash.split("?")[1] || "",
    { arrayFormat: "bracket" }
  );

  return (
    <Navigation>
      {isMobileWidth && (
        <NavigationTopic name={t("labels.all", { ns: "users" })}>
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            isActive={view === "students"}
            onClick={() => setView("students")}
          >
            {t("labels.all", { ns: "users" })}
          </NavigationElement>
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            isActive={view === "notes"}
            onClick={() => setView("notes")}
          >
            {t("labels.tasks", { ns: "tasks" })}
          </NavigationElement>
        </NavigationTopic>
      )}
      {guider.availableFilters.labels.length > 0 && (
        <NavigationTopic name={t("labels.flags", { ns: "flags" })}>
          {guider.availableFilters.labels.map((label) => {
            const isActive = guider.activeFilters.labelFilters.includes(
              label.id
            );
            return (
              <GuiderLabel
                key={label.id}
                label={label}
                isActive={isActive}
                hash={
                  guider.activeFilters.labelFilters.includes(label.id)
                    ? queryString.stringify(
                        Object.assign({}, locationData, {
                          c: "",
                          l: (locationData.l || []).filter(
                            (i: string) => parseInt(i) !== label.id
                          ),
                        }),
                        { arrayFormat: "bracket" }
                      )
                    : queryString.stringify(
                        Object.assign({}, locationData, {
                          c: "",
                          l: (locationData.l || []).concat(label.id),
                        }),
                        { arrayFormat: "bracket" }
                      )
                }
                onRemoveCollaborators={handleRemoveCollaborators}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            );
          })}
        </NavigationTopic>
      )}

      {guider.availableFilters.workspaces.length > 0 && (
        <NavigationTopic name={t("labels.workspaces", { ns: "workspace" })}>
          {guider.availableFilters.workspaces.map((workspace) => {
            const isActive = guider.activeFilters.workspaceFilters.includes(
              workspace.id
            );
            const hash = isActive
              ? queryString.stringify(
                  Object.assign({}, locationData, {
                    c: "",
                    w: (locationData.w || []).filter(
                      (w: string) => parseInt(w) !== workspace.id
                    ),
                  }),
                  { arrayFormat: "bracket" }
                )
              : queryString.stringify(
                  Object.assign({}, locationData, {
                    c: "",
                    w: (locationData.w || []).concat(workspace.id),
                  }),
                  { arrayFormat: "bracket" }
                );
            return (
              <NavigationElement
                modifiers="aside-navigation-guider-course"
                icon="books"
                key={workspace.id}
                isActive={isActive}
                hash={"?" + hash}
              >
                {workspace.name +
                  (workspace.nameExtension
                    ? " (" + workspace.nameExtension + ")"
                    : "")}
              </NavigationElement>
            );
          })}
        </NavigationTopic>
      )}

      {guider.availableFilters.userGroups.length > 0 && (
        <NavigationTopic name={t("labels.studentGroups", { ns: "users" })}>
          {guider.availableFilters.userGroups.map((userGroup: UserGroup) => {
            const isActive = guider.activeFilters.userGroupFilters.includes(
              userGroup.id
            );
            const hash = isActive
              ? queryString.stringify(
                  Object.assign({}, locationData, {
                    c: "",
                    u: (locationData.u || []).filter(
                      (u: string) => parseInt(u) !== userGroup.id
                    ),
                  }),
                  { arrayFormat: "bracket" }
                )
              : queryString.stringify(
                  Object.assign({}, locationData, {
                    c: "",
                    u: (locationData.u || []).concat(userGroup.id),
                  }),
                  { arrayFormat: "bracket" }
                );
            return (
              <NavigationElement
                modifiers="aside-navigation-guider-user-group"
                icon="users"
                key={userGroup.id}
                isActive={isActive}
                hash={"?" + hash}
              >
                {userGroup.name}
              </NavigationElement>
            );
          })}
        </NavigationTopic>
      )}
    </Navigation>
  );
};

export default StudentNavigationAside;
