import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/course.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/wcag.scss";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import WorkspaceSignupDialog from "../../../dialogs/workspace-signup";
import {
  WorkspaceCurriculumFilterListType,
  WorkspaceType,
} from "~/reducers/workspaces";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { AnyActionType } from "~/actions";
import { suitabilityMap } from "~/@shared/suitability";

/**
 * CourseProps
 */
interface CourseProps {
  i18nOLD: i18nType;
  status: StatusType;
  workspace: WorkspaceType;
  availableCurriculums: WorkspaceCurriculumFilterListType;
}

/**
 * CourseState
 */
interface CourseState {
  expanded: boolean;
  canSignUp?: boolean;
  loading: boolean;
}

/**
 * Course
 */
class Course extends React.Component<CourseProps, CourseState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false,
      canSignUp: undefined,
      loading: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  /**
   * Returns OPS information by curriculum identifier
   * @returns OPS information
   */
  getOPSInformation = () => {
    /**
     * If workspace and available curriculums are loaded and are present
     */
    if (this.props.workspace && this.props.availableCurriculums) {
      /**
       * Course only contains ONE active curriculum even though
       * current property is list. So we pick first item that list contains
       */
      const activeCurriculumnIdentifier =
        this.props.workspace.curriculumIdentifiers[0];

      /**
       * Then checking if we can find OPS data with that identifier from
       * available curriculums
       */
      const OPS = this.props.availableCurriculums.find(
        (aC) => aC.identifier === activeCurriculumnIdentifier
      );

      return OPS;
    } else {
      return undefined;
    }
  };

  /**
   * Depending what mandatority value is, returns description
   *
   * @returns mandatority description
   */
  renderMandatorityDescription = () => {
    /**
     * Get OPS data
     */
    const OPS = this.getOPSInformation();

    /**
     * If OPS data and workspace mandatority property is present
     */
    if (
      OPS &&
      this.props.workspace.mandatority &&
      this.props.workspace.educationTypeName
    ) {
      /**
       * Create map property from education type name and OPS name that was passed
       * Strings are changes to lowercase form and any empty spaces are removed
       */
      const education = `${this.props.workspace.educationTypeName
        .toLowerCase()
        .replace(/ /g, "")}${OPS.name.replace(/ /g, "")}`;

      /**
       * Check if our map contains data with just created education string
       * Otherwise just return null. There might not be all included values by every OPS created...
       */
      if (!suitabilityMap.has(education)) {
        return null;
      }

      /**
       * Then get correct local string from map by suitability enum value
       */
      const localString =
        suitabilityMap.get(education)[this.props.workspace.mandatority];

      return ` (${this.props.i18nOLD.text.get(localString)})`;
    }
  };

  /**
   * Toggles course body to expanding
   */
  async toggleExpanded() {
    /**
     * If we already have fetched signUp requirements
     * no need to get data again
     */
    if (this.state.canSignUp !== undefined) {
      this.setState({
        expanded: !this.state.expanded,
      });
    } else {
      /**
       * Otherwise we get requested data from api
       */
      this.setState({
        loading: true,
      });

      const canSignUp = await this.checkSignUpStatus();

      /**
       * Timeout for lazier loading because
       * otherwise it will flick loader-spinner
       */
      setTimeout(() => {
        this.setState({
          expanded: true,
          canSignUp,
          loading: false,
        });
      }, 500);
    }
  }

  /**
   * Sends api request to Api which returns data if
   * user can signUp for course or is already member of
   * the course
   *
   * @returns Requirements object
   */
  checkSignUpStatus = async (): Promise<boolean> =>
    (await promisify(
      mApi().coursepicker.workspaces.canSignup.read(this.props.workspace.id),
      "callback"
    )()) as boolean;

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const hasFees = this.props.status.hasFees;

    return (
      <ApplicationListItem
        className={`course ${this.state.expanded ? "course--open" : ""}`}
      >
        <ApplicationListItemHeader
          className="application-list__item-header--course"
          onClick={this.toggleExpanded}
        >
          <span
            className={`application-list__header-icon icon-books ${
              !this.props.workspace.published ? "state-UNPUBLISHED" : ""
            }`}
          ></span>
          <span className="application-list__header-primary">
            {this.props.workspace.name}
            {this.props.workspace.nameExtension
              ? ` (${this.props.workspace.nameExtension})`
              : null}
            {this.renderMandatorityDescription()}
          </span>
          {hasFees ? (
            <span
              className="application-list__fee-indicatoricon-coin-euro icon-coin-euro"
              title={this.props.i18nOLD.text.get(
                "plugin.coursepicker.course.evaluationhasfee"
              )}
            />
          ) : null}
          <span className="application-list__header-secondary">
            {this.props.workspace.educationTypeName}
          </span>
        </ApplicationListItemHeader>
        {!this.state.loading && this.state.expanded ? (
          <div>
            <ApplicationListItemBody
              content={this.props.workspace.description}
              className="application-list__item-body--course"
            />
            <ApplicationListItemFooter className="application-list__item-footer--course">
              <Button
                aria-label={this.props.workspace.name}
                buttonModifiers={[
                  "primary-function-content ",
                  "coursepicker-course-action",
                ]}
                href={`${this.props.status.contextPath}/workspace/${this.props.workspace.urlName}`}
              >
                {this.props.workspace.isCourseMember
                  ? this.props.i18nOLD.text.get(
                      "plugin.coursepicker.course.goto"
                    )
                  : this.props.i18nOLD.text.get(
                      "plugin.coursepicker.course.checkout"
                    )}
              </Button>
              {this.state.canSignUp && this.props.status.loggedIn ? (
                <WorkspaceSignupDialog
                  workspace={this.props.workspace}
                  workspaceSignUpDetails={{
                    id: this.props.workspace.id,
                    name: this.props.workspace.name,
                    nameExtension: this.props.workspace.nameExtension,
                    urlName: this.props.workspace.urlName,
                  }}
                >
                  <Button
                    aria-label={this.props.workspace.name}
                    buttonModifiers={[
                      "primary-function-content",
                      "coursepicker-course-action",
                    ]}
                  >
                    {this.props.i18nOLD.text.get(
                      "plugin.coursepicker.course.signup"
                    )}
                  </Button>
                </WorkspaceSignupDialog>
              ) : null}
            </ApplicationListItemFooter>
          </div>
        ) : (
          this.state.loading && <div className="loader-empty" />
        )}
      </ApplicationListItem>
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
    status: state.status,
    availableCurriculums: state.workspaces.availableFilters.curriculums,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Course);
