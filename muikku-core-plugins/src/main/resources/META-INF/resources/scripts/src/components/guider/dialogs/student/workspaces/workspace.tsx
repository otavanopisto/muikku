import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import Dropdown from "~/components/general/dropdown";
import WorkspaceChart from "./workspace/workspace-chart";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { getShortenGradeExtension, shortenGrade } from "~/util/modifiers";
import {
  WorkspaceActivity,
  DiscussionWorkspaceStatistic,
  WorkspaceAssessmentState,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";

/**
 * StudentWorkspaceProps
 */
interface StudentWorkspaceProps extends WithTranslation {
  workspace: WorkspaceDataType;
}

/**
 * StudentWorkspaceState
 */
interface StudentWorkspaceState {
  /** if the student activities are visible or not */
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
  showWorkspacePercents = (assessments?: WorkspaceAssessmentState[]) => {
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
   * getAssessmentStateText
   * @param assessment assessment
   * @returns object containing state text and class modifier
   */
  getAssessmentStateText = (assessment: WorkspaceAssessmentState) => {
    let stateText;

    switch (assessment.state) {
      case "pending":
      case "pending_pass":
      case "pending_fail":
        stateText = this.props.i18n.t("labels.sent", {
          context: "evaluationRequest",
        });
        break;
      case "pass":
        stateText = this.props.i18n.t("labels.evaluationState", {
          ns: "guider",
          context: "pass",
        });
        break;
      case "fail":
        stateText = this.props.i18n.t("labels.evaluationState", {
          ns: "guider",
          context: "fail",
        });
        break;
      case "incomplete":
        stateText = this.props.i18n.t("labels.evaluationState", {
          ns: "guider",
          context: "incomplete",
        });
        break;
      case "interim_evaluation_request":
        stateText = this.props.i18n.t("labels.sent", {
          context: "interimEvaluation",
        });
        break;
      case "interim_evaluation":
        stateText = this.props.i18n.t("labels.evaluated", {
          ns: "guider",
          context: "interim",
        });
        break;
      default:
        stateText = this.props.i18n.t("labels.notSent", {
          context: "evaluationRequest",
        });
        break;
    }

    return stateText;
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

          const codeSubjectString = `${subjectData.subject.code.toUpperCase()}${
            subjectData.courseNumber ? subjectData.courseNumber : ""
          } - ${subjectData.subject.name} (${subjectData.courseLength}${
            subjectData.courseLengthSymbol.symbol
          })`;

          return (
            <div
              className="application-list__item-content-single-item"
              key={a.workspaceSubjectIdentifier}
            >
              <span className="application-list__item-content-single-item-primary">
                {codeSubjectString}
              </span>

              <GuiderAssessment assessment={a} />
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
          {this.props.i18n.t("labels.evaluationState", {
            ns: "guider",
          })}
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

            const stateText = this.getAssessmentStateText(a);

            /**
             * State text by default
             */
            let resultingStateText = stateText;

            /**
             * Add date to string if date is present
             */
            if (a.date) {
              resultingStateText += " - " + localize.date(a.date);
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

    const courseNameString = `${workspace.name}
    ${workspace.nameExtension ? ` (${workspace.nameExtension})` : ""}`;

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
            {courseNameString}
          </span>
          <span className="application-list__header-secondary">
            {
              /**
               * Show percent if method return true
               */
              this.showWorkspacePercents(
                this.props.workspace.activity.assessmentState
              ) ? (
                <span className="activity-badge activity-badge--percent">
                  <GuiderWorkspacePercents
                    activity={this.props.workspace.activity}
                  />
                </span>
              ) : null
            }
            {!isCombinationWorkspace ? (
              /**
               * Only show assessment in header line if its not combination workspace
               */
              <GuiderAssessment
                assessment={this.props.workspace.activity.assessmentState[0]}
              />
            ) : null}
          </span>
          <Dropdown
            persistent
            modifier={"workspace-chart workspace-" + workspace.id}
            items={[<WorkspaceChart key={0} workspace={workspace} />]}
          >
            <span className="icon-statistics chart__activator chart__activator--workspace-chart"></span>
          </Dropdown>
        </ApplicationListItemHeader>

        {
          /**
           * Only shows list of assessments here if its comibinations workspace
           */
          isCombinationWorkspace ? renderCombinationSubjectAssessments() : null
        }

        {this.state.activitiesVisible ? (
          <div className="application-sub-panel text">
            <div className="application-sub-panel__body">
              {renderCourseActivity()}

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfVisits"
                givenDateAttributeLocale="content.lastVisit"
                labelTranslationString="labels.workspaceVisits"
                conditionalAttribute="numVisits"
                givenDateAttribute="lastVisit"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfJournalEntries"
                givenDateAttributeLocale="content.lastJournalEntry"
                labelTranslationString="labels.entries"
                conditionalAttribute="journalEntryCount"
                givenDateAttribute="lastJournalEntry"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<DiscussionWorkspaceStatistic>
                conditionalAttributeLocale="content.numberOfMessages"
                givenDateAttributeLocale="content.lastMessage"
                labelTranslationString="labels.discussionMessages"
                conditionalAttribute="messageCount"
                givenDateAttribute="latestMessage"
                mainAttribute="forumStatistics"
                {...this.props}
              />

              <h4 className="application-sub-panel__item-header">
                {this.props.i18n.t("labels.evaluables", {
                  ns: "materials",
                  count: 0,
                })}
              </h4>

              <CourseActivityRow<WorkspaceActivity>
                labelTranslationString="labels.unanswered"
                conditionalAttribute="evaluablesUnanswered"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfAssignments"
                givenDateAttributeLocale="content.lastAnswered"
                labelTranslationString="labels.answered"
                conditionalAttribute="evaluablesAnswered"
                givenDateAttribute="evaluablesAnsweredLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfAssignments"
                givenDateAttributeLocale="content.lastSubmittedAssignment"
                labelTranslationString="labels.submittedAssignments"
                conditionalAttribute="evaluablesSubmitted"
                givenDateAttribute="evaluablesSubmittedLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfAssignments"
                givenDateAttributeLocale="content.lastEvaluationFailed"
                labelTranslationString="labels.evaluatedWithNonPassingGrade"
                conditionalAttribute="evaluablesFailed"
                givenDateAttribute="evaluablesFailedLastDate"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfAssignments"
                givenDateAttributeLocale="content.lastEvaluationPassed"
                labelTranslationString="labels.evaluatedWithPassingGrade"
                conditionalAttribute="evaluablesPassed"
                givenDateAttribute="evaluablesPassedLastDate"
                mainAttribute="activity"
                {...this.props}
              />
              <h4 className="application-sub-panel__item-header">
                {this.props.i18n.t("labels.exercises", {
                  ns: "materials",
                  count: 0,
                })}
              </h4>

              <CourseActivityRow<WorkspaceActivity>
                labelTranslationString="labels.unanswered"
                conditionalAttribute="exercisesUnanswered"
                mainAttribute="activity"
                {...this.props}
              />

              <CourseActivityRow<WorkspaceActivity>
                conditionalAttributeLocale="content.numberOfExercises"
                givenDateAttributeLocale="content.lastAnswered"
                labelTranslationString="labels.answered"
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

export default withTranslation(["guider"])(StudentWorkspace);

// Other component used only by Workspace component

/**
 * CourseActivityRowProps
 */
interface CourseActivityRowProps<C> {
  workspace: WorkspaceDataType;
  labelTranslationString: string;
  conditionalAttribute: keyof C;
  conditionalAttributeLocale?: string;
  givenDateAttribute?: string;
  givenDateAttributeLocale?: string;
  /**
   * mainAttribute is type as WorkspaceDataType as component is not used any where else
   */
  mainAttribute: keyof WorkspaceDataType;
}

/**
 * CourseActivityRow
 * @param props props
 * @returns JSX.Element
 */
const CourseActivityRow = <C,>(props: CourseActivityRowProps<C>) => {
  const { mainAttribute, conditionalAttribute } = props;
  const { t } = useTranslation("guider");

  const workspace = props.workspace;

  let output = t("content.empty");

  /**
   * "Any" type should not be used and should be fixed. As now there currently is no better solution.
   * Tho more generic precise props still help use component more typescript precise
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (((workspace[mainAttribute] as any)[conditionalAttribute] as number) > 0) {
    if (props.conditionalAttributeLocale) {
      const locale = t(props.conditionalAttributeLocale, {
        defaultValue: "Locale does not exist",
        value: (props.workspace[props.mainAttribute] as any)[
          props.conditionalAttribute
        ],
      });

      output = locale;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      output = (props.workspace as any)[props.mainAttribute][
        props.conditionalAttribute
      ];
    }

    if (props.givenDateAttribute) {
      output += ", ";

      if (props.givenDateAttributeLocale) {
        output += t(props.givenDateAttributeLocale, {
          defaultValue: "Locale does not exist",
          value: localize.date(
            (props.workspace as any)[props.mainAttribute][
              props.givenDateAttribute
            ]
          ),
        });
      } else {
        output += localize.date(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        {t(props.labelTranslationString, {
          defaultValue: "Locale does not exist",
        })}
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
  assessment?: WorkspaceAssessmentState;
}

/**
 * GuiderAssessment
 * @param props component prosp
 * @returns JSX.Element
 */
const GuiderAssessment: React.FC<GuiderAssessmentProps> = (props) => {
  const { assessment } = props;
  const { t } = useTranslation(["workspace", "common"]);

  if (assessment) {
    // We can have situation where course module has PASSED assessment and also it's state is INCOMPLETE
    // as it has been evaluated as incomplete after evaluated as PASSED
    if (assessment.grade && assessment.state !== "incomplete") {
      const modifier =
        assessment.state === "pass" || assessment.state === "pending_pass"
          ? "state-PASSED"
          : "state-FAILED";

      return (
        <span
          title={
            t("labels.evaluated", {
              ns: "workspace",
              context: "in",
              date: localize.date(assessment.date),
            }) + getShortenGradeExtension(assessment.grade)
          }
          className={`application-list__indicator-badge application-list__indicator-badge--course ${modifier}`}
        >
          {shortenGrade(assessment.grade)}
        </span>
      );
    } else if (assessment.state === "incomplete") {
      const status =
        assessment.state === "incomplete"
          ? t("labels.incomplete", { ns: "workspace" })
          : t("labels.failed", { ns: "workspace" });
      const modifier =
        assessment.state === "incomplete" ? "state-INCOMPLETE" : "state-FAILED";

      return (
        <span
          title={
            t("labels.evaluated", {
              ns: "workspace",
              context: "in",
              date: localize.date(assessment.date),
            }) +
            " - " +
            status
          }
          className={`application-list__indicator-badge application-list__indicator-badge--course ${modifier}`}
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
  activity?: WorkspaceActivity;
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
  const { t } = useTranslation(["materials", "common"]);

  return (
    <>
      <span
        className="activity-badge__item activity-badge__item--assignment-percent"
        title={t("labels.evaluables", {
          ns: "materials",
          context: "donePercent",
          percent: activity.evaluablesDonePercent,
        })}
      >
        {activity.evaluablesDonePercent}%
      </span>
      <span>/</span>
      <span
        className="activity-badge__item activity-badge__item--exercise-percent"
        title={t("labels.exercises", {
          ns: "materials",
          context: "donePercent",
          percent: activity.exercisesDonePercent,
        })}
      >
        {activity.exercisesDonePercent}%
      </span>
    </>
  );
};
