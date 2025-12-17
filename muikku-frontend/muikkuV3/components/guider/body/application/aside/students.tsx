import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
  NavigationDropdown,
  DropdownWrapperProps,
} from "~/components/general/navigation";
import { UserFlag, UserGroup } from "~/generated/client";
import { GuiderContext } from "../../../context";
import { useTranslation } from "react-i18next";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { breakpoints } from "~/util/breakpoints";
import { hexToColorInt } from "~/util/modifiers";
import { GenericTag } from "~/components/general/tag-update-dialog";
import MApi, { isMApiError } from "~/api/api";

import {
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
} from "~/actions/main-function/guider";
import { displayNotification } from "~/actions/base/notifications";

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
   * translates UserFlag to GenericTag
   * @param label user flag label
   * @returns a generic tag
   */
  const translateLabelToGenericTag = (label: UserFlag): GenericTag => ({
    id: label.id,
    label: label.name,
    color: hexToColorInt(label.color),
    description: label.description,
    hasRecipients: true,
    ownerIdentifier: label.ownerIdentifier,
  });

  /**
   * Handles delete category
   * @param tag tag to be deleted
   */
  const handleDelete = (tag: GenericTag) => {
    // No action needed for guider labels
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

  const handleRemoveAllCollaborators = async (
    tag: GenericTag,
    success?: () => void,
    fail?: () => void
  ) => {
    const flagId = tag.id;
    const userApi = MApi.getUserApi();

    try {
      const collaborators = await userApi.getFlagShares({
        flagId,
      });

      await Promise.all(
        collaborators.map((c) =>
          userApi.deleteFlagShare({
            flagId,
            shareId: c.id,
          })
        )
      );

      success && success();
      dispatch(
        displayNotification("Collaborators removed successfully", "success")
      );
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      fail && fail();
      dispatch(displayNotification(e.message, "error"));
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
            const hash = isActive
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
                );
            return (
              <NavigationElement
                modifiers="aside-navigation-guider-flag"
                icon="flag"
                key={label.id}
                iconColor={label.color}
                isActive={isActive}
                hash={"?" + hash}
                editableWrapper={NavigationDropdown}
                editableWrapperArgs={
                  {
                    tag: translateLabelToGenericTag(label),
                    onDelete: handleDelete,
                    onUpdate: handleUpdate,
                    deleteDialogTitle: t("labels.remove", {
                      ns: "messaging",
                      context: "category",
                    }),
                    deleteDialogContent: t("content.removing", {
                      ns: "messaging",
                      context: "category",
                    }),
                    updateDialogTitle: t("labels.edit", {
                      ns: "messaging",
                      context: "category",
                    }),
                    editLabel: t("labels.edit"),
                    deleteLabel: t("labels.remove"),
                    customActionLabel: t("labels.removeAllCollaborators", {
                      ns: "messaging",
                    }),
                    customActionIcon: "users",
                    handleCustomAction: handleRemoveAllCollaborators,
                  } satisfies DropdownWrapperProps
                }
                isEditable
              >
                {label.name}
              </NavigationElement>
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
