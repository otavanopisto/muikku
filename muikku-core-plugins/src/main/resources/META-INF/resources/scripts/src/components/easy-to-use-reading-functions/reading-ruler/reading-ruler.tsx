import * as React from "react";
import Portal from "~/components/general/portal";
import { ReadingRulerBase } from "./reading-ruler-base";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { connect, Dispatch } from "react-redux";

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
  <Portal isOpen={props.active}>
    {<ReadingRulerBase active={props.active} onClose={props.onClose} />}
  </Portal>
);

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(ReadingRuler);
