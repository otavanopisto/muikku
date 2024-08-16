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

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  /**
   * Finds a matriculation subject name by subject value
   *
   * @param code matriculation subject code
   * @returns subject name or empty string if not found
   */
  const getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    t(`matriculationSubjects.${code}`, { ns: "hops" });

  const selectedMatriculationSubjects = (
    <MatriculationEligibilityRow
      label={getMatriculationSubjectNameByCode("A")}
      eligibility="ELIGIBLE"
      description={t("content.matriculationEligibility", {
        ns: "hops",
        acceptedCount: 0,
        requiredCount: 20,
      })}
    />
  );

  return (
    <>
      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          Abistatus eli ilmoittautumisoikeus
        </div>
        <div className="application-sub-panel__body application-sub-panel__body">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              <p>
                Kun ilmoittaudut yo-kokeeseen ensimmäistä kertaa, on sinulla
                oltava abistatus eli oikeus ilmoittautua yo-kokeisiin. <br />
                <b>Huom.</b> Jos sinulla on ammatillinen perustutkinto, voit
                hakea yo-kokeeseen tutkintosi pohjalta.
              </p>
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              <MatriculationEligibilityRow
                eligibility="ELIGIBLE"
                description="Olet suorittanut vähintään 40 opintopistettä pakollisia opintoja"
              />
              <MatriculationEligibilityRow
                eligibility="ELIGIBLE"
                description="Olet suorittanut vähintään yhden opintojakson Nettilukiossa"
              />
              <MatriculationEligibilityRow
                eligibility="ELIGIBLE"
                description="Olet suorittanut kaikista ylioppilastutkintoon suunnittelemistasi aineista vähintään yhden pakollisen opintojakson"
              />
            </div>
          </div>

          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              <MatriculationEligibilityRow
                label={getMatriculationSubjectNameByCode("EA")}
                eligibility="ELIGIBLE"
                description={t("content.matriculationEligibility", {
                  ns: "hops",
                  acceptedCount: 0,
                  requiredCount: 20,
                })}
              />
              <MatriculationEligibilityRow
                label={getMatriculationSubjectNameByCode("TE")}
                eligibility="ELIGIBLE"
                description={t("content.matriculationEligibility", {
                  ns: "hops",
                  acceptedCount: 0,
                  requiredCount: 20,
                })}
              />
              <MatriculationEligibilityRow
                label={getMatriculationSubjectNameByCode("ET")}
                eligibility="ELIGIBLE"
                description={t("content.matriculationEligibility", {
                  ns: "hops",
                  acceptedCount: 0,
                  requiredCount: 20,
                })}
              />
            </div>
          </div>
        </div>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <div className="application-sub-panel__header">
          {t("content.participationRights", { ns: "studies" })}
        </div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-subjects">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              {selectedMatriculationSubjects}
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
