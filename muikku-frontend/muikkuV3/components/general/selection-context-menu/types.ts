export type SelectionContext = {
  text: string;
  position: {
    x: number;
    y: number;
  };
  readAreaId: string | null;
  canUseReadSpeaker: boolean;
  isInActionableContent: boolean;
};

export type TextSelectionPopoverState = {
  open: boolean;
  context: SelectionContext | null;
};
