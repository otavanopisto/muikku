import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/item-list.scss";
import LabelUpdateDialog from "../../../dialogs/label-update";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { UserGroup } from "~/generated/client";
import { GuiderContext, GuiderNotesState } from "../../../context";
import { useTranslation } from "react-i18next";

/**
 * NavigationAside
 */
const StudentNavigationAside = () => {
  const { view, filters, dispatch } = React.useContext(GuiderContext);
  const { status, guider } = useSelector((state: StateType) => state);
  const actionDispatch = useDispatch();
  const { t } = useTranslation(["flags"]);

  /**
   * @param filter state filter
   */
  const handleStateFilterChange = (filter: GuiderNotesState) => {
    dispatch({
      type: "SET_STATE_FILTER",
      payload: filter,
    });
  };
  /**
   * render
   */
  const locationData = queryString.parse(
    document.location.hash.split("?")[1] || "",
    { arrayFormat: "bracket" }
  );
  return (
    <Navigation>
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
                editableWrapper={LabelUpdateDialog}
                editableWrapperArgs={{ label: label }}
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
