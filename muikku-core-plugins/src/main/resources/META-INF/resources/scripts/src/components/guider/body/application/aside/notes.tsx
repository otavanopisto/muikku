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
import { loadNotes } from "~/actions/main-function/guider";
import { useTranslation } from "react-i18next";

/**
 * Note NavigationAside
 */
const NoteNavigationAside = () => {
  // These are required to make the types work in the context
  const { view, filters, dispatch } = React.useContext(GuiderContext);
  const { status, guider } = useSelector((state: StateType) => state);
  const actionDispatch = useDispatch();
  const { t } = useTranslation(["flags"]);
  /**
   * @param filter state filter
   */
  const handleStateFilterChange = (filter: GuiderNotesState) => {
    actionDispatch(loadNotes(status.userId, filter === "archived"));
    dispatch({
      type: "SET_STATE_FILTER",
      payload: filter,
    });
  };

  const locationData = queryString.parse(
    document.location.hash.split("?")[1] || "",
    { arrayFormat: "bracket" }
  );
  if (view === "students") {
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
  } else if (view === "notes") {
    const { state, high, normal, low } = filters;

    return (
      <Navigation>
        <NavigationTopic
          name={t("labels.status", {
            ns: "tasks",
          })}
        >
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            icon="note"
            isActive={state === "active"}
            onClick={() => handleStateFilterChange("active")}
          >
            {t("labels.tasks", { ns: "tasks", context: "active" })}
          </NavigationElement>
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            icon="trash"
            isActive={state === "archived"}
            onClick={() => handleStateFilterChange("archived")}
          >
            {t("labels.tasks", {
              ns: "tasks",
              context: "archived",
            })}
          </NavigationElement>
        </NavigationTopic>
        <NavigationTopic
          name={t("labels.priority", {
            ns: "tasks",
          })}
        >
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            icon="note"
            isActive={high}
            onClick={() =>
              dispatch({
                type: "SET_BOOLEAN_FILTER",
                payload: "high",
              })
            }
          >
            {t("labels.priority", {
              ns: "tasks",
              context: "high",
            })}
          </NavigationElement>
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            icon="note"
            isActive={normal}
            onClick={() =>
              dispatch({
                type: "SET_BOOLEAN_FILTER",
                payload: "normal",
              })
            }
          >
            {t("labels.priority", {
              ns: "tasks",
              context: "normal",
            })}
          </NavigationElement>
          <NavigationElement
            modifiers="aside-navigation-guider-flag"
            icon="note"
            isActive={low}
            onClick={() =>
              dispatch({
                type: "SET_BOOLEAN_FILTER",
                payload: "low",
              })
            }
          >
            {t("labels.priority", {
              ns: "tasks",
              context: "low",
            })}
          </NavigationElement>
        </NavigationTopic>
      </Navigation>
    );
  } else {
    return null;
  }
};

export default NoteNavigationAside;
