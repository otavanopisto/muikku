import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops/";
import {
  VerifyMatriculationExamTriggerType,
  verifyMatriculationExam,
} from "../../../../../actions/main-function/hops/index";
import { ChangeLog } from "./components/enrollment-history/enrollment-change-log";
import MatriculationPastEnrollmentList from "./components/enrollment-history/enrollment-past-list";
import MatriculationPastListItem from "./components/enrollment-history/enrollment-past-list-item";
import MatriculationEnrollment from "./components/matriculation-enrollment";
import { AppDispatch } from "~/reducers/configureStore";

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
  const { hops } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <>
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.matriculationEnrollment", {
            ns: "hops_new",
            context: "title",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {hops.hopsMatriculation.exams.length === 0 ? (
            <div className="application-sub-panel__notification-item">
              <div className="application-sub-panel__notification-body">
                {t("content.matriculationNoActiveEnrollment", {
                  ns: "hops_new",
                })}
              </div>
            </div>
          ) : (
            <MatriculationEnrollment
              exam={hops.hopsMatriculation.exams[0]}
              past={false}
            />
          )}
        </ApplicationSubPanel.Body>

        {hops.hopsMatriculation.exams[0] && (
          <ApplicationSubPanel.Body>
            <div className="application-sub-panel__notification-item">
              <div className="application-sub-panel__notification-body">
                <details className="details">
                  <summary className="details__summary">
                    {t("actions.showChangeLog", { ns: "hops_new" })}
                  </summary>
                  <div className="details__content">
                    {hops.hopsMatriculation.exams[0].status === "LOADING" ? (
                      <div className="loader-empty" />
                    ) : (
                      <ChangeLog
                        entryLogs={hops.hopsMatriculation.exams[0].changeLogs}
                      />
                    )}
                  </div>
                </details>
              </div>
            </div>
          </ApplicationSubPanel.Body>
        )}

        <ApplicationSubPanel.Body>
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body">
              {t("content.matriculationEnrollmentGuides2", {
                ns: "hops_new",
              })}
            </div>
          </div>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.matriculationEnrollmentHistory", {
            ns: "hops_new",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          <MatriculationPastEnrollmentList>
            {hops.hopsMatriculation.pastExams.map((e) => (
              <MatriculationPastListItem key={e.id} exam={e} />
            ))}
          </MatriculationPastEnrollmentList>
        </ApplicationSubPanel.Body>
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
function mapDispatchToProps(dispatch: AppDispatch) {
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
