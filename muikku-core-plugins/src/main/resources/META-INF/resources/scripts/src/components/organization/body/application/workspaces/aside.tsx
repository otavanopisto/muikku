import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import * as queryString from "query-string";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import {
  WorkspacesType,
  WorkspaceEducationFilterType,
  WorkspaceCurriculumFilterType,
} from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";

interface NavigationAsideProps {
  i18n: i18nType;
  workspaces: WorkspacesType;
}

interface NavigationAsideState {
  published: boolean;
  unpublished: boolean;
  active: boolean;
}

class WorkspacesAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  constructor(props: NavigationAsideProps) {
    super(props);
    this.state = {
      published: false,
      unpublished: false,
      active: false,
    };
  }

  render() {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    return (
      <Navigation>
        <NavigationTopic
          name={this.props.i18n.text.get("plugin.coursepicker.filters.title")}
        >
          {this.props.workspaces.availableFilters.educationTypes.map(
            (educationType: WorkspaceEducationFilterType) => {
              const isActive =
                this.props.workspaces.activeFilters.educationFilters.includes(
                  educationType.identifier
                );
              const hash =
                "?" +
                (isActive
                  ? queryString.stringify(
                      Object.assign({}, locationData, {
                        e: (locationData.e || []).filter(
                          (i: string) => i !== educationType.identifier
                        ),
                      }),
                      { arrayFormat: "bracket" }
                    )
                  : queryString.stringify(
                      Object.assign({}, locationData, {
                        e: (locationData.e || []).concat(
                          educationType.identifier
                        ),
                      }),
                      { arrayFormat: "bracket" }
                    ));
              return (
                <NavigationElement
                  key={educationType.identifier}
                  isActive={isActive}
                  hash={hash}
                >
                  {educationType.name}
                </NavigationElement>
              );
            }
          )}
        </NavigationTopic>
        <NavigationTopic
          name={this.props.i18n.text.get(
            "plugin.coursepicker.filters.curriculum"
          )}
        >
          {this.props.workspaces.availableFilters.curriculums.map(
            (curriculum: WorkspaceCurriculumFilterType) => {
              const isActive =
                this.props.workspaces.activeFilters.curriculumFilters.includes(
                  curriculum.identifier
                );
              const hash =
                "?" +
                (isActive
                  ? queryString.stringify(
                      Object.assign({}, locationData, {
                        c: (locationData.c || []).filter(
                          (c: string) => c !== curriculum.identifier
                        ),
                      }),
                      { arrayFormat: "bracket" }
                    )
                  : queryString.stringify(
                      Object.assign({}, locationData, {
                        c: (locationData.c || []).concat(curriculum.identifier),
                      }),
                      { arrayFormat: "bracket" }
                    ));
              return (
                <NavigationElement
                  key={curriculum.identifier}
                  isActive={isActive}
                  hash={hash}
                >
                  {curriculum.name}
                </NavigationElement>
              );
            }
          )}
        </NavigationTopic>
        <NavigationTopic
          name={this.props.i18n.text.get(
            "plugin.organization.filters.published.title"
          )}
        >
          {this.props.workspaces.availableFilters.stateFilters.map(
            (stateFilter) => {
              const isActive =
                this.props.workspaces.activeFilters.stateFilters.includes(
                  stateFilter.identifier
                );
              const hash =
                "?" +
                (isActive
                  ? queryString.stringify(
                      Object.assign({}, locationData, {
                        p: (locationData.p || []).filter(
                          (i: string) => i !== stateFilter.identifier
                        ),
                      }),
                      { arrayFormat: "bracket" }
                    )
                  : queryString.stringify(
                      Object.assign({}, locationData, {
                        p: (locationData.p || []).concat(
                          stateFilter.identifier
                        ),
                      }),
                      { arrayFormat: "bracket" }
                    ));
              return (
                <NavigationElement
                  key={stateFilter.name}
                  isActive={isActive}
                  hash={hash}
                >
                  {stateFilter.name}
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
    workspaces: state.organizationWorkspaces,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspacesAside);
