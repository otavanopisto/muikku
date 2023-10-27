import * as React from "react";
import { connect } from "react-redux";
import * as queryString from "query-string";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { WorkspacesState } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  workspaces: WorkspacesState;
}

/**
 * NavigationAsideState
 */
interface NavigationAsideState {
  published: boolean;
  unpublished: boolean;
  active: boolean;
}

/**
 * WorkspacesAside
 */
class WorkspacesAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavigationAsideProps) {
    super(props);
    this.state = {
      published: false,
      unpublished: false,
      active: false,
    };
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );

    return (
      <Navigation>
        <NavigationTopic name={t("labels.educationLevel", { ns: "workspace" })}>
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
        <NavigationTopic name={t("labels.curriculum", { ns: "workspace" })}>
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
        <NavigationTopic
          name={t("labels.workspaces", {
            ns: "workspace",
            context: "publishState",
          })}
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspaces: state.organizationWorkspaces,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common", "workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspacesAside)
);
