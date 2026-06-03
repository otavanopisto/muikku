import { MaterialHighlight } from "../types";

/**
 * v1 scope: only static rich text; skip widgets/fields/etc.
 */
const SKIP_ANCESTOR_SELECTOR = "script, style, iframe, object, noscript";

const HIGHLIGHT_ATTR = "data-muikku-highlight-id";
const HIGHLIGHT_KIND_ATTR = "data-muikku-highlight-kind";
const HIGHLIGHT_CLASS = "material-highlight";

/**
 * Note: This implementation uses RAW concatenated text content (no whitespace normalization).
 * Whatever you do here must match your "create highlight from selection" logic later.
 */

type TextSegment = {
  node: Text;
  start: number; // global offset
  end: number; // exclusive
};

type Searchable = {
  text: string;
  segments: TextSegment[];
  roots: Array<{ root: HTMLElement; start: number; end: number }>;
};

/**
 * Get searchable text from roots
 * @param roots - The roots to get searchable text from
 * @returns The searchable text
 */
function getSearchableFromRoots(roots: HTMLElement[]): Searchable {
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
        if (parent.closest(SKIP_ANCESTOR_SELECTOR))
          return NodeFilter.FILTER_REJECT;
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
 * Find all occurrences of a needle in a text
 * @param text - The text to find the occurrences in
 * @param needle - The needle to find
 * @returns The positions of the occurrences
 */
function findAllOccurrences(text: string, needle: string): number[] {
  const positions: number[] = [];
  if (!needle) return positions;
  let i = 0;
  while ((i = text.indexOf(needle, i)) !== -1) {
    positions.push(i);
    i += 1; // allow overlaps; keep consistent with create-time logic
  }
  return positions;
}

/**
 * Resolve a short highlight
 * @param text - The text to resolve the highlight in
 * @param anchor - The anchor to resolve the highlight
 * @param index - The index of the highlight
 * @returns The start and end of the highlight
 */
function resolveShort(
  text: string,
  anchor: string,
  index: number
): { start: number; end: number } | null {
  const positions = findAllOccurrences(text, anchor);
  if (index < 0 || index >= positions.length) return null;
  const start = positions[index];
  return { start, end: start + anchor.length };
}

/**
 * Long anchors: pair all start+end occurrences. This is "loose" by design
 * (middle can change). Index disambiguates.
 *
 * Optional refinement (recommended later): "minimize" candidates by taking
 * only the first end-occurrence after each start-occurrence.
 * @param text - The text to resolve the highlight in
 * @param startAnchor - The start anchor to resolve the highlight
 * @param endAnchor - The end anchor to resolve the highlight
 * @param index - The index of the highlight
 * @returns The start and end of the highlight
 */
function resolveLong(
  text: string,
  startAnchor: string,
  endAnchor: string,
  index: number
): { start: number; end: number } | null {
  const startPositions = findAllOccurrences(text, startAnchor);
  const endPositions = findAllOccurrences(text, endAnchor);

  const candidates: { start: number; end: number }[] = [];

  for (const s of startPositions) {
    for (const e of endPositions) {
      if (e < s + startAnchor.length) continue;
      candidates.push({ start: s, end: e + endAnchor.length });
    }
  }

  candidates.sort((a, b) => a.start - b.start || a.end - b.end);

  if (index < 0 || index >= candidates.length) return null;
  return candidates[index];
}

/**
 * Resolve a highlight
 * @param h - The highlight to resolve
 * @param searchableText - The searchable text to resolve the highlight in
 * @returns The start and end of the highlight
 */
function resolveHighlight(
  h: MaterialHighlight,
  searchableText: string
): { start: number; end: number } | null {
  if (h.start === h.end) {
    return resolveShort(searchableText, h.start, h.index);
  }
  return resolveLong(searchableText, h.start, h.end, h.index);
}

/**
 * Wrap offsets [startOffset, endOffset) in spans. Applies on a fresh DOM only.
 * This mutates the DOM (splits text nodes).
 * @param segments - The segments to wrap the offsets in
 * @param startOffset - The start offset to wrap
 * @param endOffset - The end offset to wrap
 * @param highlightId - The id of the highlight
 * @param kind - The kind of the highlight
 */
function wrapOffsetsWithSpan(
  segments: TextSegment[],
  startOffset: number,
  endOffset: number,
  highlightId: string,
  kind?: string
) {
  if (startOffset >= endOffset) return;

  // Find overlapping segments
  const affected = segments.filter(
    (s) => s.end > startOffset && s.start < endOffset
  );
  if (!affected.length) return;

  // Walk from end -> start within affected to reduce node split issues
  for (let i = affected.length - 1; i >= 0; i--) {
    const seg = affected[i];
    const node = seg.node;
    const parent = node.parentNode as HTMLElement | null;
    if (!parent) continue;

    const localStart = Math.max(0, startOffset - seg.start);
    const localEnd = Math.min(node.length, endOffset - seg.start);
    if (localStart >= localEnd) continue;

    // Split tail then head so the "middle" is isolatable
    if (localEnd < node.length) {
      node.splitText(localEnd);
    }
    let middle: Text = node;
    if (localStart > 0) {
      middle = node.splitText(localStart);
    }

    const span = document.createElement("span");
    span.className = HIGHLIGHT_CLASS;
    span.setAttribute(HIGHLIGHT_ATTR, highlightId);
    if (kind) span.setAttribute(HIGHLIGHT_KIND_ATTR, kind);

    parent.insertBefore(span, middle);
    span.appendChild(middle);
  }
}

/**
 * Public API
 * @param roots - The roots to inject the highlights into
 * @param highlights - The highlights to inject
 */
export function injectHighlights(
  roots: HTMLElement[],
  highlights: MaterialHighlight[]
) {
  if (!highlights?.length) return;

  const searchable = getSearchableFromRoots(roots);

  const resolved = highlights
    .map((h) => {
      // v1: ignore fieldName, only root/page scope
      const range = resolveHighlight(h, searchable.text);
      if (!range) return null;
      return {
        id: String(h.id),
        kind: h.kind,
        start: range.start,
        end: range.end,
      };
    })
    .filter(Boolean);

  // Apply from end->start globally
  resolved.sort((a, b) => b.start - a.start || b.end - a.end);

  for (const r of resolved) {
    wrapOffsetsWithSpan(searchable.segments, r.start, r.end, r.id, r.kind);
  }
}
