import { MaterialHighlight } from "~/components/base/material-loader/types";
import { MemoFieldContentFormat } from "~/util/memo-content-format";

// =============================================================================
// HTML VALIDATION
// =============================================================================

/**
 * Checks if the string is valid HTML
 * @param str str
 */
export const isValidHTML = (str: string): boolean => {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

// =============================================================================
// ANNOTATION CONSTANTS
// =============================================================================

/** v1 scope: only static rich text; skip widgets/fields/etc. */
const SKIP_ANCESTOR_SELECTOR =
  "script, style, iframe, object, noscript, .visually-hidden";

const ANNOTATION_ATTR = "data-muikku-annotation-id";
const ANNOTATION_KIND_ATTR = "data-muikku-annotation-kind";
const ANNOTATION_CLASS = "material-annotation";
const ANNOTATION_SELECTOR = ".material-annotation, [data-muikku-annotation-id]";
const NON_ANNOTATABLE_SELECTOR = [
  ".rs_skip_always",
  ".rs_skip",
  "input",
  "textarea",
  "select",
  "button",
  "iframe",
  "object",
  "[contenteditable='true']",
].join(", ");
const PARAGRAPH_LIKE_SELECTOR = [
  "p",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "pre",
  "td",
  "th",
  "dt",
  "dd",
  "figcaption",
].join(", ");
// =============================================================================
// ANNOTATION TYPES
// =============================================================================

type TextSegment = {
  node: Text;
  start: number;
  end: number;
};

type Searchable = {
  text: string;
  segments: TextSegment[];
  roots: Array<{ root: HTMLElement; start: number; end: number }>;
};

export type BuiltAnnotationSelection = {
  text: string;
  start: string;
  end: string;
  index: number;
};

// =============================================================================
// SEARCHABLE TEXT
// =============================================================================

/**
 * Searchable text is the concatenation of Text.nodeValue in document order.
 * There is no whitespace normalization (nbsp, shy, source newlines stay as-is).
 *
 * Create, inject, and resolve must all use this same stream. Do not use
 * Selection.toString() or Range.toString() as the annotation needle: Firefox
 * serializes those as copy-to-clipboard text (nbsp → space, strips shy, may
 * insert \n at <br>/blocks), which will not match this stream.
 */

/**
 * Walk DOM roots into a searchable string plus per-node offset segments.
 * Skips text inside script/style/iframe/object/noscript.
 *
 * `segments[i].start` / `.end` are offsets into `text`. Mapping a live Range
 * onto those offsets is how selection is converted to a character range.
 *
 * @param roots top-level elements to walk (live content or parsed HTML)
 * @returns concatenated text, text-node segments, and per-root spans
 */
export function getSearchableFromRoots(roots: HTMLElement[]): Searchable {
  const segments: TextSegment[] = [];
  const rootsWithOffsets: Array<{
    root: HTMLElement;
    start: number;
    end: number;
  }> = [];

  let text = "";
  let offset = 0;

  for (const root of roots) {
    const rootStart = offset;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      acceptNode(node: Node) {
        const t = node as Text;
        const parent = t.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest(SKIP_ANCESTOR_SELECTOR)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!t.nodeValue) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      const value = node.nodeValue ?? "";
      const start = offset;
      const end = offset + value.length;
      segments.push({ node, start, end });
      text += value;
      offset = end;
    }

    rootsWithOffsets.push({ root, start: rootStart, end: offset });
  }

  return { text, segments, roots: rootsWithOffsets };
}

/**
 * Build searchable text from stored material HTML.
 * Mirrors MaterialLoader: parse the fragment and walk $(html).toArray()
 * top-level roots, so inject-time offsets match create-time html offsets.
 *
 * @param html material html fragment
 */
export function getSearchableFromMaterialHtml(html: string): Searchable {
  const template = document.createElement("div");
  template.innerHTML = html.trim();
  return getSearchableFromRoots(Array.from(template.children) as HTMLElement[]);
}

// =============================================================================
// ANNOTATION RESOLVE (shared by inject + create)
// =============================================================================

/**
 * Find all occurrences of a needle in text
 * @param text text
 * @param needle needle
 */
function findAllOccurrences(text: string, needle: string): number[] {
  const positions: number[] = [];
  if (!needle) return positions;

  let i = 0;
  while ((i = text.indexOf(needle, i)) !== -1) {
    positions.push(i);
    i += 1;
  }

  return positions;
}

/**
 * Build start/end anchors from selected text
 * @param selectedText selected text
 */
export function buildAnnotationAnchors(selectedText: string): {
  start: string;
  end: string;
} {
  const trimmed = selectedText.trim();

  if (!trimmed) {
    return { start: "", end: "" };
  }

  if (trimmed.length <= 16) {
    return { start: trimmed, end: trimmed };
  }

  return {
    start: trimmed.substring(0, 16),
    end: trimmed.substring(trimmed.length - 16),
  };
}

/**
 * Build long-rule candidate ranges
 * @param text searchable text
 * @param startAnchor start anchor
 * @param endAnchor end anchor
 */
function buildLongCandidates(
  text: string,
  startAnchor: string,
  endAnchor: string
): Array<{ start: number; end: number }> {
  const startPositions = findAllOccurrences(text, startAnchor);
  const endPositions = findAllOccurrences(text, endAnchor);
  const candidates: Array<{ start: number; end: number }> = [];

  for (const s of startPositions) {
    for (const e of endPositions) {
      if (e + endAnchor.length <= s) continue;
      candidates.push({ start: s, end: e + endAnchor.length });
    }
  }

  return candidates.sort((a, b) => a.start - b.start || a.end - b.end);
}

/**
 * Classify whether an annotation resolves in searchable text.
 * @param annotation annotation
 * @param searchableText searchable text
 */
export function classifyAnnotation(
  annotation: Pick<MaterialHighlight, "start" | "end" | "index">,
  searchableText: string
): AnnotationResolveStatus {
  const { start: startAnchor, end: endAnchor, index } = annotation;
  if (!startAnchor || !endAnchor) {
    return { status: "orphaned", reason: "anchor_missing" };
  }
  if (startAnchor === endAnchor) {
    const positions = findAllOccurrences(searchableText, startAnchor);
    if (positions.length === 0) {
      return { status: "orphaned", reason: "anchor_missing" };
    }
    if (index < 0 || index >= positions.length) {
      return { status: "orphaned", reason: "index_out_of_range" };
    }
    const start = positions[index];
    return {
      status: "active",
      range: { start, end: start + startAnchor.length },
    };
  }

  const startPositions = findAllOccurrences(searchableText, startAnchor);
  const endPositions = findAllOccurrences(searchableText, endAnchor);
  if (startPositions.length === 0 || endPositions.length === 0) {
    return { status: "orphaned", reason: "anchor_missing" };
  }
  const candidates = buildLongCandidates(
    searchableText,
    startAnchor,
    endAnchor
  );
  if (candidates.length === 0) {
    return { status: "orphaned", reason: "unresolvable" };
  }
  if (index < 0 || index >= candidates.length) {
    return { status: "orphaned", reason: "index_out_of_range" };
  }
  return { status: "active", range: candidates[index] };
}

/**
 * Compute 0-based occurrence index for a selection inside searchable text
 * @param searchableText html searchable text
 * @param startAnchor start anchor
 * @param endAnchor end anchor
 * @param selectionStart selection start offset in html text
 * @param selectionEnd selection end offset in html text
 */
export function computeAnnotationIndex(
  searchableText: string,
  startAnchor: string,
  endAnchor: string,
  selectionStart: number,
  selectionEnd: number
): number {
  if (!startAnchor || !endAnchor) {
    return 0;
  }

  if (startAnchor === endAnchor) {
    const positions = findAllOccurrences(searchableText, startAnchor);
    if (positions.length <= 1) return 0;

    const exact = positions.indexOf(selectionStart);
    return exact >= 0 ? exact : 0;
  }

  const candidates = buildLongCandidates(
    searchableText,
    startAnchor,
    endAnchor
  );

  if (candidates.length <= 1) {
    return 0;
  }

  let idx = candidates.findIndex(
    (c) => c.start === selectionStart && c.end === selectionEnd
  );
  if (idx >= 0) return idx;

  idx = candidates.findIndex(
    (c) => c.start <= selectionStart && c.end >= selectionEnd
  );
  return idx >= 0 ? idx : 0;
}

/**
 * Classify all annotations for a material html fragment.
 * Same searchable stream as inject (via getSearchableFromMaterialHtml).
 * @param materialHtml material html
 * @param annotations annotations
 */
export function classifyAnnotationsForMaterialHtml(
  materialHtml: string,
  annotations: MaterialHighlight[]
): AnnotationClassification[] {
  if (!annotations?.length) return [];
  const searchable = getSearchableFromMaterialHtml(materialHtml);
  return annotations.map((annotation) => ({
    id: String(annotation.id),
    annotation,
    result: classifyAnnotation(annotation, searchable.text),
  }));
}

/**
 * Map annotation id -> resolve status.
 * @param classifications classifications
 */
export function annotationStatusById(
  classifications: AnnotationClassification[]
): Map<string, AnnotationResolveStatus> {
  return new Map(classifications.map((c) => [c.id, c.result]));
}

/**
 * Whether annotation is orphaned.
 * @param status status
 */
export function isAnnotationOrphaned(
  status: AnnotationResolveStatus | undefined
): boolean {
  return status?.status === "orphaned";
}

/**
 * Keep only annotations that resolve as active for this page HTML.
 * Same rules as notebook orphan badge (classifyAnnotationsForMaterialHtml).
 * @param materialHtml material html
 * @param annotations annotations
 */
export function filterActiveMaterialHighlights(
  materialHtml: string,
  annotations: MaterialHighlight[]
): MaterialHighlight[] {
  if (!materialHtml || !annotations?.length) return [];

  return classifyAnnotationsForMaterialHtml(materialHtml, annotations)
    .filter((c) => !isAnnotationOrphaned(c.result))
    .map((c) => c.annotation);
}

/**
 * Resolve anchor + index to character offsets in searchable text.
 * Caller must pre-filter orphans (filterActiveMaterialHighlights).
 * @param annotation annotation
 * @param searchableText searchable text
 */
function resolveAnnotationRange(
  annotation: Pick<MaterialHighlight, "start" | "end" | "index">,
  searchableText: string
): { start: number; end: number } | null {
  const result = classifyAnnotation(annotation, searchableText);
  return result.status === "active" ? result.range : null;
}

/**
 * Orphan reason if annotation is orphaned.
 * @param status status
 */
export function getAnnotationOrphanReason(
  status: AnnotationResolveStatus | undefined
): AnnotationOrphanReason | null {
  return status?.status === "orphaned" ? status.reason : null;
}

// =============================================================================
// ANNOTATION INTERSECTS
// =============================================================================

/**
 * Whether selection intersects an annotation.
 * @param range range
 */
export function selectionIntersectsAnnotation(range: Range | null): boolean {
  if (!range || range.collapsed) return false;
  const ancestor =
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as Element);
  if (!ancestor) return false;
  const scope =
    ancestor.closest(".material-page__content.rich-text") ??
    ancestor.closest('[id^="p-"], [id^="s-"]') ??
    ancestor;
  return Array.from(scope.querySelectorAll(ANNOTATION_SELECTOR)).some((node) =>
    range.intersectsNode(node)
  );
}

/**
 * Whether selection intersects non-annotatable elements.
 * @param range range
 */
export function selectionIntersectsNonAnnotatable(
  range: Range | null
): boolean {
  if (!range || range.collapsed) return false;
  const ancestor =
    range.commonAncestorContainer.nodeType === Node.TEXT_NODE
      ? range.commonAncestorContainer.parentElement
      : (range.commonAncestorContainer as Element);
  if (!ancestor) return false;
  const scope =
    ancestor.closest(".material-page__content.rich-text") ??
    ancestor.closest('[id^="p-"], [id^="s-"]') ??
    ancestor;
  return Array.from(scope.querySelectorAll(NON_ANNOTATABLE_SELECTOR)).some(
    (node) => range.intersectsNode(node)
  );
}

/**
 * Convert a node to an element
 * @param node node
 * @returns element or null
 */
function nodeToElement(node: Node): Element | null {
  return node.nodeType === Node.TEXT_NODE
    ? node.parentElement
    : (node as Element);
}

/**
 * Get the paragraph at the boundary
 * @param container container
 * @param offset offset
 * @param isEnd is end
 * @returns element or null
 */
function paragraphAtBoundary(
  container: Node,
  offset: number,
  isEnd: boolean
): Element | null {
  if (container.nodeType === Node.ELEMENT_NODE) {
    const children = container.childNodes;
    const child = children[isEnd ? offset - 1 : offset];
    if (child) {
      const fromChild = nodeToElement(child)?.closest(PARAGRAPH_LIKE_SELECTOR);
      if (fromChild) return fromChild;
    }
  }
  return nodeToElement(container)?.closest(PARAGRAPH_LIKE_SELECTOR) ?? null;
}

/**
 * Whether the selection crosses more than one paragraph-like block.
 * Highlights/notes are limited to a single block.
 * @param range range
 * @returns boolean
 */
export function selectionSpansMultipleParagraphs(range: Range | null): boolean {
  if (!range || range.collapsed) return false;
  return (
    paragraphAtBoundary(range.startContainer, range.startOffset, false) !==
    paragraphAtBoundary(range.endContainer, range.endOffset, true)
  );
}

// =============================================================================
// ANNOTATION INJECT (preprocessing)
// =============================================================================

/**
 * Wrap offsets [startOffset, endOffset) in spans. Fresh DOM only.
 * @param segments segments
 * @param startOffset start offset
 * @param endOffset end offset
 * @param annotationId annotation id
 * @param kind annotation kind
 */
function wrapOffsetsWithSpan(
  segments: TextSegment[],
  startOffset: number,
  endOffset: number,
  annotationId: string,
  kind?: string
) {
  if (startOffset >= endOffset) return;

  const affected = segments.filter(
    (s) => s.end > startOffset && s.start < endOffset
  );
  if (!affected.length) return;

  for (let i = affected.length - 1; i >= 0; i--) {
    const seg = affected[i];
    const node = seg.node;
    const parent = node.parentNode as HTMLElement | null;
    if (!parent) continue;

    const localStart = Math.max(0, startOffset - seg.start);
    const localEnd = Math.min(node.length, endOffset - seg.start);
    if (localStart >= localEnd) continue;

    if (localEnd < node.length) {
      node.splitText(localEnd);
    }

    let middle: Text = node;
    if (localStart > 0) {
      middle = node.splitText(localStart);
    }

    const span = document.createElement("span");
    span.className = ANNOTATION_CLASS;
    span.setAttribute(ANNOTATION_ATTR, annotationId);
    if (kind) span.setAttribute(ANNOTATION_KIND_ATTR, kind);

    parent.insertBefore(span, middle);
    span.appendChild(middle);
  }
}

/**
 * Inject annotations into HTML roots before MaterialLoader preprocessing
 * @param roots html roots
 * @param annotations annotations/highlights
 */
export function injectHtmlAnnotations(
  roots: HTMLElement[],
  annotations: MaterialHighlight[]
) {
  if (!annotations?.length) return;
  const searchable = getSearchableFromRoots(roots);
  const resolved = annotations
    .map((annotation) => {
      const range = resolveAnnotationRange(annotation, searchable.text);
      if (!range) return null;
      return {
        id: String(annotation.id),
        kind: annotation.kind,
        start: range.start,
        end: range.end,
      };
    })
    .filter(Boolean);
  resolved.sort((a, b) => b.start - a.start || b.end - a.end);
  for (const r of resolved) {
    wrapOffsetsWithSpan(searchable.segments, r.start, r.end, r.id, r.kind);
  }
}

/** @deprecated use injectHtmlAnnotations */
export const injectHighlights = injectHtmlAnnotations;

// =============================================================================
// ANNOTATION CREATE (selection -> model)
// =============================================================================

/**
 * Map a live DOM Range to [start, end) character offsets in searchable.text.
 *
 * Walks the same text segments as getSearchableFromRoots. For each intersecting
 * text node: if it is the range start/end container, use the range's local
 * offset; otherwise include the whole node.
 *
 * This is used instead of Range.toString().length because Firefox's Range
 * serialization can count extra characters (e.g. \n for <br> or blocks) that
 * are not in nodeValue, which would slice the wrong window.
 *
 * @param range live selection range (must sit inside root)
 * @param searchable live searchable built from root
 * @param root annotatable content element
 * @returns offsets into searchable.text, or null if the range is empty/outside
 */
function rangeOffsetsWithinRoot(
  range: Range,
  searchable: Searchable,
  root: Element
): { start: number; end: number } | null {
  if (!root.contains(range.commonAncestorContainer)) {
    return null;
  }
  let start: number | null = null;
  let end: number | null = null;
  for (const seg of searchable.segments) {
    const node = seg.node;
    if (!range.intersectsNode(node)) continue;
    const localStart = range.startContainer === node ? range.startOffset : 0;
    const localEnd =
      range.endContainer === node ? range.endOffset : node.length;
    const absStart = seg.start + clamp(localStart, 0, node.length);
    const absEnd = seg.start + clamp(localEnd, 0, node.length);
    if (start === null) start = absStart;
    end = absEnd;
  }
  if (start === null || end === null || start >= end) return null;
  return { start, end };
}

/**
 * Clamp a value between a minimum and maximum
 * @param value value
 * @param min minimum
 * @param max maximum
 * @returns clamped value
 */
function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Shrink a raw [start, end) window so the needle has no leading/trailing
 * whitespace. Offsets stay in searchable.text space (trim does not rewrite
 * nbsp/shy inside the selection).
 *
 * @param text searchable text
 * @param start raw start offset
 * @param end raw end offset
 * @returns trimmed window and the exact needle, or null if empty after trim
 */
function toTrimmedOffsets(
  text: string,
  start: number,
  end: number
): { start: number; end: number; trimmed: string } | null {
  const raw = text.slice(start, end);
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const lead = raw.length - raw.trimStart().length;
  const trail = raw.length - raw.trimEnd().length;
  return {
    start: start + lead,
    end: end - trail,
    trimmed,
  };
}

/**
 * Translate a live-DOM occurrence of `needle` into offsets in the original
 * material HTML searchable text.
 *
 * Live DOM can differ from stored HTML (highlight spans, ReadSpeaker wrappers).
 * If the strings are identical, live offsets are used as-is. Otherwise the
 * Nth occurrence of `needle` in live text is mapped to the Nth occurrence in
 * html text. Anchors must be computed from html offsets so they still resolve
 * after reload.
 *
 * @param htmlText searchable text from stored material HTML
 * @param liveText searchable text from the live content root
 * @param liveTrimmedStart start of this occurrence in liveText
 * @param needle exact live substring (raw nodeValue, not Selection.toString)
 * @returns html [start, end) or null if the occurrence cannot be mapped
 */
function mapContentOffsetToHtml(
  htmlText: string,
  liveText: string,
  liveTrimmedStart: number,
  needle: string
): { start: number; end: number } | null {
  const htmlPositions = findAllOccurrences(htmlText, needle);
  if (htmlPositions.length === 0) return null;
  if (htmlText === liveText) {
    return { start: liveTrimmedStart, end: liveTrimmedStart + needle.length };
  }
  const livePositions = findAllOccurrences(liveText, needle);
  const occurrenceIndex = livePositions.indexOf(liveTrimmedStart);
  if (occurrenceIndex < 0 || occurrenceIndex >= htmlPositions.length) {
    if (livePositions.length === 1 && htmlPositions.length === 1) {
      const start = htmlPositions[0];
      return { start, end: start + needle.length };
    }
    return null;
  }
  const start = htmlPositions[occurrenceIndex];
  return { start, end: start + needle.length };
}

export const MATERIAL_CONTENT_SELECTOR = ".material-page__content.rich-text";

/**
 * Turn a live text selection into a persistable annotation.
 *
 * Pipeline:
 * 1. Live searchable text from the annotatable root (same walk as inject).
 * 2. Range → character offsets via text-node segments (not Range.toString).
 * 3. Trim only leading/trailing whitespace; keep the raw inner substring.
 * 4. Map that occurrence onto stored material HTML searchable text.
 * 5. Build start/end anchors and a 0-based index in the HTML stream.
 *
 * `text` / `start` / `end` are slices of searchable text, not
 * Selection.toString(). Using clipboard-style selection text breaks Firefox
 * (nbsp, soft hyphens, inline spans) and orphans highlights on inject.
 *
 * @param materialHtml original material HTML (same source as inject)
 * @param boundarySelector page/panel root, e.g. #p-123
 * @param annotatableSelector content root inside the page
 * @param range live selection range inside the annotatable root
 * @returns text + anchors + index, or null if the selection cannot be mapped
 */
export function buildAnnotationFromSelection(
  materialHtml: string,
  boundarySelector: string,
  annotatableSelector: string,
  range: Range
): BuiltAnnotationSelection | null {
  const boundary = document.querySelector(boundarySelector);
  const contentRoot = boundary?.querySelector(annotatableSelector);

  if (!contentRoot) return null;

  const htmlSearchable = getSearchableFromMaterialHtml(materialHtml);
  const liveSearchable = getSearchableFromRoots([contentRoot as HTMLElement]);
  const rawOffsets = rangeOffsetsWithinRoot(
    range,
    liveSearchable,
    contentRoot as HTMLElement
  );

  if (!rawOffsets) return null;
  const liveOffsets = toTrimmedOffsets(
    liveSearchable.text,
    rawOffsets.start,
    rawOffsets.end
  );

  if (!liveOffsets) return null;
  const htmlOffsets = mapContentOffsetToHtml(
    htmlSearchable.text,
    liveSearchable.text,
    liveOffsets.start,
    liveOffsets.trimmed
  );

  if (!htmlOffsets) return null;
  const { start, end } = buildAnnotationAnchors(liveOffsets.trimmed);
  const index = computeAnnotationIndex(
    htmlSearchable.text,
    start,
    end,
    htmlOffsets.start,
    htmlOffsets.end
  );

  return { text: liveOffsets.trimmed, start, end, index };
}

export type AnnotationOrphanReason =
  | "html_missing"
  | "anchor_missing"
  | "index_out_of_range"
  | "unresolvable";

export type AnnotationResolveStatus =
  | { status: "active"; range: { start: number; end: number } }
  | { status: "orphaned"; reason: AnnotationOrphanReason };

export type AnnotationClassification = {
  id: string;
  annotation: MaterialHighlight;
  result: AnnotationResolveStatus;
};

// =============================================================================
// TO HTML UTILITIES
// =============================================================================

/**
 * Escapes HTML characters in a string.
 * @param str string to escape
 * @returns escaped string
 */
export const escapeHtml = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Extracts plain text from an HTML string.
 * @param html HTML string
 * @returns plain text
 */
export const htmlToPlainText = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent ?? "";
};

/**
 * Converts stored memo content to HTML the editor / readonly view can use.
 * Plain text is escaped so characters like <, > and & stay visible as text.
 * @param value value
 * @param format format
 * @param replaceNewlinesWithBreaks replace newlines with breaks
 * @returns memo display HTML string
 */
export const toMemoDisplayHtml = (
  value: string,
  format: MemoFieldContentFormat,
  replaceNewlinesWithBreaks: (str: string) => string
): string => {
  if (format === "html") {
    return value;
  }
  if (!value) {
    return "";
  }
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return "<p>" + replaceNewlinesWithBreaks(escapeHtml(normalized)) + "</p>";
};
