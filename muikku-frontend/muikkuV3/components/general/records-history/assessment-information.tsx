import * as React from "react";
import { StudyActivityItem } from "~/generated/client";
import { AssignmentInfo } from "../evaluation-assessment-details/helper";
import AssignmentDetails from "../evaluation-assessment-details/assigments-details";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";

/**
 * AssessmentInformationProps
 */
interface AssessmentInformationProps {
  assessment: StudyActivityItem | null;
  assignmentInfo: AssignmentInfo[];
  assignmentInfoLoading: boolean;
  showAssignmentInfo?: boolean;
}

/**
 * AssessmentInformation
 * @param props AssessmentInformationProps
 * @returns JSX.Element
 */
export const AssessmentInformation = (props: AssessmentInformationProps) => {
  const { assessment, showAssignmentInfo = false } = props;

  if (!assessment) {
    return null;
  }

  const subjectCode = assessment?.subject;
  const courseNumber = assessment?.courseNumber;
  const subjectName = assessment?.subjectName;

  switch (assessment?.state) {
    // GRADED, SUPPLEMENTATIONREQUEST, INTERIM_EVALUATION are assessments
    case "GRADED":
      return (
        <AssessmentInformationGraded
          {...props}
          subjectCode={subjectCode}
          courseNumber={courseNumber}
          subjectName={subjectName}
          showAssignmentInfo={showAssignmentInfo}
        />
      );

    case "SUPPLEMENTATIONREQUEST":
      return (
        <AssessmentInformationIncomplete
          {...props}
          subjectCode={subjectCode}
          courseNumber={courseNumber}
          subjectName={subjectName}
          showAssignmentInfo={showAssignmentInfo}
        />
      );

    case "INTERIM_EVALUATION":
      return (
        <AssessmentInformationInterimEvaluation
          {...props}
          subjectCode={subjectCode}
          courseNumber={courseNumber}
          subjectName={subjectName}
        />
      );

    // INTERIM_EVALUATION_REQUEST, PENDING are assessment requests
    case "INTERIM_EVALUATION_REQUEST":
      return (
        <AssessmentInformationInterimEvaluationRequest
          {...props}
          subjectCode={subjectCode}
          courseNumber={courseNumber}
          subjectName={subjectName}
        />
      );

    case "PENDING":
      return (
        <AssessmentInformationPending
          {...props}
          subjectCode={subjectCode}
          courseNumber={courseNumber}
          subjectName={subjectName}
        />
      );
    default:
      return null;
  }
};

/**
 * AssessmentInformationSharedProps
 */
interface AssessmentInformationSharedProps {
  assessment: StudyActivityItem;
  subjectCode: string;
  courseNumber: number;
  subjectName: string;
}

// ASSESSMENT VARIANTS start here

/**
 * AssessmentInformationGradedProps
 */
interface AssessmentInformationGradedProps
  extends AssessmentInformationSharedProps {
  assignmentInfo: AssignmentInfo[];
  assignmentInfoLoading: boolean;
  showAssignmentInfo: boolean;
}

/**
 * AssessmentInformationGraded
 * @param props AssessmentInformationGradedProps
 * @returns JSX.Element
 */
const AssessmentInformationGraded = (
  props: AssessmentInformationGradedProps
) => {
  const { t } = useTranslation();
  const {
    assessment,
    assignmentInfo,
    assignmentInfoLoading,
    subjectCode,
    courseNumber,
    subjectName,
    showAssignmentInfo,
  } = props;

  const subjectCodeString = `(${subjectName}, ${subjectCode}${courseNumber})`;
  const evalStateClassName = assessment.passing
    ? "workspace-assessment--passed"
    : "workspace-assessment--failed";
  const evalStateIcon = assessment.passing
    ? "icon-thumb-up"
    : "icon-thumb-down";

  return (
    <div key={`${subjectCode}-${courseNumber}`}>
      {showAssignmentInfo && assignmentInfoLoading && (
        <div className="loader-empty" />
      )}
      {showAssignmentInfo && assignmentInfo.length > 0 && (
        <div className="form__row">
          <AssignmentDetails assignmentInfoList={assignmentInfo} />
        </div>
      )}
      <div
        className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
      >
        <div className={`workspace-assessment__icon ${evalStateIcon}`}></div>
        <div className="workspace-assessment__subject">
          <span className="workspace-assessment__subject-data">
            {subjectCodeString}
          </span>
        </div>
        <div className="workspace-assessment__date">
          <span className="workspace-assessment__date-label">
            {t("labels.date")}:
          </span>
          <span className="workspace-assessment__date-data">
            {localize.date(assessment.date)}
          </span>
        </div>
        {assessment.evaluatorName && (
          <div className="workspace-assessment__evaluator">
            <span className="workspace-assessment__evaluator-label">
              {t("labels.assessor", { ns: "evaluation" })}:
            </span>
            <span className="workspace-assessment__evaluator-data">
              {assessment.evaluatorName}
            </span>
          </div>
        )}
        <div className="workspace-assessment__grade">
          <span className="workspace-assessment__grade-label">
            {t("labels.grade", { ns: "workspace" })}:
          </span>
          <span className="workspace-assessment__grade-data">
            {assessment.grade}
          </span>
        </div>
        <div className="workspace-assessment__literal">
          <div className="workspace-assessment__literal-label">
            {t("labels.evaluation", {
              ns: "evaluation",
              context: "literal",
            })}
            :
          </div>
          <div
            className="workspace-assessment__literal-data rich-text"
            dangerouslySetInnerHTML={{ __html: assessment.text }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * AssessmentInformationIncompleteProps
 */
interface AssessmentInformationIncompleteProps
  extends AssessmentInformationSharedProps {
  assignmentInfo: AssignmentInfo[];
  assignmentInfoLoading: boolean;
  showAssignmentInfo: boolean;
}

/**
 * AssessmentInformationIncomplete
 * @param props AssessmentInformationIncompleteProps
 * @returns JSX.Element
 */
const AssessmentInformationIncomplete = (
  props: AssessmentInformationIncompleteProps
) => {
  const { t } = useTranslation();
  const {
    assessment,
    assignmentInfo,
    assignmentInfoLoading,
    subjectCode,
    courseNumber,
    subjectName,
    showAssignmentInfo,
  } = props;

  const subjectCodeString = `(${subjectName}, ${subjectCode}${courseNumber})`;

  return (
    <div key={`${subjectCode}-${courseNumber}`}>
      {showAssignmentInfo && assignmentInfoLoading && (
        <div className="loader-empty" />
      )}
      {showAssignmentInfo && assignmentInfo.length > 0 && (
        <div className="form__row">
          <AssignmentDetails assignmentInfoList={assignmentInfo} />
        </div>
      )}
      <div
        className={`workspace-assessment workspace-assessment--studies-details workspace-assessment--incomplete`}
      >
        <div className="workspace-assessment__icon"></div>
        <div className="workspace-assessment__subject">
          <span className="workspace-assessment__subject-data">
            {subjectCodeString}
          </span>
        </div>
        <div className="workspace-assessment__date">
          <span className="workspace-assessment__date-label">
            {t("labels.date")}:
          </span>
          <span className="workspace-assessment__date-data">
            {localize.date(assessment.date)}
          </span>
        </div>
        {assessment.evaluatorName && (
          <div className="workspace-assessment__evaluator">
            <span className="workspace-assessment__evaluator-label">
              {t("labels.assessor", { ns: "evaluation" })}:
            </span>
            <span className="workspace-assessment__evaluator-data">
              {assessment.evaluatorName}
            </span>
          </div>
        )}
        <div className="workspace-assessment__grade">
          <span className="workspace-assessment__grade-label">
            {t("labels.grade", { ns: "workspace" })}:
          </span>
          <span className="workspace-assessment__grade-data">
            {t("labels.incomplete", { ns: "workspace" })}
          </span>
        </div>
        <div className="workspace-assessment__literal">
          <div className="workspace-assessment__literal-label">
            {t("labels.evaluation", {
              ns: "evaluation",
              context: "literal",
            })}
            :
          </div>
          <div
            className="workspace-assessment__literal-data rich-text"
            dangerouslySetInnerHTML={{ __html: assessment.text }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * AssessmentInformationInterimEvaluationProps
 */
interface AssessmentInformationInterimEvaluationProps
  extends AssessmentInformationSharedProps {}

/**
 * AssessmentInformationInterimEvaluation
 * @param props AssessmentInformationInterimEvaluationProps
 * @returns JSX.Element
 */
const AssessmentInformationInterimEvaluation = (
  props: AssessmentInformationInterimEvaluationProps
) => {
  const { t } = useTranslation();
  const { assessment, subjectCode, courseNumber } = props;

  return (
    <div
      key={`${subjectCode}-${courseNumber}`}
      className={`workspace-assessment workspace-assessment--studies-details workspace-assessment--interim-evaluation`}
    >
      <div className={`workspace-assessment__icon icon-thumb-up`}></div>
      <div className="workspace-assessment__date">
        <span className="workspace-assessment__date-label">
          {t("labels.date")}:
        </span>
        <span className="workspace-assessment__date-data">
          {localize.date(assessment.date)}
        </span>
      </div>
      <div className="workspace-assessment__literal">
        <div className="workspace-assessment__literal-label">
          {t("labels.interimEvaluation", { ns: "materials" })}:
        </div>
        <div
          className="workspace-assessment__literal-data rich-text"
          dangerouslySetInnerHTML={{ __html: assessment.text }}
        />
      </div>
    </div>
  );
};

// ASSESSMENT VARIANTS end here

// ASSESSMENT REQUEST VARIANTS start here

/**
 * AssessmentInformationInterimEvaluationRequestProps
 */
interface AssessmentInformationInterimEvaluationRequestProps
  extends AssessmentInformationSharedProps {}

/**
 * AssessmentInformationInterimEvaluationRequest
 * @param props AssessmentInformationInterimEvaluationRequestProps
 * @returns JSX.Element
 */
const AssessmentInformationInterimEvaluationRequest = (
  props: AssessmentInformationInterimEvaluationRequestProps
) => {
  const { t } = useTranslation();
  const { assessment, subjectCode, courseNumber } = props;
  return (
    <div
      key={`${subjectCode}-${courseNumber}`}
      className={`workspace-assessment workspace-assessment--studies-details workspace-assessment--interim-evaluation-request`}
    >
      <div
        className={`workspace-assessment__icon icon-assessment-pending`}
      ></div>
      <div className="workspace-assessment__date">
        <span className="workspace-assessment__date-label">
          {t("labels.date")}:
        </span>
        <span className="workspace-assessment__date-data">
          {localize.date(assessment.date)}
        </span>
      </div>
      <div className="workspace-assessment__literal">
        <div className="workspace-assessment__literal-label">
          {t("labels.interimEvaluationRequest", { ns: "evaluation" })}:
        </div>
        <div
          className="workspace-assessment__literal-data rich-text"
          dangerouslySetInnerHTML={{ __html: assessment.text }}
        />
      </div>
    </div>
  );
};

/**
 * AssessmentInformationPendingProps
 */
interface AssessmentInformationPendingProps
  extends AssessmentInformationSharedProps {}

/**
 * AssessmentInformationPending
 * @param props AssessmentInformationPendingProps
 * @returns JSX.Element
 */
const AssessmentInformationPending = (
  props: AssessmentInformationPendingProps
) => {
  const { t } = useTranslation();
  const { assessment, subjectCode, courseNumber } = props;
  return (
    <div
      key={`${subjectCode}-${courseNumber}`}
      className={`workspace-assessment workspace-assessment--studies-details workspace-assessment--pending`}
    >
      <div
        className={`workspace-assessment__icon icon-assessment-pending`}
      ></div>
      <div className="workspace-assessment__date">
        <span className="workspace-assessment__date-label">
          {t("labels.date")}:
        </span>
        <span className="workspace-assessment__date-data">
          {localize.date(assessment.date)}
        </span>
      </div>
      {assessment.text && (
        <div className="workspace-assessment__literal">
          <div className="workspace-assessment__literal-label">
            {t("labels.evaluationRequest", { ns: "evaluation" })}:
          </div>
          <div
            className="workspace-assessment__literal-data rich-text"
            dangerouslySetInnerHTML={{ __html: assessment.text }}
          />
        </div>
      )}
    </div>
  );
};

// ASSESSMENT REQUEST VARIANTS end here
