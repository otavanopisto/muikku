import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setNotebookV2ActiveItem } from "~/actions/notebook/notebookV2";
import { NotebookAnnotationKind } from "~/components/base/material-loader/types";
import { StateType } from "~/reducers";

/**
 * NotebookAnnotationShellProps
 */
export interface NotebookAnnotationShellProps {
  notebookAnnotationId: number;
  kind: NotebookAnnotationKind;
  children: React.ReactNode;
  className?: string;
  onActivateExtra?: () => void;
}

type Props = NotebookAnnotationShellProps &
  React.HTMLAttributes<HTMLSpanElement>;

/**
 * MaterialHighlightShell
 */
const NotebookAnnotationShell = React.forwardRef<HTMLSpanElement, Props>(
  (props, ref) => {
    const {
      notebookAnnotationId,
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

    const itemUiMode = useSelector(
      (state: StateType) => state.notebookV2.noteUiById[notebookAnnotationId]
    );

    const deletingModeActive = itemUiMode?.kind === "deleting";

    /**
     * Handles the click event for the material highlight shell.
     * @param e - The mouse event
     */
    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      const selection = window.getSelection();
      const hasSelectionInHighlight =
        !!selection &&
        !selection.isCollapsed &&
        selection.rangeCount > 0 &&
        selection.toString().trim().length > 0 &&
        selection.getRangeAt(0).intersectsNode(e.currentTarget);

      if (hasSelectionInHighlight) {
        return; // let selection-context-popover own this gesture
      }

      dispatch(setNotebookV2ActiveItem(notebookAnnotationId));
      onActivateExtra?.();
      onClick?.(e); // let Dropdown handlers run too
    };

    /**
     * Handles the key down event for the material highlight shell.
     * @param event - The keyboard event
     */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dispatch(setNotebookV2ActiveItem(notebookAnnotationId));
        onActivateExtra?.();
      }
    };

    const isActive = activeItemId === notebookAnnotationId;

    const classes = [
      "material-annotation",
      `material-annotation--${kind}`,
      isActive ? "material-annotation--active" : "",
      deletingModeActive ? "material-annotation--deleting" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        className={classes}
        data-external-annotation-id={notebookAnnotationId.toString()}
        data-external-annotation-kind={kind}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest} // IMPORTANT: forward Dropdown-injected hover/click props
      >
        {children}
      </span>
    );
  }
);

NotebookAnnotationShell.displayName = "NotebookAnnotationShell";
export default NotebookAnnotationShell;
