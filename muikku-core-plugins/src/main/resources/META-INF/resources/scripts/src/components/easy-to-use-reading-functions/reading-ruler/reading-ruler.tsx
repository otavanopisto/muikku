import * as React from "react";
import Portal from "~/components/general/portal";
import { ReadingRulerBase } from "./reading-ruler-base";

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
