import * as React from "react";
import { GuiderState } from "~/reducers/main-function/guider";
import { useTranslation } from "react-i18next";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import Hops from "~/components/base/hops_readable";

/**
 * Study plan props
 */
interface StudyPlanProps {
  guider: GuiderState;
}

/**
 * StudyPlan component
 * @param props props
 * @returns JSX.Element
 */
const StudyPlan: React.FC<StudyPlanProps> = (props) => {
  const { guider } = props;
  const { t } = useTranslation("guider");
  const studentHops =
    guider.currentStudent.hops && guider.currentStudent.hops.optedIn ? (
      <Hops data={guider.currentStudent.hops} />
    ) : null;

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
    guider: state.guider,
  };
}

export default connect(mapStateToProps)(StudyPlan);
