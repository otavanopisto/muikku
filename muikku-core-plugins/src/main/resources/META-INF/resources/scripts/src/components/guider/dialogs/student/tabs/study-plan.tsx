import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderType } from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import Hops from "~/components/base/hops_readable";

/**
 * Study plan props
 */
interface StudyPlanProps {
  i18n: i18nType;
  guider: GuiderType;
}

/**
 * StudyPlan component
 * @param props props
 * @returns JSX.Element
 */
const StudyPlan: React.FC<StudyPlanProps> = (props) => {
  const { i18n, guider } = props;
  const studentHops =
    guider.currentStudent.hops && guider.currentStudent.hops.optedIn ? (
      <Hops data={guider.currentStudent.hops} />
    ) : null;

  if (!studentHops) {
    return null;
  }

  return (
    <div className="application-sub-panel">
      <h3 className="application-sub-panel__header">
        {i18n.text.get("plugin.guider.user.details.hops")}
      </h3>
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
    i18n: state.i18n,
    guider: state.guider,
  };
}

export default connect(mapStateToProps)(StudyPlan);
