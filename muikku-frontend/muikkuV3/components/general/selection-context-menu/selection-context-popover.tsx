import * as React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { useReadspeakerContext } from "~/components/context/readspeaker-context";
import { useTextSelectionPopover } from "./use-text-selection-popover";
import { SelectionActionRuntimeContext, SelectionContextAction } from "./types";

type SelectionContextPopoverProps = {
  boundarySelector: string;
  actions: SelectionContextAction[];
};

/**
 * SelectionContextPopover component
 * @param props props
 * @returns SelectionContextPopover
 */
function SelectionContextPopover(props: SelectionContextPopoverProps) {
  const { rspkrLoaded } = useReadspeakerContext();

  const { loggedIn } = useSelector((state: StateType) => state.status);
  const editMode = useSelector(
    (state: StateType) => state.workspaces.editMode.active
  );

  const { open, context, close, restoreSelection, getSavedRange } =
    useTextSelectionPopover({
      enabled: loggedIn && !editMode && rspkrLoaded,
      loggedIn,
      editMode,
      rspkrLoaded,
      boundarySelector: props.boundarySelector,
    });

  if (!open || !context) {
    return null;
  }

  const runtimeContext: SelectionActionRuntimeContext = {
    text: context.text,
    readAreaId: context.readAreaId,
    restoreSelection,
    getSavedRange,
    close,
  };

  const visibleActions = props.actions.filter(
    (action) => !action.isVisible || action.isVisible(runtimeContext)
  );

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div
      className="selection-context-popover rs_skip_always"
      style={{
        position: "fixed",
        top: context.position.y,
        left: context.position.x,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.25rem",
        padding: "0.25rem",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        boxShadow: "0 4px 12px rgba(0 0 0 / 15%)",
        backgroundColor: "white",
      }}
      role="toolbar"
      aria-label="Text selection actions"
      onMouseDown={(event) => event.preventDefault()}
    >
      {visibleActions.map((action) => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        const handler = (event: React.MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          if (action.disabled) return;
          action.onAction(runtimeContext);
        };

        return (
          <Button
            key={action.id}
            icon={action.icon}
            iconPosition="left"
            aria-label={action.label}
            title={action.title ?? action.label}
            disabled={action.disabled}
            onClick={handler}
          >
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

export default SelectionContextPopover;
