import * as React from "react";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { connect } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/item-list.scss";
import { GuiderState } from "~/reducers/main-function/guider";
import LabelUpdateDialog from "../dialogs/label-update";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { UserGroup } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { GuiderContext, GuiderNotesState } from "../context";
import {
  loadNotes,
  LoadNotesTriggerType,
} from "~/actions/main-function/guider";
import { StatusType } from "~/reducers/base/status";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation<["common"]> {
  loadNotes: LoadNotesTriggerType;
  guider: GuiderState;
  status: StatusType;
}

/**
 * NavigationState
 */
interface NavigationState {}

/**
 * NavigationAside
 */
class NavigationAside extends React.Component<
  NavigationProps,
  NavigationState
> {
  // These are required to make the types work in the context
  static contextType = GuiderContext;
  context!: React.ContextType<typeof GuiderContext>;

  /**
   * @param filter state filter
   */
  handleStateFilterChange = (filter: GuiderNotesState) => {
    this.props.loadNotes(this.props.status.userId, filter === "archived");
    this.context.dispatch({
      type: "SET_STATE_FILTER",
      payload: filter,
    });
  };
  /**
   * render
   */
  render() {
    const view = this.context.view;
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    if (view === "students") {
      return (
        <Navigation>
          {this.props.guider.availableFilters.labels.length > 0 && (
            <NavigationTopic
              name={this.props.i18n.t("labels.flags", { ns: "flags" })}
            >
              {this.props.guider.availableFilters.labels.map((label) => {
                const isActive =
                  this.props.guider.activeFilters.labelFilters.includes(
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

          {this.props.guider.availableFilters.workspaces.length > 0 && (
            <NavigationTopic
              name={this.props.i18n.t("labels.workspaces", { ns: "workspace" })}
            >
              {this.props.guider.availableFilters.workspaces.map(
                (workspace) => {
                  const isActive =
                    this.props.guider.activeFilters.workspaceFilters.includes(
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
                }
              )}
            </NavigationTopic>
          )}

          {this.props.guider.availableFilters.userGroups.length > 0 && (
            <NavigationTopic
              name={this.props.i18n.t("labels.studentGroups", { ns: "users" })}
            >
              {this.props.guider.availableFilters.userGroups.map(
                (userGroup: UserGroup) => {
                  const isActive =
                    this.props.guider.activeFilters.userGroupFilters.includes(
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
                }
              )}
            </NavigationTopic>
          )}
        </Navigation>
      );
    } else if (view === "notes") {
      const { state, high, normal, low } = this.context.filters;

      return (
        <Navigation>
          <NavigationTopic name={"Tila"}>
            <NavigationElement
              modifiers="aside-navigation-guider-flag"
              icon="note"
              isActive={state === "active"}
              onClick={() => this.handleStateFilterChange("active")}
            >
              {this.props.t("labels.tasks", { ns: "tasks", context: "active" })}
            </NavigationElement>
            <NavigationElement
              modifiers="aside-navigation-guider-flag"
              icon="trash"
              isActive={state === "archived"}
              onClick={() => this.handleStateFilterChange("archived")}
            >
              {this.props.t("labels.tasks", {
                ns: "tasks",
                context: "archived",
              })}
            </NavigationElement>
          </NavigationTopic>
          <NavigationTopic name={"Prioriteetti"}>
            <NavigationElement
              modifiers="aside-navigation-guider-flag"
              icon="note"
              isActive={high}
              onClick={() =>
                this.context.dispatch({
                  type: "SET_BOOLEAN_FILTER",
                  payload: "high",
                })
              }
            >
              {this.props.t("labels.priority", {
                ns: "tasks",
                context: "high",
              })}
            </NavigationElement>

            <NavigationElement
              modifiers="aside-navigation-guider-flag"
              icon="note"
              isActive={normal}
              onClick={() =>
                this.context.dispatch({
                  type: "SET_BOOLEAN_FILTER",
                  payload: "normal",
                })
              }
            >
              {this.props.t("labels.priority", {
                ns: "tasks",
                context: "normal",
              })}
            </NavigationElement>

            <NavigationElement
              modifiers="aside-navigation-guider-flag"
              icon="note"
              isActive={low}
              onClick={() =>
                this.context.dispatch({
                  type: "SET_BOOLEAN_FILTER",
                  payload: "low",
                })
              }
            >
              {this.props.t("labels.priority", {
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
  }
}

NavigationAside.contextType = GuiderContext;

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadNotes,
    },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
