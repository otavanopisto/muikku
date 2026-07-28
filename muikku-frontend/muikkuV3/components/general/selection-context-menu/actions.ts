/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  findReadspeakerPlayButtonInBoundary,
  isSelectionInScope,
  isSelectionSkipped,
  resolveBoundaryElement,
} from "./selection-eligibility";
import { SelectionContextAction } from "./types";
import {
  buildAnnotationFromSelection,
  selectionIntersectsAnnotation,
} from "~/util/html";

type ReadSpeakerListenActionOptions = {
  /** Page/panel boundary, e.g. #p-123 */
  boundarySelector: string;
  readspeakerButtonId?: string;
  rspkr: React.MutableRefObject<any>;
  /** loggedIn && !editMode && rspkrLoaded */
  enabled: boolean;
  onReadSessionStart?: (readAreaIds: string[]) => void;
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
    isVisible: (ctx) =>
      options.enabled &&
      !!ctx.readAreaId &&
      !isSelectionSkipped(ctx.getSavedRange()) &&
      isSelectionInScope(
        ctx.getSavedRange(),
        options.boundarySelector,
        options.boundarySelector
      ),
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

      // Get read area id from boundary selector
      // Boundary selector is usually a page or panel id, e.g. #p-123
      // We need to get the read area id from the boundary selector
      // and notify read speaker about it
      const readAreaId = options.boundarySelector.startsWith("#")
        ? options.boundarySelector.slice(1)
        : options.boundarySelector;

      options.onReadSessionStart?.([readAreaId]);
      options.rspkr.current?.API?.setSelectionPlayer?.(playButton);
      playButton.click();
      ctx.close();
    },
  };
}

type CreateHighlightActionOptions = {
  materialHtml: string;
  /** Page/panel root, e.g. #p-123 */
  pageBoundarySelector: string;
  /** Annotatable content scope inside page */
  annotatableSelector: string;
  onMakeHighlight: (
    text: string,
    start: string,
    end: string,
    index: number
  ) => void;
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
    triggerOn: "mousedown",
    // eslint-disable-next-line jsdoc/require-jsdoc
    isVisible: (ctx) =>
      !selectionIntersectsAnnotation(ctx.getSavedRange()) &&
      isSelectionInScope(
        ctx.getSavedRange(),
        options.pageBoundarySelector,
        options.annotatableSelector
      ),
    // eslint-disable-next-line jsdoc/require-jsdoc
    onAction: (ctx) => {
      ctx.restoreSelection();
      const sel = window.getSelection();
      const range =
        sel?.rangeCount && !sel.isCollapsed
          ? sel.getRangeAt(0)
          : ctx.getSavedRange();
      if (!range) return;
      const built = buildAnnotationFromSelection(
        options.materialHtml,
        options.pageBoundarySelector,
        options.annotatableSelector,
        range,
        ctx.text
      );
      if (!built) {
        ctx.close();
        return;
      }
      options.onMakeHighlight(ctx.text, built.start, built.end, built.index);
      ctx.close();
    },
  };
}

type CreateNoteActionOptions = {
  materialHtml: string;
  pageBoundarySelector: string;
  annotatableSelector: string;
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
    triggerOn: "mousedown",
    disabled: !options.onAddNote,
    // eslint-disable-next-line jsdoc/require-jsdoc
    isVisible: (ctx) =>
      !selectionIntersectsAnnotation(ctx.getSavedRange()) &&
      isSelectionInScope(
        ctx.getSavedRange(),
        options.pageBoundarySelector,
        options.annotatableSelector
      ),
    // eslint-disable-next-line jsdoc/require-jsdoc
    onAction: (ctx) => {
      ctx.restoreSelection();
      const sel = window.getSelection();
      const range =
        sel?.rangeCount && !sel.isCollapsed
          ? sel.getRangeAt(0)
          : ctx.getSavedRange();
      if (!range) return;
      const built = buildAnnotationFromSelection(
        options.materialHtml,
        options.pageBoundarySelector,
        options.annotatableSelector,
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
