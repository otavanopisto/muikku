/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { useReadspeakerContext } from "~/components/context/readspeaker-context";
import {
  findReadspeakerPlayButtonInBoundary,
  resolveBoundaryElement,
} from "./selection-eligibility";
import { useTextSelectionPopover } from "./use-text-selection-popover";

type SelectionContextPopoverProps = {
  boundarySelector: string;
  readspeakerButtonId?: string;
  loggedIn: boolean;
  editMode: boolean;
  onMakeHighlight?: (text: string) => void;
};

/**
 * Floating toolbar shown when user selects text in material content.
 * @param props props
 */
function SelectionContextPopover(props: SelectionContextPopoverProps) {
  const { rspkr, rspkrLoaded } = useReadspeakerContext();

  const { open, context, close, restoreSelection } = useTextSelectionPopover({
    enabled: props.loggedIn && !props.editMode && rspkrLoaded,
    loggedIn: props.loggedIn,
    editMode: props.editMode,
    rspkrLoaded,
    boundarySelector: props.boundarySelector,
  });

  /**
   * handleListenMouseDown
   * @param event event
   */
  const handleListenMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!context?.canUseReadSpeaker) {
      return;
    }

    restoreSelection();

    const boundary = resolveBoundaryElement(props.boundarySelector);

    const rs = rspkr.current;
    const playButton = boundary
      ? findReadspeakerPlayButtonInBoundary(props.readspeakerButtonId, boundary)
      : null;

    if (!playButton) {
      close();
      return;
    }

    rs?.API?.setSelectionPlayer?.(playButton);
    playButton.click();

    close();
  };

  if (!open || !context) {
    return null;
  }

  const style: React.CSSProperties = {
    position: "fixed",
    top: context.position.y,
    left: context.position.x,
    zIndex: 10000,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: "0.25rem",
    padding: "0.25rem",
    border: "1px solid #e0e0e0",
    borderRadius: "4px",
    boxShadow: "0 4px 12px rgba(0 0 0 / 15%)",
    backgroundColor: "white",
  };

  return (
    <div
      className="selection-context-popover rs_skip_always"
      style={style}
      role="toolbar"
      aria-label="Text selection actions"
      onMouseDown={(event) => event.preventDefault()}
    >
      {context.canUseReadSpeaker && (
        <Button
          icon="paper-plane"
          iconPosition="left"
          aria-label="Kuuntele valittu teksti"
          title="Kuuntele valittu teksti"
          onClick={handleListenMouseDown}
        >
          Kuuntele valittu teksti
        </Button>
      )}

      {context.isInActionableContent && (
        <Button
          icon="pencil"
          iconPosition="left"
          aria-label="Lisää muistiinpano"
          title="Lisää muistiinpano"
          disabled
        >
          Lisää muistiinpano
        </Button>
      )}
    </div>
  );
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    loggedIn: state.status.loggedIn,
    editMode: state.workspaces.editMode.active,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectionContextPopover);
