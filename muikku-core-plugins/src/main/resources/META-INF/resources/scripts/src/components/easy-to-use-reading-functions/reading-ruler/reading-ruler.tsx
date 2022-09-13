import * as React from "react";
import Portal from "~/components/general/portal";
import { ReadingRulerBase } from "./reading-ruler-base";
import { bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import { AnyActionType } from "~/actions";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

/**
 * ReadingRulerPortalProps
 */
interface ReadingRulerPortalProps {
  active: boolean;
  i18n: i18nType;
  onClose?: () => void;
}

/**
 * ReadingRulerPortal
 * @param props props
 * @returns Reading ruler within portal component
 */
export const ReadingRuler: React.FC<ReadingRulerPortalProps> = (props) => (
  <Portal isOpen={props.active}>
    {
      <ReadingRulerBase
        active={props.active}
        i18n={props.i18n}
        onClose={props.onClose}
      />
    }
  </Portal>
);

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadingRuler);
