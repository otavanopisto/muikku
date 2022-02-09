import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import {
  WorkspaceType,
  Assessment,
  WorkspaceActivityType,
  WorkspaceForumStatisticsType,
} from "~/reducers/workspaces";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import Dropdown from "~/components/general/dropdown";
import WorkspaceChart from "./workspace/workspace-chart";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/workspace-activity.scss";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";

/**
 * StudentWorkspaceProps
 */
interface StudentWorkspaceProps {
  i18n: i18nType;
  workspace: WorkspaceType;
}

/**
 * StudentWorkspaceState
 */
interface StudentWorkspaceState {
  activitiesVisible: boolean;
}

/**
 * StudentWorkspace
 */
class StudentWorkspace extends React.Component<
  StudentWorkspaceProps,
  StudentWorkspaceState
> {
  /**
   * Constructor method
   * @param props props
   */
  constructor(props: StudentWorkspaceProps) {
    super(props);

    this.state = {
      activitiesVisible: false,
    };

    this.handleToggleActivitiesVisibleClick =
      this.handleToggleActivitiesVisibleClick.bind(this);
  }

  /**
   * Show workspace percent if any of subject in assessment list doesn't have grade or
   * is in "incomplete" state
   * @param assessments assessments
   */
  showWorkspacePercents = (assessments?: Assessment[]) => {
    if (assessments) {
      for (const assessment of assessments) {
        if (!assessment.grade || assessment.state === "incomplete") {
          return true;
        }
      }
    }

    return false;
  };

  /**
   * getAssessmentStateTextAndClassModifier
   * @param assessment assessment
   * @returns object containing state text and class modifier
   */
  getAssessmentStateTextAndClassModifier = (assessment: Assessment) => {
    let stateText;
    let extraClasses = "";

    switch (assessment.state) {
      case "pending":
      case "pending_pass":
      case "pending_fail":
        stateText = "plugin.guider.assessmentState.PENDING";
        extraClasses = "state-PENDING";
        break;
      case "pass":
        stateText = "plugin.guider.assessmentState.PASS";
        extraClasses = "state-PASSED";
        break;
      case "fail":
        stateText = "plugin.guider.assessmentState.FAIL";
        extraClasses = "state-FAILED";
        break;
      case "incomplete":
        stateText = "plugin.guider.assessmentState.INCOMPLETE";
        extraClasses = "state-INCOMPLETE";
        break;
      default:
        stateText = "plugin.guider.assessmentState.UNASSESSED";
        break;
    }

    return {
      stateText,
      extraClasses,
    };
  };

  /**
   * toggleActivitiesVisible
   */
  handleToggleActivitiesVisibleClick() {
    this.setState({
      activitiesVisible: !this.state.activitiesVisible,
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { workspace } = this.props;

    // By default every workspace is not combination
    let isCombinationWorkspace = false;

    if (workspace.subjects) {
      // If assessmentState contains more than 1 items, then its is combination
      isCombinationWorkspace = workspace.subjects.length > 1;
    }

    // By default this is undefined so ApplicationListItemHeader won't get empty list
    // item as part of its modifiers when course is non combined version
    let applicationListWorkspaceTypeMod = undefined;

    if (isCombinationWorkspace) {
      applicationListWorkspaceTypeMod = "combination-course";
    }

    /**
     * Renders combination subject assessesments
     * @param assessments assessments
     * @returns JSX.Element
     */
    const renderCombinationSubjectAssessments = () => (
      <ApplicationListItemContentContainer modifiers="combination-course">
        {this.props.workspace.activity.assessmentState.map((a) => {
          /**
           * Find subject data, that contains basic information about that subject
           */
          const subjectData = workspace.subjects.find(
            (s) => s.identifier === a.workspaceSubjectIdentifier
          );

          /**
           * If not found, return nothing
           */
          if (!subjectData) {
            return;
          }

          return (
            <div
              className="application-list__item-content-single-item"
              key={a.workspaceSubjectIdentifier}
            >
              <span className="application-list__item-content-single-item-primary">
                {subjectData.subject.code.toUpperCase()} -{" "}
                {subjectData.subject.name} ({subjectData.courseLength}
                {subjectData.courseLengthSymbol.symbol})
              </span>

              <GuiderAssessment i18n={this.props.i18n} assessment={a} />
            </div>
          );
        })}
      </ApplicationListItemContentContainer>
    );

    /**
     * Render Course activity data like assessment date and text descriping its state
     * @returns JSX.Element
     */
    const renderCourseActivity = () => (
      <div className="application-sub-panel__item application-sub-panel__item--course-activity">
        <div className="application-sub-panel__item-title">
          {this.props.i18n.text.get("plugin.guider.assessmentStateLabel")}
        </div>
        <div className="application-sub-panel__item-data">
          {this.props.workspace.activity.assessmentState.map((a) => {
            /**
             * Find subject data, that contains basic information about that subject
             */
            const subjectData = workspace.subjects.find(
              (s) => s.identifier === a.workspaceSubjectIdentifier
            );

            /**
             * If not found, return nothing
             */
            if (!subjectData) {
              return;
            }

            const stateInfo = this.getAssessmentStateTextAndClassModifier(a);

            /**
             * State text by default
             */
            let resultingStateText = this.props.i18n.text.get(
              stateInfo.stateText
            );

            /**
             * Add date to string if date is present
             */
            if (a.date) {
              resultingStateText += " - " + this.props.i18n.time.format(a.date);
            }

            return (
              <span
                key={a.workspaceSubjectIdentifier}
                className="application-sub-panel__single-entry"
              >
                {isCombinationWorkspace && `(${subjectData.subject.code}) `}
                {resultingStateText}
              </span>
            );
          })}
        </div>
      </div>
    );

    return (
      <ApplicationListItem
        className={`course ${
          this.state.activitiesVisible ? "course--open" : ""
        }`}
      >
        <ApplicationListItemHeader
          modifiers={
            applicationListWorkspaceTypeMod
              ? ["course", applicationListWorkspaceTypeMod]
              : ["course"]
          }
          onClick={this.handleToggleActivitiesVisibleClick}
        >
          <span className="application-list__header-icon icon-books"></span>
          <span className="application-list__header-primary">
            {workspace.name}
            {workspace.nameExtension
              ? "(" + workspace.nameExtension + ")"
              : null}
          </span>
          <span className="application-list__header-secondary workspace-activity">
            <span className="workspace-student__assessment-state">
              {/**
               * Show percent if method return true
               */}
              {this.showWorkspacePercents(
                this.props.workspace.activity.assessmentState
              ) ? (
                <span className="application-list__header-secondary">
                  <GuiderWorkspacePercents
                    i18n={this.props.i18n}
                    activity={this.props.workspace.activity}
                  />

                  {!isCombinationWorkspace ? (
                    /**
                     * Only show assessment in header line if its not combination workspace
                     */
                    <GuiderAssessment
                      i18n={this.props.i18n}
                      assessment={
                        this.props.workspace.activity.assessmentState[0]
                      }
                    />
                  ) : null}
                </span>
              ) : null}
            </span>
          </span>
          <Dropdown
            persistent
            modifier={"workspace-chart workspace-" + workspace.id}
            items={[<WorkspaceChart workspace={workspace} />]}
          >
            <span className="icon-statistics chart__activator chart__activator--workspace-chart"></span>
          </Dropdown>
        </ApplicationListItemHeader>

        {/**
         * Only shows list of assessments here if its comibinations workspace
         */}
        {isCombinationWorkspace ? renderCombinationSubjectAssessments() : null}

        {this.state.activitiesVisible ? (
          <div className="application-sub-panel text">
            <div className="application-sub-panel__body">
              {renderCourseActivity()}

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfVisits"
                givenDateAttributeLocale="plugin.guider.user.details.lastVisit"
                labelTranslationString="plugin.guider.visitedLabel"
                conditionalAttribute="numVisits"
                givenDateAttribute="lastVisit"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfJournalEntries"
                givenDateAttributeLocale="plugin.guider.user.details.lastJournalEntry"
                labelTranslationString="plugin.guider.journalEntriesLabel"
                conditionalAttribute="journalEntryCount"
                givenDateAttribute="lastJournalEntry"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceForumStatisticsType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfMessages"
                givenDateAttributeLocale="plugin.guider.user.details.lastMessage"
                labelTranslationString="plugin.guider.discussion-messagesLabel"
                conditionalAttribute="messageCount"
                givenDateAttribute="latestMessage"
                mainAttribute="forumStatistics"
                {...this.props}
              />

              <h4 className="application-sub-panel__item-header">
                {this.props.i18n.text.get("plugin.guider.assignmentsLabel")}
              </h4>

              <CourseActivityRow<WorkspaceActivityType>
                labelTranslationString="plugin.guider.unansweredAssignmentsLabel"
                conditionalAttribute="evaluablesUnanswered"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfAnsweredAssignments"
                givenDateAttributeLocale="plugin.guider.user.details.lastAnsweredAssignment"
                labelTranslationString="plugin.guider.answeredAssignmentsLabel"
                conditionalAttribute="evaluablesAnswered"
                givenDateAttribute="evaluablesAnsweredLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfSubmittedAssignments"
                givenDateAttributeLocale="plugin.guider.user.details.lastSubmittedAssignment"
                labelTranslationString="plugin.guider.submittedAssignmentsLabel"
                conditionalAttribute="evaluablesSubmitted"
                givenDateAttribute="evaluablesSubmittedLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfEvaluationFailed"
                givenDateAttributeLocale="plugin.guider.user.details.lastEvaluationFailed"
                labelTranslationString="plugin.guider.failedAssingmentsLabel"
                conditionalAttribute="evaluablesFailed"
                givenDateAttribute="evaluablesFailedLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfEvaluationPassed"
                givenDateAttributeLocale="plugin.guider.user.details.lastEvaluationPassed"
                labelTranslationString="plugin.guider.passedAssingmentsLabel"
                conditionalAttribute="evaluablesPassed"
                givenDateAttribute="evaluablesPassedLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <h4 className="application-sub-panel__item-header">
                {this.props.i18n.text.get("plugin.guider.exercisesLabel")}
              </h4>

              <CourseActivityRow<WorkspaceActivityType>
                labelTranslationString="plugin.guider.unansweredExercisesLabel"
                conditionalAttribute="exercisesUnanswered"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivityType>
                conditionalAttributeLocale="plugin.guider.user.details.numberOfAnsweredExercises"
                givenDateAttributeLocale="plugin.guider.user.details.lastAnsweredExercise"
                labelTranslationString="plugin.guider.answeredExercisesLabel"
                conditionalAttribute="exercisesAnswered"
                givenDateAttribute="exercisesAnsweredLastDate"
                mainAttribute="activity"
                {...this.props}
              />
            </div>
          </div>
        ) : null}
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentWorkspace);

// Other component used only by Workspace component

/**
 * CourseActivityRowProps
 */
interface CourseActivityRowProps<C> {
  i18n: i18nType;
  workspace: WorkspaceType;
  labelTranslationString: string;
  conditionalAttribute: keyof C;
  conditionalAttributeLocale?: string;
  givenDateAttribute?: string;
  givenDateAttributeLocale?: string;
  /**
   * mainAttribute is type as WorkspaceType as component is not used any where else
   */
  mainAttribute: keyof WorkspaceType;
}

/**
 * CourseActivityRow
 * @param props props
 * @returns JSX.Element
 */
const CourseActivityRow = <C,>(props: CourseActivityRowProps<C>) => {
  let output = "-";

  const { mainAttribute, conditionalAttribute } = props;

  const workspace = props.workspace;

  /**
   * "Any" type should not be used and should be fixed. As now there currently is no better solution.
   * Tho more generic precise props still help use component more typescript precise
   */
  if (((workspace[mainAttribute] as any)[conditionalAttribute] as number) > 0) {
    if (props.conditionalAttributeLocale) {
      output = props.i18n.text.get(
        props.conditionalAttributeLocale,
        (props.workspace[props.mainAttribute] as any)[
          props.conditionalAttribute
        ]
      );
    } else {
      output = (props.workspace as any)[props.mainAttribute][
        props.conditionalAttribute
      ];
    }

    if (props.givenDateAttribute) {
      output += ", ";

      if (props.givenDateAttributeLocale) {
        output += props.i18n.text.get(
          props.givenDateAttributeLocale,
          props.i18n.time.format(
            (props.workspace as any)[props.mainAttribute][
              props.givenDateAttribute
            ]
          )
        );
      } else {
        output += props.i18n.time.format(
          (props.workspace as any)[props.mainAttribute][
            props.givenDateAttribute
          ]
        );
      }
    }
  }
  return (
    <div className="application-sub-panel__item application-sub-panel__item--course-activity">
      <div className="application-sub-panel__item-title">
        {props.i18n.text.get(props.labelTranslationString)}
      </div>
      <div className="application-sub-panel__item-data">
        <span className="application-sub-panel__single-entry">{output}</span>
      </div>
    </div>
  );
};

/**
 * GuiderAssessmentProps
 */
interface GuiderAssessmentProps {
  assessment?: Assessment;
  i18n: i18nType;
}

/**
 * GuiderAssessment
 * @param props component prosp
 * @returns JSX.Element
 */
const GuiderAssessment: React.FC<GuiderAssessmentProps> = (props) => {
  const { assessment, i18n } = props;

  if (assessment) {
    if (assessment.grade) {
      const modifier =
        assessment.state === "pass" || assessment.state === "pending_pass"
          ? "state-PASSED"
          : "state-FAILED";

      return (
        <span
          title={
            i18n.text.get(
              "plugin.guider.evaluated",
              i18n.time.format(assessment.date)
            ) + getShortenGradeExtension(assessment.grade)
          }
          className={`application-list__indicator-badge application-list__indicator-badge--course application-list__indicator-badge--course-in-guider ${modifier}`}
        >
          {shortenGrade(assessment.grade)}
        </span>
      );
    } else if (assessment.state === "incomplete") {
      const status = i18n.text.get(
        assessment.state === "incomplete"
          ? "plugin.guider.workspace.incomplete"
          : "plugin.guider.workspace.failed"
      );

      const modifier =
        assessment.state === "incomplete" ? "state-INCOMPLETE" : "state-FAILED";

      return (
        <span
          title={
            i18n.text.get(
              "plugin.guider.evaluated",
              i18n.time.format(assessment.date)
            ) +
            " - " +
            status
          }
          className={`application-list__indicator-badge application-list__indicator-badge--course application-list__indicator-badge--course-in-guider ${modifier}`}
        >
          {status[0].toLocaleUpperCase()}
        </span>
      );
    }
  }
  return null;
};

/**
 * GuiderWorkspacePercentsProps
 */
interface GuiderWorkspacePercentsProps {
  activity?: WorkspaceActivityType;
  i18n: i18nType;
}

/**
 * GuiderWorkspacePercents
 * @param props props
 * @returns JSX.Element
 */
const GuiderWorkspacePercents: React.FC<GuiderWorkspacePercentsProps> = (
  props
) => {
  const { activity } = props;

  return (
    <>
      <span
        className="workspace-activity__assignment-done-percent"
        title={props.i18n.text.get(
          "plugin.guider.headerEvaluatedTitle",
          activity.evaluablesDonePercent
        )}
      >
        {activity.evaluablesDonePercent}%
      </span>
      <span> / </span>
      <span
        className="workspace-activity__exercise-done-percent"
        title={props.i18n.text.get(
          "plugin.guider.headerExercisesTitle",
          activity.exercisesDonePercent
        )}
      >
        {activity.exercisesDonePercent}%
      </span>
    </>
  );
};
