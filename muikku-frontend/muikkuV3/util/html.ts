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
const SKIP_ANCESTOR_SELECTOR = "script, style, iframe, object, noscript";

const ANNOTATION_ATTR = "data-muikku-highlight-id";
const ANNOTATION_KIND_ATTR = "data-muikku-highlight-kind";
const ANNOTATION_CLASS = "material-highlight";

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
  start: string;
  end: string;
  index: number;
};

// =============================================================================
// SEARCHABLE TEXT
// =============================================================================

/**
 * Note: RAW concatenated text content (no whitespace normalization).
 * Create-time logic must use the same rules as inject-time logic.
 */

/**
 * Get searchable text from DOM roots
 * @param roots roots
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
 * Build searchable text from material HTML.
 * Mirrors MaterialLoader: $(html).toArray() top-level roots.
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
 * Measure range start/end as character offsets within a root element.
 * More robust than walking individual text segments.
 * @param range range
 * @param root root
 */
function rangeOffsetsWithinRoot(
  range: Range,
  root: Element
): { start: number; end: number } | null {
  if (!root.contains(range.commonAncestorContainer)) {
    return null;
  }

  let start = 0;
  let end = 0;
  const pre = document.createRange();
  try {
    pre.selectNodeContents(root);
    pre.setEnd(range.startContainer, range.startOffset);
    start = pre.toString().length;
    pre.setEnd(range.endContainer, range.endOffset);
    end = pre.toString().length;
  } catch {
    return null;
  }
  return start < end ? { start, end } : null;
}

/**
 * Adjust raw range offsets to trimmed needle boundaries.
 * @param text text
 * @param start start
 * @param end end
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
 * Map live content occurrence to html searchable offsets.
 * @param htmlText html text
 * @param liveText live text
 * @param liveTrimmedStart live trimmed start
 * @param needle needle
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
 * Build annotation from selection
 * @param materialHtml material html
 * @param boundarySelector boundary selector
 * @param annotatableSelector annotatable selector
 * @param range range
 * @param selectedText selected text
 * @returns BuiltAnnotationSelection | null
 */
export function buildAnnotationFromSelection(
  materialHtml: string,
  boundarySelector: string,
  annotatableSelector: string,
  range: Range,
  selectedText: string
): BuiltAnnotationSelection | null {
  const trimmed = selectedText.trim();
  if (!trimmed) return null;

  const boundary = document.querySelector(boundarySelector);
  const contentRoot = boundary?.querySelector(annotatableSelector);
  if (!contentRoot) return null;

  const htmlSearchable = getSearchableFromMaterialHtml(materialHtml);
  const liveSearchable = getSearchableFromRoots([contentRoot as HTMLElement]);

  const rawOffsets = rangeOffsetsWithinRoot(range, contentRoot);
  if (!rawOffsets) return null;

  const liveOffsets = toTrimmedOffsets(
    liveSearchable.text,
    rawOffsets.start,
    rawOffsets.end
  );

  if (!liveOffsets || liveOffsets.trimmed !== trimmed) return null;

  const htmlOffsets = mapContentOffsetToHtml(
    htmlSearchable.text,
    liveSearchable.text,
    liveOffsets.start,
    liveOffsets.trimmed
  );

  if (!htmlOffsets) return null;

  const { start, end } = buildAnnotationAnchors(trimmed);
  const index = computeAnnotationIndex(
    htmlSearchable.text,
    start,
    end,
    htmlOffsets.start,
    htmlOffsets.end
  );
  return { start, end, index };
}

export type AnnotationOrphanReason =
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
 * Converts an HTML string to a memo display HTML string.
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
  return "<p>" + replaceNewlinesWithBreaks(escapeHtml(value)) + "</p>";
};
