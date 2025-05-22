import * as React from "react";
import Portal from "~/components/general/portal";
import { ReadingRulerBase } from "./reading-ruler-base";
import { bindActionCreators } from "redux";
import { connect, Provider, ReactReduxContext } from "react-redux";
import { AppDispatch } from "~/reducers/configureStore";

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(ReadingRuler);
