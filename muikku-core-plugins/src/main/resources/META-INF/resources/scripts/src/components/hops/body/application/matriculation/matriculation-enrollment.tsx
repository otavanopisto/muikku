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
import {
  VerifyMatriculationExamTriggerType,
  verifyMatriculationExam,
} from "../../../../../actions/main-function/hops/index";
import MatriculationEnrollmentDrawerList from "./components/enrollment-drawer/enrollment-history-drawer-list";
import MatriculationEnrollmentDrawerListItem from "./components/enrollment-drawer/enrollment-history-drawer-item";

/**
 * MatriculationPlanProps
 */
interface MatriculationEnrollmentProps {
  hops: HopsState;
  verifyMatriculationExam: VerifyMatriculationExamTriggerType;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationEntrollment = (props: MatriculationEnrollmentProps) => {
  const { hops, verifyMatriculationExam } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

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
          updateEnrollemnts={() => undefined}
          examId={e.id}
          compulsoryEducationEligible={e.compulsoryEducationEligible}
          formType="initial"
        >
          <Button className="button button--yo-signup">
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
          Huom. Tarkasta ennen ilmoittautumista Osallistumisoikeus-välilehdeltä,
          oletko suorittanut riittävästi opintoja, jotta voit osallistua
          yo-kirjoituksiin.
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
        e.studentStatus === MatriculationExamStudentStatus.Approved ||
        e.studentStatus === MatriculationExamStudentStatus.Rejected
    );

    if (filteredExams.length === 0) {
      return null;
    }

    const statusMap: {
      [key in MatriculationExamStudentStatus]?: string;
    } = {
      [MatriculationExamStudentStatus.Pending]: "Odottaa hyväksyntää",
      [MatriculationExamStudentStatus.SupplementationRequest]: "Täydennettävä",
      [MatriculationExamStudentStatus.Approved]: "Hyväksytty",
      [MatriculationExamStudentStatus.Rejected]: "Hylätty",
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
        switch (e.studentStatus) {
          case MatriculationExamStudentStatus.SupplementationRequest:
            return (
              <div key={e.id}>
                <MatriculationExaminationWizardDialog
                  updateEnrollemnts={() => undefined}
                  examId={e.id}
                  compulsoryEducationEligible={e.compulsoryEducationEligible}
                  formType="edit"
                >
                  <Button className="button button--yo-signup">
                    Muokkaa ilmoittautumista
                  </Button>
                </MatriculationExaminationWizardDialog>
              </div>
            );
          case MatriculationExamStudentStatus.Approved:
            return (
              <div key={e.id}>
                <Button
                  className="button button--yo-signup"
                  onClick={handleVerifyMatriculationExam(e.id)}
                >
                  Vahvista ilmoittautuminen
                </Button>
              </div>
            );

          default:
            return null;
        }
      };

      const term = e.term === "AUTUMN" ? "Syksy" : "Kevät";
      const year = e.year;

      return (
        <div key={e.id}>
          <div className="application-sub-panel__notification-content">
            <span className="application-sub-panel__notification-content-title">
              {`Olet ilmoittautunut YO-kirjoituksiin (${term} ${year}) ${new Date(
                e.enrollment.enrollmentDate
              ).toLocaleDateString("fi-Fi")}.`}
            </span>
          </div>

          <div className="application-sub-panel__notification-content">
            <span className="application-sub-panel__notification-content-label">
              Ilmoittautuminen sulkeutuu:
            </span>

            <span className="application-sub-panel__notification-content-data">
              {new Date(e.ends).toLocaleDateString("fi-Fi")}
            </span>
          </div>

          <div className="application-sub-panel__notification-content">
            <span className="application-sub-panel__notification-content-label">
              Ilmoittautumistila:
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

            {renderFunctionByStatus()}
          </div>
        </div>
      );
    };

    const signedEnrollments = filteredExams.map(mapExam);

    return (
      <div className="application-sub-panel__notification-item">
        <div className="application-sub-panel__notification-body application-sub-panel__notification-body"></div>
        <div className="application-sub-panel__notification-footer">
          {signedEnrollments}
        </div>
      </div>
    );
  };

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <>
      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          Ylioppilaskirjoituksiin ilmoittautuminen
        </div>
        <div className="application-sub-panel__body application-sub-panel__body">
          {renderEnrollmentLinks()}
          {renderSubmittedEnrollments()}
        </div>

        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen
              (riikka.turpeinen@otavia.fi).
            </div>
          </div>
        </div>
      </ApplicationSubPanel>
      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          Ilmoittautumishistoria
        </div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-subjects">
          <MatriculationEnrollmentDrawerList>
            {hops.hopsMatriculation.exams.map((e) => (
              <MatriculationEnrollmentDrawerListItem key={e.id} exam={e} />
            ))}
          </MatriculationEnrollmentDrawerList>
        </div>
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
