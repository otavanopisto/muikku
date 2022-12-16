import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import * as queryString from "query-string";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import {
  WorkspacesType,
  WorkspaceEducationFilterType,
  WorkspaceCurriculumFilterType,
  WorkspaceOrganizationFilterType,
} from "~/reducers/workspaces";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  workspaces: WorkspacesType;
  status: StatusType;
}

/**
 * NavigationAsideState
 */
interface NavigationAsideState {}

/**
 * NavigationAside
 */
class NavigationAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );

    return (
      <Navigation>
        <NavigationTopic
          // TODO: Translate this using i18next
          name={this.props.i18nOLD.text.get(
            "plugin.coursepicker.filters.title"
          )}
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
          // TODO: Translate this using i18next
          name={this.props.i18nOLD.text.get(
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
        {this.props.workspaces.availableFilters.organizations.length > 1 ? (
          <NavigationTopic
            // TODO: Translate this using i18next
            name={this.props.i18nOLD.text.get(
              "plugin.coursepicker.filters.organization"
            )}
          >
            {this.props.workspaces.availableFilters.organizations.map(
              (organization: WorkspaceOrganizationFilterType) => {
                const isActive =
                  this.props.workspaces.activeFilters.organizationFilters.includes(
                    organization.identifier
                  );
                const hash =
                  "?" +
                  (isActive
                    ? queryString.stringify(
                        Object.assign({}, locationData, {
                          o: (locationData.o || []).filter(
                            (o: string) => o !== organization.identifier
                          ),
                        }),
                        { arrayFormat: "bracket" }
                      )
                    : queryString.stringify(
                        Object.assign({}, locationData, {
                          o: (locationData.o || []).concat(
                            organization.identifier
                          ),
                        }),
                        { arrayFormat: "bracket" }
                      ));
                return (
                  <NavigationElement
                    key={organization.identifier}
                    isActive={isActive}
                    hash={hash}
                  >
                    {organization.name}
                  </NavigationElement>
                );
              }
            )}
          </NavigationTopic>
        ) : null}
      </Navigation>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    workspaces: state.workspaces,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
