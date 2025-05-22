import * as React from "react";
import "~/sass/elements/easy-to-use-functions.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { EasyToUseFunctionState } from "../../reducers/easy-to-use-functions/index";
import {
  CloseReadingRuler,
  closeReadingRuler,
} from "~/actions/easy-to-use-functions";
import ReadingRuler from "./reading-ruler/reading-ruler";
import { AppDispatch } from "~/reducers/configureStore";

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      closeReadingRuler,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EasyToUseFunctions);
