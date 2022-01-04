import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import * as queryString from "query-string";
import "~/sass/elements/item-list.scss";
import {
  GuiderUserLabelType,
  GuiderWorkspaceType,
  GuiderType
} from "~/reducers/main-function/guider";
import { UserGroupType } from "~/reducers/user-index";
import LabelUpdateDialog from "../dialogs/label-update";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement
} from "~/components/general/navigation";

interface NavigationProps {
  i18n: i18nType;
  guider: GuiderType;
}

interface NavigationState {}

class NavigationAside extends React.Component<
  NavigationProps,
  NavigationState
> {
  render() {
    let locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    return (
      <Navigation>
        {this.props.guider.availableFilters.labels.length !== 0 ? (
          <NavigationTopic
            name={this.props.i18n.text.get("plugin.guider.filters.flags")}
          >
            {this.props.guider.availableFilters.labels.map(
              (label: GuiderUserLabelType) => {
                let isActive =
                  this.props.guider.activeFilters.labelFilters.includes(
                    label.id
                  );
                let hash = isActive
                  ? queryString.stringify(
                      Object.assign({}, locationData, {
                        c: "",
                        l: (locationData.l || []).filter(
                          (i: string) => parseInt(i) !== label.id
                        )
                      }),
                      { arrayFormat: "bracket" }
                    )
                  : queryString.stringify(
                      Object.assign({}, locationData, {
                        c: "",
                        l: (locationData.l || []).concat(label.id)
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
              }
            )}
          </NavigationTopic>
        ) : null}
        <NavigationTopic
          name={this.props.i18n.text.get("plugin.guider.filters.workspaces")}
        >
          {this.props.guider.availableFilters.workspaces.map(
            (workspace: GuiderWorkspaceType) => {
              let isActive =
                this.props.guider.activeFilters.workspaceFilters.includes(
                  workspace.id
                );
              let hash = isActive
                ? queryString.stringify(
                    Object.assign({}, locationData, {
                      c: "",
                      w: (locationData.w || []).filter(
                        (w: string) => parseInt(w) !== workspace.id
                      )
                    }),
                    { arrayFormat: "bracket" }
                  )
                : queryString.stringify(
                    Object.assign({}, locationData, {
                      c: "",
                      w: (locationData.w || []).concat(workspace.id)
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
        <NavigationTopic
          name={this.props.i18n.text.get("plugin.guider.filters.userGroups")}
        >
          {this.props.guider.availableFilters.userGroups.map(
            (userGroup: UserGroupType) => {
              let isActive =
                this.props.guider.activeFilters.userGroupFilters.includes(
                  userGroup.id
                );
              let hash = isActive
                ? queryString.stringify(
                    Object.assign({}, locationData, {
                      c: "",
                      u: (locationData.u || []).filter(
                        (u: string) => parseInt(u) !== userGroup.id
                      )
                    }),
                    { arrayFormat: "bracket" }
                  )
                : queryString.stringify(
                    Object.assign({}, locationData, {
                      c: "",
                      u: (locationData.u || []).concat(userGroup.id)
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
      </Navigation>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
