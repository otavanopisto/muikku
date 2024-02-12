import * as React from "react";
import { DialogProps } from "../../general/dialog";
import Dialog from "../../general/dialog";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";

/**
 * ChatDialogProps
 */
interface ChatDialogProps extends DialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * Specific Chat dialog component that extends normal dialog with chat related
 * logic
 * @param props props
 */
const ChatDialog = (props: ChatDialogProps) => {
  const { children, ...rest } = props;

  const isMobile = useIsAtBreakpoint(40);

  let modifiers = props.modifier;

  if (isMobile && props.localElementId) {
    if (typeof modifiers === "string" && modifiers === "local") {
      modifiers === undefined;
    } else if (Array.isArray(modifiers) && modifiers.includes("local")) {
      modifiers = modifiers.filter((m) => m !== "local");
    }
  }
  return (
    <Dialog {...rest} modifier={modifiers}>
      {children}
    </Dialog>
  );
};

export default ChatDialog;
