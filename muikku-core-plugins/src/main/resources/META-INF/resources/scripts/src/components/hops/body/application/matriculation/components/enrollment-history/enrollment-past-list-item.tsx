import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { MatriculationExamWithHistory } from "~/reducers/hops";
import {
  LoadMatriculationExamHistoryTriggerType,
  loadMatriculationExamHistory,
} from "../../../../../../../actions/main-function/hops/index";
import { ChangeLog } from "./enrollment-change-log";
import MatriculationEnrollment from "../matriculation-enrollment";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MatriculationPastEnrollmentProps
 */
interface MatriculationPastListItemProps {
  exam: MatriculationExamWithHistory;
  loadMatriculationExamHistory: LoadMatriculationExamHistoryTriggerType;
}

/**
 * MatriculationPastEnrollment
 * @param props props
 */
const MatriculationPastListItem = (props: MatriculationPastListItemProps) => {
  const { exam, loadMatriculationExamHistory } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * toggleDrawer
   */
  const handleToggleDrawerClick = () => {
    if (exam.status === "IDLE") {
      loadMatriculationExamHistory({ examId: exam.id });
    }
  };

  const headerTitle = t(`matriculationTerms.${exam.term}`, {
    ns: "hops_new",
    year: exam.year,
  });

  return (
    <div className="application-sub-panel__notification-item">
      <div className="application-sub-panel__notification-body">
        <details className="details">
          <summary className="details__summary">
            <b>{headerTitle}</b>
          </summary>
          <div className="details__content">
            <ApplicationSubPanel>
              <ApplicationSubPanel>
                <MatriculationEnrollment exam={exam} past />
              </ApplicationSubPanel>
              <ApplicationSubPanel>
                <ApplicationSubPanel.Body>
                  <details
                    className="details"
                    onClick={handleToggleDrawerClick}
                  >
                    <summary className="details__summary">
                      {t("actions.showChangeLog", { ns: "hops_new" })}
                    </summary>
                    <div className="details__content">
                      {props.exam.status === "LOADING" ? (
                        <div className="loader-empty" />
                      ) : (
                        <ChangeLog entryLogs={exam.changeLogs} />
                      )}
                    </div>
                  </details>
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </ApplicationSubPanel>
          </div>
        </details>
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ loadMatriculationExamHistory }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationPastListItem);
