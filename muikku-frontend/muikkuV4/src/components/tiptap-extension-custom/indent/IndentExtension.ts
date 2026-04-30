import { Extension } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";

export type IndentOptions = {
  /**
   * Which node types can be indented.
   */
  types: string[];
  /**
   * Pixels per indent level.
   * @default 40
   */
  stepPx: number;
  /**
   * Maximum indent level.
   * @default 8
   */
  maxLevel: number;
};

declare module "@tiptap/core" {
  /**
   * Commands is the commands for the IndentExtension
   */
  interface Commands<ReturnType> {
    indent: {
      indentIncrease: () => ReturnType;
      indentDecrease: () => ReturnType;
      indentReset: () => ReturnType;
    };
  }
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param n - The number to clamp.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns The clamped number.
 */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Strip one specific margin side from style string.
 * Keeps the opposite side untouched.
 */
function stripMarginSide(
  style: string,
  propToStrip: "margin-left" | "margin-right"
): string {
  return style
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((decl) => {
      const prop = decl.split(":")[0]?.trim()?.toLowerCase();
      return prop !== propToStrip;
    })
    .join("; ");
}

type ParsedMargin = {
  raw: string;
  px: number | null;
};

/**
 * Parses a margin-left/right declaration from a style string.
 * Picks the last declaration if repeated.
 */
function parseMargin(
  styleAttr: string | null,
  prop: "margin-left" | "margin-right"
): ParsedMargin | null {
  if (!styleAttr) return null;

  const decls = styleAttr
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = decls.length - 1; i >= 0; i--) {
    const parts = decls[i].split(":");
    if (parts.length < 2) continue;
    const key = parts[0].trim().toLowerCase();
    if (key !== prop) continue;

    const valRaw = parts.slice(1).join(":").trim();
    const val = valRaw.toLowerCase();

    const m = /^(-?\d+(?:\.\d+)?)px$/.exec(val);
    const px = m ? Number(m[1]) : null;

    return { raw: val, px };
  }

  return null;
}

/**
 * Checks if a node is indentable.
 * @param node - The node to check.
 * @param typeNames - The set of type names to check.
 * @returns True if the node is indentable, false otherwise.
 */
function isIndentableBlock(node: Node, typeNames: Set<string>) {
  return node?.isBlock && typeNames.has(node.type.name);
}

/**
 * Gets the indent level of a node.
 * @param node - The node to get the indent level of.
 * @returns The indent level of the node.
 */
function getIndentLevel(node: Node): number {
  const raw = (node.attrs?.indent ?? 0) as unknown;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Collects the indent targets of a selection.
 * @param state - The editor state.
 * @param typeNames - The set of type names to check.
 * @returns The indent targets of the selection.
 */
function collectIndentTargets(
  state: EditorState,
  typeNames: Set<string>
): { pos: number; node: Node }[] {
  const { from, to } = state.selection;
  const targets: { pos: number; node: Node }[] = [];

  state.doc.nodesBetween(from, to, (node: Node, pos: number) => {
    if (!isIndentableBlock(node, typeNames)) return;
    targets.push({ pos, node });
    return false; // don't descend into this block
  });

  // Collapsed selection fallback: find closest indentable ancestor block.
  if (targets.length === 0) {
    const $from = state.selection.$from;
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (isIndentableBlock(node, typeNames)) {
        targets.push({ pos: $from.before(depth), node });
        break;
      }
    }
  }

  return targets;
}

/**
 * Updates the indent of a selected block.
 * @param props - The properties for the update.
 * @returns True if the indent was updated, false otherwise.
 */
function updateSelectedIndent(props: {
  state: EditorState;
  tr: Transaction;
  dispatch?: (tr: Transaction) => void;
  typeNames: Set<string>;
  nextIndent: (prev: number) => number;
}) {
  const { state, dispatch, typeNames, nextIndent } = props;
  let { tr } = props;

  const targets = collectIndentTargets(state, typeNames);

  if (targets.length === 0) return false;

  const wouldChange = targets.some(({ node }) => {
    const prev = getIndentLevel(node);
    const next = nextIndent(prev);
    return next !== prev;
  });

  if (!wouldChange) return false;

  for (let i = targets.length - 1; i >= 0; i--) {
    const { pos } = targets[i];
    const current = tr.doc.nodeAt(pos);
    if (!current) continue;

    const prevIndent = getIndentLevel(current);
    const next = nextIndent(prevIndent);
    const nextAttrs = { ...current.attrs };

    if (next <= 0) {
      delete nextAttrs.indent;
      // Keep opposite margin attr as-is; user may still want it preserved.
    } else {
      nextAttrs.indent = next;
    }

    tr = tr.setNodeMarkup(pos, undefined, nextAttrs);
  }

  if (dispatch) dispatch(tr);
  return true;
}

export const IndentExtension = Extension.create<IndentOptions>({
  name: "indent",

  addOptions() {
    return {
      types: [
        "paragraph",
        "heading",
        "blockquote",
        "bulletList",
        "orderedList",
        "taskList",
      ],
      stepPx: 40,
      maxLevel: 8,
    };
  },

  addGlobalAttributes() {
    const stepPx = this.options.stepPx;
    const maxLevel = this.options.maxLevel;

    return [
      {
        types: this.options.types,
        attributes: {
          /**
           * Logical indent level, rendered as margin-left or margin-right by dir.
           */
          indent: {
            default: null,

            parseHTML: (element: HTMLElement) => {
              const styleAttr = element.getAttribute("style");
              const dir = (element.getAttribute("dir") ?? "").toLowerCase();
              const isRtl = dir === "rtl";

              const logicalProp: "margin-left" | "margin-right" = isRtl
                ? "margin-right"
                : "margin-left";

              const parsed = parseMargin(styleAttr, logicalProp);
              if (!parsed) return null;
              if (parsed.px === null || !Number.isFinite(parsed.px))
                return null;

              const px = parsed.px;
              if (px <= 0) return null;

              const level = Math.round(px / stepPx);
              const clamped = clamp(level, 0, maxLevel);
              return clamped > 0 ? clamped : null;
            },

            renderHTML: (attrs: Record<string, unknown>) => {
              const indentRaw = attrs.indent;
              const indent =
                typeof indentRaw === "number"
                  ? indentRaw
                  : Number(indentRaw) || 0;

              // If no indent, still let opposite margin render from the other attribute.
              if (!indent) {
                const oppositeRaw = attrs.indentOppositeMarginPx;
                const opposite =
                  typeof oppositeRaw === "number"
                    ? oppositeRaw
                    : Number(oppositeRaw);

                if (!Number.isFinite(opposite) || opposite <= 0) return {};

                const dir = attrs.dir as string | undefined;
                const isRtl = dir === "rtl";
                const oppositeProp = isRtl ? "margin-left" : "margin-right";

                const prevStyle =
                  typeof attrs.style === "string" ? attrs.style : "";

                const base = stripMarginSide(prevStyle, oppositeProp);
                const decl = `${oppositeProp}: ${Math.round(opposite)}px`;
                const style = base ? `${base}; ${decl}` : decl;
                return { style };
              }

              const px = indent * stepPx;

              const dir = attrs.dir as string | undefined;
              const isRtl = dir === "rtl";

              const logicalProp = isRtl ? "margin-right" : "margin-left";
              const oppositeProp = isRtl ? "margin-left" : "margin-right";

              const prevStyle =
                typeof attrs.style === "string" ? attrs.style : "";

              // Remove only the side we are about to set for indent.
              // Opposite side is preserved and/or rewritten from indentOppositeMarginPx below.
              let styleBase = stripMarginSide(prevStyle, logicalProp);

              const logicalDecl = `${logicalProp}: ${px}px`;
              styleBase = styleBase
                ? `${styleBase}; ${logicalDecl}`
                : logicalDecl;

              const oppositeRaw = attrs.indentOppositeMarginPx;
              const opposite =
                typeof oppositeRaw === "number"
                  ? oppositeRaw
                  : Number(oppositeRaw);

              if (!Number.isFinite(opposite) || opposite <= 0) {
                return { style: styleBase };
              }

              // Re-write opposite side from canonical attribute to keep it stable.
              const baseWithoutOpposite = stripMarginSide(
                styleBase,
                oppositeProp
              );
              const oppositeDecl = `${oppositeProp}: ${Math.round(opposite)}px`;
              const finalStyle = baseWithoutOpposite
                ? `${baseWithoutOpposite}; ${oppositeDecl}`
                : oppositeDecl;

              return { style: finalStyle };
            },
          },

          /**
           * Stores opposite-side margin in px (integer), so we can preserve it
           * without enabling arbitrary style persistence.
           *
           * - LTR (default): stores margin-right px
           * - RTL: stores margin-left px
           */
          indentOppositeMarginPx: {
            default: null,
            parseHTML: (element: HTMLElement) => {
              const styleAttr = element.getAttribute("style");
              const dir = (element.getAttribute("dir") ?? "").toLowerCase();
              const isRtl = dir === "rtl";

              const oppositeProp: "margin-left" | "margin-right" = isRtl
                ? "margin-left"
                : "margin-right";

              const parsed = parseMargin(styleAttr, oppositeProp);
              if (!parsed) return null;
              if (parsed.px === null || !Number.isFinite(parsed.px))
                return null;
              if (parsed.px <= 0) return null;

              // Keep as integer px for stable output
              return Math.round(parsed.px);
            },
            // style rendering is handled in `indent.renderHTML`
            renderHTML: () => ({}),
          },
        },
      },
    ];
  },

  addCommands() {
    const typeNames = new Set(this.options.types);
    const max = this.options.maxLevel;

    return {
      indentIncrease:
        () =>
        ({ state, tr, dispatch }) =>
          updateSelectedIndent({
            state,
            tr,
            dispatch,
            typeNames,
            nextIndent: (prev) => clamp(prev + 1, 0, max),
          }),

      indentDecrease:
        () =>
        ({ state, tr, dispatch }) =>
          updateSelectedIndent({
            state,
            tr,
            dispatch,
            typeNames,
            nextIndent: (prev) => clamp(prev - 1, 0, max),
          }),

      indentReset:
        () =>
        ({ state, tr, dispatch }) =>
          updateSelectedIndent({
            state,
            tr,
            dispatch,
            typeNames,
            nextIndent: () => 0,
          }),
    };
  },
});

export default IndentExtension;
