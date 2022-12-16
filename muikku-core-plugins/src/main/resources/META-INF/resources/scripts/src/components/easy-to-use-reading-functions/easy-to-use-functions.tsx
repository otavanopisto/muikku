import * as React from "react";
import "~/sass/elements/easy-to-use-functions.scss";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { EasyToUseFunctionState } from "../../reducers/easy-to-use-functions/index";
import {
  CloseReadingRuler,
  closeReadingRuler,
} from "~/actions/easy-to-use-functions";
import { i18nType } from "~/reducers/base/i18nOLD";
import ReadingRuler from "./reading-ruler/reading-ruler";

/**
 * EasyToUseFunctionsProps
 */
interface EasyToUseFunctionsProps {
  i18nOLD: i18nType;
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
    i18nOLD: state.i18nOLD,
    easyToUse: state.easyToUse,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      closeReadingRuler,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(EasyToUseFunctions);
