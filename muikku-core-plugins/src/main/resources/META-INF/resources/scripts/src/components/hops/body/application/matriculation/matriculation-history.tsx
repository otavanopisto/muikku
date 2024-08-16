import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";

/**
 * MatriculationPlanProps
 */
interface MatriculationHistoryProps {
  hops: HopsState;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationHistory = (props: MatriculationHistoryProps) => {
  const { hops } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <>
      <ApplicationSubPanel>
        <div className="application-sub-panel__header">Yo-koehistoria</div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-yo-subjects">
          <div className="application-sub-panel__notification-item">
            <div className="application-sub-panel__notification-body application-sub-panel__notification-body--studies-yo-subjects">
              asdasd
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
)(MatriculationHistory);
