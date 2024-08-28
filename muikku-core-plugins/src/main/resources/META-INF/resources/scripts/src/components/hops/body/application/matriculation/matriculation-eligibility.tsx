import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";
import MatriculationEligibilityRow from "./components/matriculation-eligibility-rowV2";
import { MatriculationSubjectCode } from "./components/matriculation-subject-type";

/**
 * MatriculationPlanProps
 */
interface MatriculationEligibilityProps {
  hops: HopsState;
}

/**
 * MatriculationParticipation
 * @param props props
 */
const MatriculationEligibility = (props: MatriculationEligibilityProps) => {
  const { hops } = props;
  const { eligibility } = hops.hopsMatriculation;

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  /**
   * Check planned subjects for 0 passing grade course credit points
   * @returns Boolean if any of the planned subjects have 0 passing grade course credit points
   */
  const plannedSubjectsNotEligible = () =>
    hops.hopsMatriculation.subjectsWithEligibility.some(
      (subject) => subject.passingGradeCourseCreditPoints === 0
    );

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    t(`matriculationSubjects.${code}`, { ns: "hops" });

  // Abistatus eligibility rows
  const subjectAbistatusEligibilityRows =
    hops.hopsMatriculation.eligibility.subjectStats.map((sAbistatus, index) => (
      <MatriculationEligibilityRow
        key={index}
        label={getMatriculationSubjectNameByCode(
          sAbistatus.code as MatriculationSubjectCode
        )}
        eligibility={sAbistatus.abistatusOk ? "ELIGIBLE" : "NOT_ELIGIBLE"}
        description={t("content.matriculationEligibility", {
          ns: "hops",
          acceptedCount: sAbistatus.doneCredits,
          requiredCount: sAbistatus.requiredCredits,
        })}
      />
    ));

  // Participation rights eligibility rows
  const subjectEligibilityRows =
    hops.hopsMatriculation.subjectsWithEligibility.map(
      (sEligibility, index) => (
        <MatriculationEligibilityRow
          key={index}
          label={getMatriculationSubjectNameByCode(
            sEligibility.subject.code as MatriculationSubjectCode
          )}
          eligibility={sEligibility.eligible ? "ELIGIBLE" : "NOT_ELIGIBLE"}
          description={t("content.matriculationEligibility", {
            ns: "hops",
            acceptedCount: sEligibility.passingGradeCourseCreditPoints,
            requiredCount: sEligibility.requiredPassingGradeCourseCreditPoints,
          })}
        />
      )
    );

  return (
    <>
      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          Abistatus eli ilmoittautumisoikeus
        </div>
        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <p>
                Jotta voit <b>ilmoittautua ylioppilaskokeeseen</b>, sinun pitää
                suorittaa ensin riittävä määrä opintoja. Abistatus tarkoittaa
                ilmoittautumisoikeutta. <b>Huom.</b> Jos sinulla on ammatillinen
                perustutkinto, voit hakea yo-kokeeseen tutkintosi pohjalta.
                <br />
                Ennen ilmoittautumista sinulla pitää olla suoritettuna
              </p>
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <MatriculationEligibilityRow
                eligibility={
                  hops.hopsMatriculation.eligibility.credits >=
                  hops.hopsMatriculation.eligibility.creditsRequired
                    ? "ELIGIBLE"
                    : "NOT_ELIGIBLE"
                }
                description={t("content.matriculationAbistatusEligibility1", {
                  ns: "hops",
                  acceptedCount: hops.hopsMatriculation.eligibility.credits,
                  requiredCount:
                    hops.hopsMatriculation.eligibility.creditsRequired,
                })}
              />
              <MatriculationEligibilityRow
                eligibility={
                  eligibility.personHasCourseAssessments
                    ? "ELIGIBLE"
                    : "NOT_ELIGIBLE"
                }
                description={t("content.matriculationAbistatusEligibility2", {
                  ns: "hops",
                })}
              />
              <MatriculationEligibilityRow
                eligibility={
                  !plannedSubjectsNotEligible() ? "ELIGIBLE" : "NOT_ELIGIBLE"
                }
                description={t("content.matriculationAbistatusEligibility3", {
                  ns: "hops",
                })}
              />
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <p>
                Lisäksi sinulla pitää olla suoritettuna kirjoitettavasta
                aineesta tietty määrä opintoja. Jos et ole suorittanut
                riittävästi opintoja kirjoitettavasta aineesta, voit
                ilmoittautua myöhemmin pidettävään kokeeseen tai keskustella
                asiasta ohjaajasi kanssa.
              </p>
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              {subjectAbistatusEligibilityRows}
            </div>
          </div>
        </div>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          {t("content.participationRights", { ns: "studies" })}
        </div>
        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <p>
                Jotta voit <b>osallistua aineen ylioppilaskokeeseen</b>, sinun
                pitää suorittaa kirjoitettavasta aineesta pakolliset opinnot.
                Jos aineessa ei ole pakollisia opintoja, reaaliaineista pitää
                olla suoritettuna neljä opintopistettä ja vieraista kielistä
                kuusi opintopistettä.
              </p>
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              {subjectEligibilityRows}
            </div>
          </div>
        </div>
      </ApplicationSubPanel>
    </>
  );
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
)(MatriculationEligibility);
