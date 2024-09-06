import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemBody,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
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

  const [showHistory, setShowHistory] = React.useState(false);

  const { t } = useTranslation(["hops", "guider", "common"]);

  /**
   * handleToggleHistoryClick
   */
  const handleToggleHistoryClick = () => {
    setShowHistory(!showHistory);
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
          {hops.hopsMatriculation.exams.length === 0 ? (
            <p>
              {t("content.matriculationNoActiveEnrollment", { ns: "hops_new" })}
            </p>
          ) : (
            <MatriculationEnrollment
              exam={hops.hopsMatriculation.exams[0]}
              past={false}
            />
          )}
        </ApplicationSubPanel.Body>

        <ApplicationSubPanel.Body>
          <ApplicationList>
            <ApplicationListItem>
              <ApplicationListItemHeader
                tabIndex={0}
                role="button"
                className="application-list__item-header--course"
                onClick={handleToggleHistoryClick}
              >
                {t("actions.showChangeLog", { ns: "hops_new" })}
              </ApplicationListItemHeader>
              <ApplicationListItemBody>
                <AnimateHeight duration={400} height={showHistory ? "auto" : 0}>
                  {hops.hopsMatriculation.exams[0].status === "LOADING" ? (
                    <div className="loader-empty" />
                  ) : (
                    <ChangeLog
                      entryLogs={hops.hopsMatriculation.exams[0].changeLogs}
                    />
                  )}
                </AnimateHeight>
              </ApplicationListItemBody>
            </ApplicationListItem>
          </ApplicationList>
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
