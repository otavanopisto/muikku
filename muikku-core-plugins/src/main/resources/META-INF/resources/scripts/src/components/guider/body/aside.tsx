import * as React from "react";
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
import { GuiderContext } from "../context";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation<["common"]> {
  guider: GuiderState;
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
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
