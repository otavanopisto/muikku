import * as React from "react";
import { connect } from "react-redux";
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
  ApplicationListItemContentContainer,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import WorkspaceSignupDialog from "../../../dialogs/workspace-signup";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { AnyActionType } from "~/actions";
import { suitabilityMapHelper } from "~/@shared/suitability";
import {
  Curriculum,
  StudyActivityItem,
  WorkspaceAssessmentState,
} from "~/generated/client";
import MApi from "~/api/api";
import { WithTranslation, withTranslation } from "react-i18next";
import AssessmentRequestIndicator from "~/components/general/records-history/assessment-request-indicator";
import RecordsAssessmentIndicator from "~/components/general/records-history/records-assessment-indicator";
import { Action, Dispatch } from "redux";

/**
 * CourseProps
 */
interface CourseProps extends WithTranslation<["common"]> {
  status: StatusType;
  workspace: WorkspaceDataType;
  availableCurriculums: Curriculum[];
  studyActivityItems: StudyActivityItem[];
}

/**
 * CourseState
 */
interface CourseState {
  expanded: boolean;
  canSignUp?: boolean;
  assessmentStates: WorkspaceAssessmentState[];
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
      assessmentStates: [],
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
      const suitabilityMap = suitabilityMapHelper(this.props.t);

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
      if (!suitabilityMap[education]) {
        return null;
      }

      /**
       * Then get correct local string from map by suitability enum value
       */
      const localString =
        suitabilityMap[education][this.props.workspace.mandatority];

      const courseLength = this.props.workspace.courseLength;
      const courseLengthSymbol = this.props.workspace.courseLengthSymbol;

      // If course length and course length symbol are present, add them to the string
      if (courseLength && courseLengthSymbol) {
        return ` (${localString}, ${courseLength} ${courseLengthSymbol})`;
      }

      return ` (${localString})`;
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
      // If user is student, we need to check if student can signUp for course
      // else we just expand course body
      if (this.props.status.isStudent) {
        this.setState({
          loading: true,
        });

        const workspaceCanSignup = await this.checkSignUpStatus();
        /**
         * Timeout for lazier loading because
         * otherwise it will flick loader-spinner
         */
        setTimeout(() => {
          this.setState({
            expanded: true,
            canSignUp: workspaceCanSignup.canSignup,
            assessmentStates: workspaceCanSignup.assessmentStates,
            loading: false,
          });
        }, 500);
      } else {
        this.setState({
          expanded: true,
          canSignUp: false,
        });
      }
    }
  }

  /**
   * Sends api request to Api which returns data if
   * user can signUp for course or is already member of
   * the course
   *
   * @returns boolean whether user can signUp or not
   */
  checkSignUpStatus = () => {
    const coursepickerApi = MApi.getCoursepickerApi();

    return coursepickerApi.workspaceCanSignUp({
      workspaceId: this.props.workspace.id,
    });
  };

  /**
   * handleCourseKeyDown
   * @param e e
   */
  handleCourseKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.toggleExpanded();
    }
  };

  /**
   * Renders assessment states
   */
  renderAssessmentStates = () => {
    // If there are no assessment states, there is nothing to show
    if (this.props.studyActivityItems.length === 0) return null;

    // Checking if workspace has more than 1 module and therefore it is combination workspace
    const isCombinationWorkspace = this.props.studyActivityItems.length > 1;

    // Rendering goes differently if workspace is combination workspace and has assessments done for the modules
    if (isCombinationWorkspace) {
      // Checking if workspace is combination workspace and if any of it's modules
      // has been assessed as incomplete or any module has grade/passingGrade set
      const combinationWorkspaceModulesHasAssessment =
        this.props.studyActivityItems.find(
          (studyActivityItem) =>
            studyActivityItem.state === "PENDING" ||
            studyActivityItem.state === "SUPPLEMENTATIONREQUEST" ||
            (studyActivityItem.grade && studyActivityItem.passing)
        );
      if (combinationWorkspaceModulesHasAssessment === undefined) {
        return null;
      }

      const elements = this.props.studyActivityItems.map(
        (studyActivityItem, index) => {
          if (
            studyActivityItem.state === "PENDING" ||
            studyActivityItem.state === "SUPPLEMENTATIONREQUEST" ||
            (studyActivityItem.grade && studyActivityItem.passing)
          ) {
            const subjectCode = studyActivityItem.subject;
            const courseNumber = studyActivityItem.courseNumber;

            let subjectCodeString = "";

            if (subjectCode) {
              subjectCodeString += subjectCode;
            }

            if (courseNumber) {
              subjectCodeString += courseNumber;
            }

            return (
              <div
                key={index}
                className="application-list__item-content-single-item"
              >
                {subjectCodeString && (
                  <span className="application-list__item-content-single-item-primary">
                    {subjectCodeString} -{" "}
                    {this.props.t("labels.courseCompletionStatus", {
                      ns: "workspace",
                    })}
                  </span>
                )}

                <AssessmentRequestIndicator
                  studyActivityItem={studyActivityItem}
                />
                <RecordsAssessmentIndicator
                  studyActivityItem={studyActivityItem}
                  isCombinationWorkspace={true}
                />
              </div>
            );
          }
        }
      );

      return (
        <ApplicationListItemContentContainer modifiers="course-assessments">
          {elements}
        </ApplicationListItemContentContainer>
      );
    }

    // For non-combination workspace
    const studyActivityItem = this.props.studyActivityItems[0];

    if (
      studyActivityItem.state === "SUPPLEMENTATIONREQUEST" ||
      (studyActivityItem.grade && studyActivityItem.passing)
    ) {
      return (
        <ApplicationListItemContentContainer modifiers="course-assessments">
          <div className="application-list__item-content-single-item">
            <span className="application-list__item-content-single-item-primary">
              {this.props.t("labels.courseCompletionStatus", {
                ns: "workspace",
              })}
            </span>
            <AssessmentRequestIndicator studyActivityItem={studyActivityItem} />

            <RecordsAssessmentIndicator
              studyActivityItem={studyActivityItem}
              isCombinationWorkspace={false}
            />
          </div>
        </ApplicationListItemContentContainer>
      );
    }

    return null;
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const hasFees = this.props.status.hasFees;

    return (
      <ApplicationListItem
        tabIndex={-1}
        className={`course ${this.state.expanded ? "course--open" : ""}`}
      >
        <ApplicationListItemHeader
          tabIndex={0}
          role="button"
          className="application-list__item-header--course"
          onClick={this.toggleExpanded}
          onKeyDown={this.handleCourseKeyDown}
          aria-label={
            this.state.expanded
              ? this.props.t("wcag.expandWorkspaceInfo", {
                  ns: "workspace",
                  workspaceName: this.props.workspace.name,
                })
              : this.props.t("wcag.collapseWorkspaceInfo", {
                  ns: "workspace",
                  workspaceName: this.props.workspace.name,
                })
          }
          aria-expanded={this.state.expanded}
          aria-controls={"workspace" + this.props.workspace.id}
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
              title={this.props.t("labels.hasEvaluationFee", {
                ns: "workspace",
              })}
            />
          ) : null}
          <span className="application-list__header-secondary">
            {this.props.workspace.educationTypeName}
          </span>
        </ApplicationListItemHeader>
        {!this.state.loading && this.state.expanded ? (
          <div id={"workspace" + this.props.workspace.id}>
            <ApplicationListItemBody
              content={this.props.workspace.description}
              className="application-list__item-body--course"
            />
            {this.renderAssessmentStates()}
            <ApplicationListItemFooter className="application-list__item-footer--course">
              <Button
                aria-label={this.props.t("wcag.continueWorkspace", {
                  ns: "workspace",
                  workspaceName: this.props.workspace.name,
                })}
                buttonModifiers={[
                  "primary-function-content ",
                  "coursepicker-course-action",
                ]}
                href={`${this.props.status.contextPath}/workspace/${this.props.workspace.urlName}`}
              >
                {this.props.workspace.isCourseMember
                  ? this.props.t("actions.continue", { ns: "workspace" })
                  : this.props.t("actions.checkOut", { ns: "workspace" })}
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
                  redirectOnSuccess
                >
                  <Button
                    aria-label={this.props.t("wcag.signUpWorkspace", {
                      ns: "workspace",
                      workspaceName: this.props.workspace.name,
                    })}
                    buttonModifiers={[
                      "primary-function-content",
                      "coursepicker-course-action",
                    ]}
                  >
                    {this.props.t("actions.signUp", { ns: "workspace" })}{" "}
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
    status: state.status,
    availableCurriculums: state.workspaces.availableFilters.curriculums,
    studyActivities: state.studyActivity.userStudyActivity,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(Course)
);
