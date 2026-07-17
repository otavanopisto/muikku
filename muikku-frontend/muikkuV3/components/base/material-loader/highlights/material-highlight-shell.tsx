import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotebookV2ActiveItem } from "~/actions/notebook/notebookV2";
import { MaterialHighlightKind } from "~/components/base/material-loader/types";
import { StateType } from "~/reducers";

/**
 * MaterialHighlightShellProps
 */
export interface MaterialHighlightShellProps {
  highlightId: number;
  kind: MaterialHighlightKind;
  children: React.ReactNode;
  className?: string;
  onActivateExtra?: () => void;
}

type Props = MaterialHighlightShellProps &
  React.HTMLAttributes<HTMLSpanElement>;

/**
 * MaterialHighlightShell
 */
const MaterialHighlightShell = React.forwardRef<HTMLSpanElement, Props>(
  (props, ref) => {
    const {
      highlightId,
      kind,
      children,
      className,
      onActivateExtra,
      onClick,
      ...rest
    } = props;

    const dispatch = useDispatch();
    const activeItemId = useSelector(
      (state: StateType) => state.notebookV2.activeItemId
    );

    const isActive = activeItemId === highlightId;

    const classes = [
      "material-highlight",
      `material-highlight--${kind}`,
      isActive ? "material-highlight--active" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        data-muikku-highlight-id={String(highlightId)}
        data-muikku-highlight-kind={kind}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          dispatch(setNotebookV2ActiveItem(highlightId));
          onActivateExtra?.();
          onClick?.(e); // let Dropdown handlers run too
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            dispatch(setNotebookV2ActiveItem(highlightId));
            onActivateExtra?.();
          }
        }}
        {...rest} // IMPORTANT: forward Dropdown-injected hover/click props
      >
        {children}
      </span>
    );
  }
);

MaterialHighlightShell.displayName = "MaterialHighlightShell";
export default MaterialHighlightShell;
