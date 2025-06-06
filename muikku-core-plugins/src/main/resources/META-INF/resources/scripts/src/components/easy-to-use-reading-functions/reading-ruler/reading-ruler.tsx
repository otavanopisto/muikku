import * as React from "react";
import Portal from "~/components/general/portal";
import { ReadingRulerBase } from "./reading-ruler-base";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { connect, Provider, ReactReduxContext } from "react-redux";

/**
 * ReadingRulerPortalProps
 */
interface ReadingRulerPortalProps {
  active: boolean;
  onClose?: () => void;
}

/**
 * ReadingRulerPortal
 * @param props props
 * @returns Reading ruler within portal component
 */
export const ReadingRuler: React.FC<ReadingRulerPortalProps> = (props) => (
  <ReactReduxContext.Consumer>
    {({ store }) => (
      <Portal isOpen={props.active}>
        <Provider store={store}>
          <ReadingRulerBase active={props.active} onClose={props.onClose} />
        </Provider>
      </Portal>
    )}
  </ReactReduxContext.Consumer>
);

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(ReadingRuler);
