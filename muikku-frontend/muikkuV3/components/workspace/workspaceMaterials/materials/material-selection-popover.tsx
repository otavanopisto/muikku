import * as React from "react";
import { useReadspeakerContext } from "~/components/context/readspeaker-context";
import SelectionContextPopover from "~/components/general/selection-context-menu/selection-context-popover";
import {
  createHighlightAction,
  createNoteAction,
  createReadSpeakerListenAction,
} from "~/components/general/selection-context-menu/actions";
import { SelectionContextAction } from "~/components/general/selection-context-menu/types";

export type MaterialSelectionPopoverProps = {
  workspaceMaterialId: number;
  pageIndex: number;
  materialHtml: string;
  onMakeHighlight?: (
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
  const { rspkr } = useReadspeakerContext();

  const boundarySelector = `#p-${props.workspaceMaterialId}`;
  const readspeakerButtonId = `readspeaker_button${props.pageIndex + 1}`;

  const actions = React.useMemo(() => {
    const baseActions: SelectionContextAction[] = [
      createReadSpeakerListenAction({
        boundarySelector,
        readspeakerButtonId,
        rspkr,
      }),
    ];

    if (props.onMakeHighlight) {
      baseActions.push(
        createHighlightAction({
          materialHtml: props.materialHtml,
          boundarySelector,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onMakeHighlight: (start, end, index) =>
            props.onMakeHighlight!(
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
          boundarySelector,
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
    boundarySelector,
    readspeakerButtonId,
    rspkr,
    props.onMakeHighlight,
    props.onAddNote,
    props.extraActions,
    props.materialHtml,
    props.workspaceMaterialId,
  ]);

  return (
    <SelectionContextPopover
      boundarySelector={boundarySelector}
      actions={actions}
    />
  );
}

export default MaterialSelectionPopover;
