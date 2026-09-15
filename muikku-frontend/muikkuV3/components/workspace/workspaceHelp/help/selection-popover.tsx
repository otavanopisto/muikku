import * as React from "react";
import { useReadspeakerContext } from "~/components/context/readspeaker-context";
import SelectionContextPopover from "~/components/general/selection-context-menu/selection-context-popover";
import { createReadSpeakerListenAction } from "~/components/general/selection-context-menu/actions";
import { SelectionContextAction } from "~/components/general/selection-context-menu/types";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

export type HelpSelectionPopoverProps = {
  workspaceMaterialId: number;
  pageIndex: number;
  materialHtml: string;
  /** Optional extra actions for this page */
  extraActions?: SelectionContextAction[];
};

/**
 * Material-specific selection popover.
 * Builds the action list and delegates rendering to SelectionContextPopover.
 * @param props props
 */
function HelpSelectionPopover(props: HelpSelectionPopoverProps) {
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

    if (props.extraActions?.length) {
      baseActions.push(...props.extraActions);
    }

    return baseActions;
  }, [
    pageBoundarySelector,
    readspeakerButtonId,
    rspkr,
    listenEnabled,
    props.extraActions,
    notifyReadSpeakerReadAreas,
  ]);

  return (
    <SelectionContextPopover
      boundarySelector={pageBoundarySelector}
      actions={actions}
    />
  );
}

export default HelpSelectionPopover;
