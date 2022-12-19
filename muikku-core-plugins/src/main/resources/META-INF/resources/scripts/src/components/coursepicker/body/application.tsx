import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Toolbar from "./application/toolbar";
import CoursepickerWorkspaces from "./application/courses";
import { i18nType } from "~/reducers/base/i18nOLD";
import * as queryString from "query-string";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";

import { StateType } from "~/reducers";

import { WorkspaceBaseFilterType, WorkspacesType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * CoursepickerApplicationProps
 */
interface CoursepickerApplicationProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aside: React.ReactElement<any>;
  i18nOLD: i18nType;
  workspaces: WorkspacesType;
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
   * @param e e
   */
  onCoursepickerFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    locationData.b = e.target.value;
    window.location.hash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
  }

  /**
   * render
   */
  render() {
    const filterTranslationString = {
      ALL_COURSES: "plugin.coursepicker.allcourses",
      MY_COURSES: "plugin.coursepicker.owncourses",
      UNPUBLISHED: "plugin.coursepicker.unpublished",
    };

    // TODO: Translate this using i18next
    const title = this.props.i18nOLD.text.get("plugin.coursepicker.pageTitle");
    const toolbar = <Toolbar />;
    const primaryOption = (
      <div className="form-element form-element--main-action">
        <label htmlFor="selectCourses" className="visually-hidden">
          {
            // TODO: Translate this using i18next
          }
          {this.props.i18nOLD.text.get("plugin.coursepicker.select.label")}
        </label>
        {this.props.status.loggedIn ? (
          <select
            id="selectCourses"
            className="form-element__select form-element__select--main-action"
            value={this.props.workspaces.activeFilters.baseFilter}
            onChange={this.onCoursepickerFilterChange}
          >
            {this.props.workspaces.availableFilters.baseFilters.map(
              (filter: WorkspaceBaseFilterType) => {
                if (this.props.status.isStudent && filter === "UNPUBLISHED") {
                  return false;
                }
                return (
                  <option key={filter} value={filter}>
                    {
                      // TODO: Translate this using i18next
                    }
                    {this.props.i18nOLD.text.get(
                      filterTranslationString[filter]
                    )}
                  </option>
                );
              }
            )}
          </select>
        ) : (
          <select
            id="selectCourses"
            className="form-element__select form-element__select--main-action"
          >
            <option>
              {
                // TODO: Translate this using i18next
              }
              {this.props.i18nOLD.text.get("plugin.coursepicker.opencourses")}
            </option>
          </select>
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
  connect(mapStateToProps, mapDispatchToProps)(CoursepickerApplication)
);
