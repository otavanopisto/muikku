import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import Button from "~/components/general/button";
import {
  MatriculationExam,
  MatriculationExamStudentStatus,
} from "~/generated/client";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops/";
import MatriculationExaminationWizardDialog from "./dialogs/matriculation-wizard";
import MatriculationWizardSummaryDialog from "./dialogs/matriculation-summary";
import MatriculationVerifyDialog from "./dialogs/matriculation-verify";
import {
  VerifyMatriculationExamTriggerType,
  verifyMatriculationExam,
} from "../../../../../actions/main-function/hops/index";
import MatriculationEnrollmentDrawerList from "./components/enrollment-drawer/enrollment-history-drawer-list";
import MatriculationEnrollmentDrawerListItem from "./components/enrollment-drawer/enrollment-history-drawer-item";
import { useUseCaseContext } from "~/context/use-case-context";

/**
 * MatriculationEnrollmentProps
 */
interface MatriculationEnrollmentProps {
  hops: HopsState;
  verifyMatriculationExam: VerifyMatriculationExamTriggerType;
}

/**
 * MatriculationEntrollment
 * @param props props
 */
const MatriculationEntrollment = (props: MatriculationEnrollmentProps) => {
  const { hops, verifyMatriculationExam } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

  const useCase = useUseCaseContext();

  /**
   * Handles verify matriculation exam
   * @param examId examId
   */
  const handleVerifyMatriculationExam =
    (examId: number) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      verifyMatriculationExam(examId);
    };

  /**
   * Renders enrollment links
   * @returns JSX.Element | null
   */
  const renderEnrollmentLinks = () => {
    if (
      hops.hopsMatriculation.exams === null ||
      hops.hopsMatriculation.exams.length === 0
    ) {
      return null;
    }

    const filteredExams = hops.hopsMatriculation.exams.filter(
      (e) => e.studentStatus === MatriculationExamStudentStatus.Eligible
    );

    if (filteredExams.length === 0) {
      return null;
    }

    const enrollmentLinks = filteredExams.map((e) => (
      <div key={e.id}>
        <MatriculationExaminationWizardDialog
          examId={e.id}
          compulsoryEducationEligible={e.compulsoryEducationEligible}
          formType="initial"
        >
          <Button
            className="button button--yo-signup"
            disabled={useCase === "GUARDIAN"}
          >
            {t("actions.signUp", {
              ns: "studies",
              dueDate: new Date(e.ends).toLocaleDateString("fi-Fi"),
            })}
          </Button>
        </MatriculationExaminationWizardDialog>
      </div>
    ));

    return (
      <div className="application-sub-panel__notification-item">
        <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
          {t("content.matriculationEnrollmentGuides1", {
            ns: "hops_new",
          })}
        </div>
        <div className="application-sub-panel__notification-footer">
          {enrollmentLinks}
        </div>
      </div>
    );
  };

  /**
   * renderSubmittedEnrollments
   * @returns JSX.Element | null
   */
  const renderSubmittedEnrollments = () => {
    if (
      hops.hopsMatriculation.exams === null ||
      hops.hopsMatriculation.exams.length === 0
    ) {
      return null;
    }

    const filteredExams = hops.hopsMatriculation.exams.filter(
      (e) =>
        e.studentStatus === MatriculationExamStudentStatus.Pending ||
        e.studentStatus ===
          MatriculationExamStudentStatus.SupplementationRequest ||
        e.studentStatus === MatriculationExamStudentStatus.Supplemented ||
        e.studentStatus === MatriculationExamStudentStatus.Approved ||
        e.studentStatus === MatriculationExamStudentStatus.Rejected ||
        e.studentStatus === MatriculationExamStudentStatus.Confirmed
    );

    if (filteredExams.length === 0) {
      return null;
    }

    const statusMap: {
      [key in MatriculationExamStudentStatus]?: string;
    } = {
      [MatriculationExamStudentStatus.Pending]: "Odottaa hyväksyntää",
      [MatriculationExamStudentStatus.SupplementationRequest]: "Täydennettävä",
      [MatriculationExamStudentStatus.Supplemented]: "Täydennetty",
      [MatriculationExamStudentStatus.Approved]: "Hyväksytty",
      [MatriculationExamStudentStatus.Rejected]: "Hylätty",
      [MatriculationExamStudentStatus.Confirmed]: "Vahvistettu",
    };

    /**
     * Map function for exams
     * @param e exam
     * @returns JSX.Element
     */
    const mapExam = (e: MatriculationExam) => {
      /**
       * Render function by status
       */
      const renderFunctionByStatus = () => {
        if (useCase === "GUARDIAN") {
          // Guardians can only view the summary
          switch (e.studentStatus) {
            case MatriculationExamStudentStatus.Pending:
            case MatriculationExamStudentStatus.SupplementationRequest:
            case MatriculationExamStudentStatus.Supplemented:
              return (
                <div key={e.id}>
                  <MatriculationWizardSummaryDialog
                    examId={e.id}
                    compulsoryEducationEligible={e.compulsoryEducationEligible}
                    formType="readonly"
                  >
                    <Button className="button button--yo-signup">
                      {t("actions.supplementRegistration", {
                        ns: "hops_new",
                      })}
                    </Button>
                  </MatriculationWizardSummaryDialog>
                </div>
              );

            default:
              return null;
          }
        }

        switch (e.studentStatus) {
          case MatriculationExamStudentStatus.Confirmed:
          case MatriculationExamStudentStatus.Supplemented:
          case MatriculationExamStudentStatus.Pending:
            return (
              <div key={e.id}>
                <MatriculationWizardSummaryDialog
                  examId={e.id}
                  compulsoryEducationEligible={e.compulsoryEducationEligible}
                  formType="readonly"
                >
                  <Button className="button button--yo-signup">
                    {t("actions.showSummary", {
                      ns: "hops_new",
                    })}
                  </Button>
                </MatriculationWizardSummaryDialog>
              </div>
            );

          case MatriculationExamStudentStatus.SupplementationRequest:
            return (
              <div key={e.id}>
                <MatriculationExaminationWizardDialog
                  examId={e.id}
                  compulsoryEducationEligible={e.compulsoryEducationEligible}
                  formType="editable"
                >
                  <Button className="button button--yo-signup">
                    {t("actions.supplementRegistration", {
                      ns: "hops_new",
                    })}
                  </Button>
                </MatriculationExaminationWizardDialog>
              </div>
            );

          case MatriculationExamStudentStatus.Approved:
            return (
              <div key={e.id}>
                <MatriculationVerifyDialog
                  examId={e.id}
                  compulsoryEducationEligible={e.compulsoryEducationEligible}
                  formType="readonly"
                >
                  <Button
                    className="button button--yo-signup"
                    onClick={handleVerifyMatriculationExam(e.id)}
                  >
                    {t("actions.confirmRegistration", {
                      ns: "hops_new",
                    })}
                  </Button>
                </MatriculationVerifyDialog>
              </div>
            );

          default:
            return null;
        }
      };

      const term = e.term === "AUTUMN" ? "Syksy" : "Kevät";
      const year = e.year;

      const functionByStatus = renderFunctionByStatus();

      return (
        <div key={e.id} className="application-sub-panel__notification-item">
          <div className="application-sub-panel__notification-footer">
            <div className="application-sub-panel__notification-content">
              <span className="application-sub-panel__notification-content-title">
                {t("content.matriculationEnrollmentDone", {
                  ns: "hops_new",
                  term: `${term} ${year}`,
                  date: new Date(
                    e.enrollment.enrollmentDate
                  ).toLocaleDateString("fi-Fi"),
                })}
              </span>
            </div>

            <div className="application-sub-panel__notification-content">
              <span className="application-sub-panel__notification-content-label">
                {t("label.matriculationEnrollmentCloses", {
                  ns: "hops_new",
                })}
              </span>

              <span className="application-sub-panel__notification-content-data">
                {new Date(e.ends).toLocaleDateString("fi-Fi")}
              </span>
            </div>

            <div className="application-sub-panel__notification-content">
              <span className="application-sub-panel__notification-content-label">
                {t("label.matriculationEnrollmentStatus", {
                  ns: "hops_new",
                })}
              </span>

              <span
                className={`application-sub-panel__notification-content-data ${contentDataModifiers(
                  e
                )
                  .map(
                    (m) =>
                      `application-sub-panel__notification-content-data--${m}`
                  )
                  .join(" ")}`}
              >
                {statusMap[e.studentStatus]}
              </span>
            </div>

            {functionByStatus && (
              <div className="application-sub-panel__notification-content">
                {functionByStatus}
              </div>
            )}
          </div>
        </div>
      );
    };

    const signedEnrollments = filteredExams.map(mapExam);

    return signedEnrollments;
  };

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <>
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("label.matriculationEnrollment", {
            ns: "hops_new",
            context: "title",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {renderEnrollmentLinks()}
          {renderSubmittedEnrollments()}
        </ApplicationSubPanel.Body>

        <ApplicationSubPanel.Body>
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              {t("content.matriculationEnrollmentGuides2", {
                ns: "hops_new",
              })}
            </div>
          </div>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("label.matriculationEnrollmentHistory", {
            ns: "hops_new",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body modifier="studies-yo-subjects">
          <MatriculationEnrollmentDrawerList>
            {hops.hopsMatriculation.exams.map((e) => (
              <MatriculationEnrollmentDrawerListItem key={e.id} exam={e} />
            ))}
          </MatriculationEnrollmentDrawerList>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </>
  );
};

/**
 * Content date modifiers
 * @param e exam
 * @returns string[]
 */
const contentDataModifiers = (e: MatriculationExam) => {
  switch (e.studentStatus) {
    case MatriculationExamStudentStatus.Pending:
      return ["pending"];
    case MatriculationExamStudentStatus.SupplementationRequest:
      return ["supplementation-request"];
    case MatriculationExamStudentStatus.Approved:
      return ["approved"];
    case MatriculationExamStudentStatus.Rejected:
      return ["rejected"];
    default:
      return [];
  }
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      verifyMatriculationExam,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationEntrollment);
