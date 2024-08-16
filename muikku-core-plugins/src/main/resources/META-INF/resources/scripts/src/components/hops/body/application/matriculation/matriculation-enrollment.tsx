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

/**
 * MatriculationPlanProps
 */
interface MatriculationEnrollmentProps {
  hops: HopsState;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationEntrollment = (props: MatriculationEnrollmentProps) => {
  const { hops } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

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
        e.studentStatus === MatriculationExamStudentStatus.Submitted ||
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
      [MatriculationExamStudentStatus.Submitted]: "Odottaa hyväksyntää",
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
      const editEnrollmentLink =
        e.studentStatus ===
        MatriculationExamStudentStatus.SupplementationRequest ? (
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
        ) : null;

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

            {editEnrollmentLink}
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
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              Huom. Tarkasta ennen ilmoittautumista
              Osallistumisoikeus-välilehdeltä, oletko suorittanut riittävästi
              opintoja, jotta voit osallistua yo-kirjoituksiin.
            </div>
            <div className="application-sub-panel__notification-footer">
              asd
            </div>
          </div>
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
    case MatriculationExamStudentStatus.Submitted:
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
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationEntrollment);
