import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { GuiderContext, GuiderNotesState } from "../../../context";
import { loadNotes } from "~/actions/main-function/guider";
import { useTranslation } from "react-i18next";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { breakpoints } from "~/util/breakpoints";

/**
 * Note NavigationAside
 */
const NoteNavigationAside = () => {
  // These are required to make the types work in the context
  const { view, filters, dispatch, setView } = React.useContext(GuiderContext);
  const { status } = useSelector((state: StateType) => state);
  const actionDispatch = useDispatch();
  const { t } = useTranslation(["flags"]);
  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);
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

  const { state, high, normal, low } = filters;

  return (
    <Navigation>
      {isMobileWidth && (
        <NavigationTopic name={t("labels.view", { ns: "guider" })}>
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
};
export default NoteNavigationAside;
