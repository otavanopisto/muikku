import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";
import MatriculationEligibilityRow from "./components/matriculation-eligibility-row";
import { MatriculationSubjectCode } from "./components/matriculation-subject-type";

/**
 * MatriculationEligibilityProps
 */
interface MatriculationEligibilityProps {
  hops: HopsState;
}

/**
 * MatriculationEligibility
 * @param props props
 */
const MatriculationEligibility = (props: MatriculationEligibilityProps) => {
  const { hops } = props;
  const { eligibility } = hops.hopsMatriculation;

  const { t } = useTranslation(["hops_new", "guider", "common"]);

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
    t(`matriculationSubjectsYTL.${code}`, { ns: "hops_new" });

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
          ns: "hops_new",
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
            ns: "hops_new",
            acceptedCount: sEligibility.passingGradeCourseCreditPoints,
            requiredCount: sEligibility.requiredPassingGradeCourseCreditPoints,
          })}
        />
      )
    );

  return (
    <>
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("label.matriculationParticipation", {
            ns: "hops_new",
            context: "title1",
          })}
        </ApplicationSubPanel.Header>
        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div
              className="application-sub-panel__notification-body application-sub-panel__notification-body"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationEligibilityGuides1", {
                  ns: "hops_new",
                }),
              }}
            />
          </div>

          <div className="application-sub-panel__notification-item">
            <div
              className="application-sub-panel__notification-body application-sub-panel__notification-body"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationEligibilityGuides2", {
                  ns: "hops_new",
                }),
              }}
            />
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <p>
                {t("content.matriculationEligibilityGuides3", {
                  ns: "hops_new",
                })}
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
                  ns: "hops_new",
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
                  ns: "hops_new",
                })}
              />
              <MatriculationEligibilityRow
                eligibility={
                  !plannedSubjectsNotEligible() ? "ELIGIBLE" : "NOT_ELIGIBLE"
                }
                description={t("content.matriculationAbistatusEligibility3", {
                  ns: "hops_new",
                })}
              />
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
              <p>
                {t("content.matriculationEligibilityGuides4", {
                  ns: "hops_new",
                })}
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
        <ApplicationSubPanel.Header>
          {t("label.matriculationParticipation", {
            ns: "hops_new",
            context: "title2",
          })}
        </ApplicationSubPanel.Header>
        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div
              className="application-sub-panel__notification-body application-sub-panel__notification-body"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationEligibilityGuides5", {
                  ns: "hops_new",
                }),
              }}
            />
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
