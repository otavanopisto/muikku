import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Toolbar from "./application/toolbar";
import CoursepickerWorkspaces from "./application/courses";
import * as queryString from "query-string";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/react-select-override.scss";
import Select from "react-select";
import { StateType } from "~/reducers";
import {
  WorkspaceBaseFilterType,
  WorkspacesState,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";
import { OptionDefault } from "~/components/general/react-select/types";

type CoursepickerFilterOption = OptionDefault<WorkspaceBaseFilterType>;

/**
 * CoursepickerApplicationProps
 */
interface CoursepickerApplicationProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside: React.ReactElement<any>;
  workspaces: WorkspacesState;
  status: StatusType;
}

/**
 * CoursepickerApplicationState
 */
interface CoursepickerApplicationState {}

/**
 * CoursepickerApplication
 */
class CoursepickerApplication extends React.Component<
  CoursepickerApplicationProps,
  CoursepickerApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CoursepickerApplicationProps) {
    super(props);

    this.onCoursepickerFilterChange =
      this.onCoursepickerFilterChange.bind(this);
  }

  /**
   * onCoursepickerFilterChange
   * @param selectedOption selectedOption
   */
  onCoursepickerFilterChange(selectedOption: CoursepickerFilterOption) {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    locationData.b = selectedOption.value;
    window.location.hash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
  }

  /**
   * render
   */
  render() {
    const filterTranslationString = {
      ALL_COURSES: "all",
      MY_COURSES: "own",
      UNPUBLISHED: "unpublished",
    };

    const options: CoursepickerFilterOption[] =
      this.props.workspaces.availableFilters.baseFilters
        .map((filter: WorkspaceBaseFilterType) => {
          if (this.props.status.isStudent && filter === "UNPUBLISHED") {
            return null;
          }

          return {
            value: filter,
            label: this.props.t("labels.workspaces", {
              ns: "workspace",
              context: filterTranslationString[filter],
            }),
          } as CoursepickerFilterOption;
        })
        .filter((option) => option !== null);

    const currentSelectValue = options.find(
      (option) =>
        option.value === this.props.workspaces.activeFilters.baseFilter
    );

    const title = this.props.t("labels.coursepicker");
    const toolbar = <Toolbar />;
    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectCourses" className="visually-hidden">
          {this.props.t("labels.workspaceTypeSelect", { ns: "workspace" })}
        </label>
        {this.props.status.loggedIn ? (
          <Select<CoursepickerFilterOption>
            className="react-select-override"
            classNamePrefix="react-select-override"
            value={currentSelectValue}
            onChange={this.onCoursepickerFilterChange}
            options={options}
            styles={{
              // eslint-disable-next-line jsdoc/require-jsdoc
              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
        ) : (
          <Select<CoursepickerFilterOption>
            className="react-select-override"
            classNamePrefix="react-select-override"
            value={options[0]}
            options={[options[0]]}
            isDisabled={true}
            styles={{
              // eslint-disable-next-line jsdoc/require-jsdoc
              container: (baseStyles, state) => ({
                ...baseStyles,
                width: "100%",
              }),
            }}
          />
        )}
      </div>
    );
    return (
      <ApplicationPanel
        toolbar={toolbar}
        title={title}
        asideBefore={this.props.aside}
        primaryOption={primaryOption}
      >
        <CoursepickerWorkspaces />
      </ApplicationPanel>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(CoursepickerApplication)
);
