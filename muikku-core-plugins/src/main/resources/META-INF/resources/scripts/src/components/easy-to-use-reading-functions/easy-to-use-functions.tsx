import * as React from "react";
import "~/sass/elements/easy-to-use-functions.scss";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { EasyToUseFunctionState } from "../../reducers/easy-to-use-functions/index";
import {
  CloseReadingRuler,
  closeReadingRuler,
} from "~/actions/easy-to-use-functions";
import ReadingRuler from "./reading-ruler/reading-ruler";

/**
 * EasyToUseFunctionsProps
 */
interface EasyToUseFunctionsProps {
  easyToUse: EasyToUseFunctionState;
  closeReadingRuler: CloseReadingRuler;
}

/**
 * EasyToUseFunctions
 * @param props props
 * @returns JSX.Element
 */
const EasyToUseFunctions: React.FC<EasyToUseFunctionsProps> = (props) => {
  if (props.easyToUse) {
    switch (props.easyToUse.activeTool) {
      case "Reading-ruler": {
        return <ReadingRuler active={true} onClose={props.closeReadingRuler} />;
      }

      default:
        return null;
    }
  }
  return null;
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    easyToUse: state.easyToUse,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      closeReadingRuler,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EasyToUseFunctions);
