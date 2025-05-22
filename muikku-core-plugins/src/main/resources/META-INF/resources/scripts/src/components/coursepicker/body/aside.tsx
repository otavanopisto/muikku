import * as React from "react";
import { connect } from "react-redux";
import * as queryString from "query-string";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { WorkspacesState } from "~/reducers/workspaces";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  workspaces: WorkspacesState;
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
          name={this.props.t("labels.educationLevel", { ns: "workspace" })}
        >
          {this.props.workspaces.availableFilters.educationTypes.map(
            (educationType) => {
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
          name={this.props.t("labels.curriculum", { ns: "workspace" })}
        >
          {this.props.workspaces.availableFilters.curriculums.map(
            (curriculum) => {
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
            name={this.props.t("labels.organization", { ns: "workspace" })}
          >
            {this.props.workspaces.availableFilters.organizations.map(
              (organization) => {
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
    workspaces: state.workspaces,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
