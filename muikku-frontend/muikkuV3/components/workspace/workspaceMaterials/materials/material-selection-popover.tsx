import * as React from "react";
import { useReadspeakerContext } from "~/components/context/readspeaker-context";
import SelectionContextPopover from "~/components/general/selection-context-menu/selection-context-popover";
import {
  createHighlightAction,
  createNoteAction,
  createReadSpeakerListenAction,
} from "~/components/general/selection-context-menu/actions";
import { SelectionContextAction } from "~/components/general/selection-context-menu/types";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { MATERIAL_CONTENT_SELECTOR } from "~/util/html";

export type MaterialSelectionPopoverProps = {
  workspaceMaterialId: number;
  pageIndex: number;
  materialHtml: string;
  onMakeHighlight?: (
    text: string,
    start: string,
    end: string,
    index: number,
    workspaceMaterialId: number
  ) => void;
  onAddNote?: (
    text: string,
    start: string,
    end: string,
    index: number,
    workspaceMaterialId: number
  ) => void;
  /** Optional extra actions for this page */
  extraActions?: SelectionContextAction[];
};

/**
 * Material-specific selection popover.
 * Builds the action list and delegates rendering to SelectionContextPopover.
 * @param props props
 */
function MaterialSelectionPopover(props: MaterialSelectionPopoverProps) {
  const { rspkr, rspkrLoaded, notifyReadSpeakerReadAreas } =
    useReadspeakerContext();
  const { loggedIn } = useSelector((state: StateType) => state.status);
  const editMode = useSelector(
    (state: StateType) => state.workspaces.editMode.active
  );

  const pageBoundarySelector = `#p-${props.workspaceMaterialId}`;
  const readspeakerButtonId = `readspeaker_button${props.pageIndex + 1}`;
  const listenEnabled = loggedIn && !editMode && rspkrLoaded;

  const actions = React.useMemo(() => {
    const baseActions: SelectionContextAction[] = [
      createReadSpeakerListenAction({
        boundarySelector: pageBoundarySelector,
        readspeakerButtonId,
        rspkr,
        enabled: listenEnabled,
        onReadSessionStart: notifyReadSpeakerReadAreas,
      }),
    ];

    if (props.onMakeHighlight) {
      baseActions.push(
        createHighlightAction({
          materialHtml: props.materialHtml,
          pageBoundarySelector,
          annotatableSelector: MATERIAL_CONTENT_SELECTOR,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onMakeHighlight: (text, start, end, index) =>
            props.onMakeHighlight!(
              text,
              start,
              end,
              index,
              props.workspaceMaterialId
            ),
        })
      );
    }

    if (props.onAddNote) {
      baseActions.push(
        createNoteAction({
          materialHtml: props.materialHtml,
          pageBoundarySelector,
          annotatableSelector: MATERIAL_CONTENT_SELECTOR,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onAddNote: (text, start, end, index) =>
            props.onAddNote!(
              text,
              start,
              end,
              index,
              props.workspaceMaterialId
            ),
        })
      );
    }

    if (props.extraActions?.length) {
      baseActions.push(...props.extraActions);
    }

    return baseActions;
  }, [
    pageBoundarySelector,
    readspeakerButtonId,
    rspkr,
    listenEnabled,
    props.onMakeHighlight,
    props.onAddNote,
    props.extraActions,
    props.materialHtml,
    props.workspaceMaterialId,
    notifyReadSpeakerReadAreas,
  ]);

  return (
    <SelectionContextPopover
      boundarySelector={pageBoundarySelector}
      actions={actions}
    />
  );
}

export default MaterialSelectionPopover;
