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
 * Strips margin-left/right declarations from a style string.
 * @param style - The style string to strip.
 * @returns The stripped style string.
 */
function stripMarginLeftRight(style: string): string {
  // Remove any existing margin-left/right declarations to avoid duplicates.
  return style
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((decl) => {
      const prop = decl.split(":")[0]?.trim()?.toLowerCase();
      return prop !== "margin-left" && prop !== "margin-right";
    })
    .join("; ");
}

/**
 * Parses a margin-left/right declaration from a style string.
 * @param styleAttr - The style string to parse.
 * @param prop - The property to parse.
 * @returns The parsed margin in pixels.
 */
function parseMarginPx(
  styleAttr: string | null,
  prop: "margin-left" | "margin-right"
) {
  if (!styleAttr) return null;
  // pick the last declaration if repeated
  const decls = styleAttr
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (let i = decls.length - 1; i >= 0; i--) {
    const parts = decls[i].split(":");
    if (parts.length < 2) continue;
    const key = parts[0].trim().toLowerCase();
    const val = parts.slice(1).join(":").trim().toLowerCase();
    if (key !== prop) continue;

    // Only px for now
    const m = /^(-?\d+(?:\.\d+)?)px$/.exec(val);
    if (!m) return null;
    return Number(m[1]);
  }

  return null;
}

/**
 * Checks if a node is indentable.
 * @param node - The node to check.
 * @param typeNames - The set of type names.
 * @returns True if the node is indentable, false otherwise.
 */
function isIndentableBlock(node: Node, typeNames: Set<string>) {
  return node?.isBlock && typeNames.has(node.type.name);
}

/**
 * Reads logical indent level from a node's attrs (0 if unset / invalid).
 */
function getIndentLevel(node: Node): number {
  const raw = (node.attrs?.indent ?? 0) as unknown;
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Collects the indent targets from the state.
 * @param state - The state to collect the indent targets from.
 * @param typeNames - The set of type names.
 * @returns The indent targets.
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
 * Updates the selected indent.
 * @param props - The properties for the update.
 * @returns True if the indent was updated, false otherwise.
 */
function updateSelectedIndent(props: {
  state: EditorState;
  tr: Transaction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch?: (tr: any) => void;
  typeNames: Set<string>;
  nextIndent: (prev: number) => number;
}) {
  const { state, dispatch, typeNames, nextIndent } = props;
  let { tr } = props;

  // Collect the indent targets from the state.
  const targets = collectIndentTargets(state, typeNames);

  if (targets.length === 0) return false;

  // If nothing would change (e.g. decrease at 0 everywhere, increase at max everywhere),
  // return false so editor.can() matches real behavior.
  const wouldChange = targets.some(({ node }) => {
    const prev = getIndentLevel(node);
    const next = nextIndent(prev);
    return next !== prev;
  });

  if (!wouldChange) return false;

  // bottom-to-top (safe if structure changes)
  for (let i = targets.length - 1; i >= 0; i--) {
    const { pos } = targets[i];
    const current = tr.doc.nodeAt(pos);
    if (!current) continue;
    const prevIndent = getIndentLevel(current);
    const next = nextIndent(prevIndent);
    const nextAttrs = { ...current.attrs };
    if (next <= 0) {
      delete nextAttrs.indent;
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
    //const typeNames = new Set(this.options.types);
    const stepPx = this.options.stepPx;

    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: null,

            parseHTML: (element: HTMLElement) => {
              const styleAttr = element.getAttribute("style");
              const ml = parseMarginPx(styleAttr, "margin-left");
              const mr = parseMarginPx(styleAttr, "margin-right");

              const px = mr ?? ml;
              if (typeof px !== "number" || !Number.isFinite(px)) return null;

              const level = Math.round(px / stepPx);
              return level > 0 ? level : null;
            },

            renderHTML: (attrs: Record<string, unknown>) => {
              const indentRaw = attrs.indent;
              const indent =
                typeof indentRaw === "number"
                  ? indentRaw
                  : Number(indentRaw) || 0;
              if (!indent) return {};

              const px = indent * stepPx;

              const dir = attrs.dir as string | undefined;
              const isRtl = dir === "rtl";

              // Preserve other styles; normalize margin-left/right.
              const prevStyle =
                typeof attrs.style === "string" ? attrs.style : "";
              const base = stripMarginLeftRight(prevStyle);

              const marginDecl = isRtl
                ? `margin-right: ${px}px`
                : `margin-left: ${px}px`;
              const style = base ? `${base}; ${marginDecl}` : marginDecl;

              return { style };
            },
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
