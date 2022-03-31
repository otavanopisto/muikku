import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";

interface GuidanceRelationProps {
  i18n: i18nType;
}

const GuidanceRelation: React.FC<GuidanceRelationProps> = () => {
  return <div></div>;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(GuidanceRelation);
