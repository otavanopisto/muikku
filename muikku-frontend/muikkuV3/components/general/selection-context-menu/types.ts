export type SelectionContext = {
  text: string;
  position: { x: number; y: number };
  readAreaId: string | null;
  canUseReadSpeaker: boolean;
  isInActionableContent: boolean;
};

export type SelectionActionRuntimeContext = {
  text: string;
  readAreaId: string | null;
  canUseReadSpeaker: boolean;
  isInActionableContent: boolean;
  restoreSelection: () => void;
  getSavedRange: () => Range | null;
  close: () => void;
};

export type SelectionContextAction = {
  id: string;
  label: string;
  icon?: string;
  title?: string;
  disabled?: boolean;
  isVisible?: (ctx: SelectionActionRuntimeContext) => boolean;
  triggerOn?: "mousedown" | "click";
  onAction: (
    ctx: SelectionActionRuntimeContext,
    event: React.MouseEvent
  ) => void;
};

export type TextSelectionPopoverState = {
  open: boolean;
  context: SelectionContext | null;
};
