import * as React from "react";
import { GuiderState } from "~/reducers/main-function/guider";
import { useTranslation } from "react-i18next";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import Hops from "~/components/base/hops_readable";
import { HOPSState } from "~/reducers/main-function/hops";

/**
 * Study plan props
 */
interface StudyPlanProps {
  hops: HOPSState;
}

/**
 * StudyPlan component
 * @param props props
 * @returns JSX.Element
 */
const StudyPlan: React.FC<StudyPlanProps> = (props) => {
  const { hops } = props;
  const { t } = useTranslation("guider");

  const studentHops =
  hops.eligibility &&
  hops.eligibility.upperSecondarySchoolCurriculum ? (
      <Hops data={hops.value} />
    ) : null //TODO EMPTY HOPS;

  if (!studentHops) {
    return null;
  }

  return (
    <div className="application-sub-panel">
      <h3 className="application-sub-panel__header">{t("labels.hops")}</h3>
      {studentHops}
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hops,
  };
}

export default connect(mapStateToProps)(StudyPlan);
