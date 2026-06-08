/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  findReadspeakerPlayButtonInBoundary,
  resolveBoundaryElement,
} from "./selection-eligibility";
import { SelectionContextAction } from "./types";
import { buildAnnotationFromSelection } from "~/util/html";

type ReadSpeakerListenActionOptions = {
  boundarySelector: string;
  readspeakerButtonId?: string;
  rspkr: React.MutableRefObject<any>;
};

/**
 * Creates a selection context action for listening to selected text using ReadSpeaker.
 * @param options options
 * @returns SelectionContextAction
 */
export function createReadSpeakerListenAction(
  options: ReadSpeakerListenActionOptions
): SelectionContextAction {
  return {
    id: "readspeaker-listen",
    label: "Kuuntele valittu teksti",
    icon: "paper-plane",
    triggerOn: "mousedown",
    // eslint-disable-next-line jsdoc/require-jsdoc
    isVisible: (ctx) => ctx.canUseReadSpeaker,
    // eslint-disable-next-line jsdoc/require-jsdoc
    onAction: (ctx) => {
      ctx.restoreSelection();

      const boundary = resolveBoundaryElement(options.boundarySelector);
      const playButton = boundary
        ? findReadspeakerPlayButtonInBoundary(
            options.readspeakerButtonId,
            boundary
          )
        : null;

      if (!playButton) {
        ctx.close();
        return;
      }

      options.rspkr.current?.API?.setSelectionPlayer?.(playButton);
      playButton.click();
      ctx.close();
    },
  };
}

type CreateHighlightActionOptions = {
  materialHtml: string;
  boundarySelector: string;
  onMakeHighlight: (start: string, end: string, index: number) => void;
};

/**
 * Creates a selection context action for making a highlight on the selected text.
 * @param options options
 * @returns SelectionContextAction
 */
export function createHighlightAction(
  options: CreateHighlightActionOptions
): SelectionContextAction {
  return {
    id: "highlight",
    label: "Korosta",
    icon: "pencil",
    // eslint-disable-next-line jsdoc/require-jsdoc
    isVisible: (ctx) => ctx.isInActionableContent,
    // eslint-disable-next-line jsdoc/require-jsdoc
    onAction: (ctx) => {
      const range = ctx.getSavedRange();
      if (!range) {
        console.log("No range found");
        return;
      }
      const built = buildAnnotationFromSelection(
        options.materialHtml,
        options.boundarySelector,
        range,
        ctx.text
      );
      if (!built) {
        console.log("No built annotation found");
        ctx.close();
        return;
      }
      options.onMakeHighlight(built.start, built.end, built.index);
      ctx.close();
    },
  };
}

type CreateNoteActionOptions = {
  materialHtml: string;
  boundarySelector: string;
  onAddNote: (text: string, start: string, end: string, index: number) => void;
};

/**
 * Creates a selection context action for adding a note to the selected text.
 * @param options options
 * @returns SelectionContextAction
 */
export function createNoteAction(
  options: CreateNoteActionOptions
): SelectionContextAction {
  return {
    id: "note",
    label: "Lisää muistiinpano",
    icon: "note-add",
    disabled: !options.onAddNote,
    // eslint-disable-next-line jsdoc/require-jsdoc
    isVisible: (ctx) => ctx.isInActionableContent,
    // eslint-disable-next-line jsdoc/require-jsdoc
    onAction: (ctx) => {
      const range = ctx.getSavedRange();
      if (!range) {
        return;
      }
      const built = buildAnnotationFromSelection(
        options.materialHtml,
        options.boundarySelector,
        range,
        ctx.text
      );
      if (!built) {
        ctx.close();
        return;
      }
      options.onAddNote(ctx.text, built.start, built.end, built.index);
      ctx.close();
    },
  };
}
