import { Extension, Mark } from "@tiptap/core";
import type { Node as PMNode } from "@tiptap/pm/model";
import type { EditorState, Transaction } from "@tiptap/pm/state";

export type LangOptions = {
  /**
   * Block node types that should support `lang=""` attribute.
   * Suggestion: include listItem so list content inherits.
   */
  blockTypes: string[];
};

declare module "@tiptap/core" {
  /**
   * Commands for the lang extension.
   * @returns The return type.
   */
  interface Commands<ReturnType> {
    lang: {
      setTextLang: (lang: string) => ReturnType;
      unsetTextLang: () => ReturnType;
      setBlockLang: (lang: string) => ReturnType;
      unsetBlockLang: () => ReturnType;
    };
  }
}

/**
 * Checks if the node is a target block.
 * @param node - The node to check.
 * @param typeNames - The set of type names.
 * @returns True if the node is a target block, false otherwise.
 */
function isTargetBlock(node: PMNode, typeNames: Set<string>) {
  return node.isBlock && typeNames.has(node.type.name);
}

/**
 * Collects the block targets from the state.
 * @param state - The state to collect the block targets from.
 * @param typeNames - The set of type names.
 * @returns The block targets.
 */
function collectBlockTargets(
  state: EditorState,
  typeNames: Set<string>
): { pos: number; node: PMNode }[] {
  const { from, to } = state.selection;
  const targets: { pos: number; node: PMNode }[] = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!isTargetBlock(node, typeNames)) return;
    targets.push({ pos, node });
    return false;
  });

  // caret fallback
  if (targets.length === 0) {
    const $from = state.selection.$from;
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (isTargetBlock(node, typeNames)) {
        targets.push({ pos: $from.before(depth), node });
        break;
      }
    }
  }

  return targets;
}

/**
 * Updates the block lang.
 * @param props - The properties for the update.
 * @returns True if the block lang was updated, false otherwise.
 */
function updateBlockLang(props: {
  state: EditorState;
  tr: Transaction;
  dispatch?: (tr: Transaction) => void;
  typeNames: Set<string>;
  nextLang: (prev: string | null) => string | null;
}) {
  const { state, dispatch, typeNames, nextLang } = props;
  let { tr } = props;

  const targets = collectBlockTargets(state, typeNames);
  if (targets.length === 0) return false;

  // Make editor.can() accurate: return false if it'd be a no-op.
  const wouldChange = targets.some(
    ({ node }) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      nextLang(node.attrs?.lang ?? null) !== (node.attrs?.lang ?? null)
  );
  if (!wouldChange) return false;

  for (let i = targets.length - 1; i >= 0; i--) {
    const { pos } = targets[i];
    const current = tr.doc.nodeAt(pos);
    if (!current) continue;

    const prev = (current.attrs?.lang ?? null) as string | null;
    const next = nextLang(prev);

    const attrs = { ...current.attrs };
    if (!next) {
      delete attrs.lang;
    } else {
      attrs.lang = next;
    }

    tr = tr.setNodeMarkup(pos, undefined, attrs);
  }

  if (dispatch) dispatch(tr);
  return true;
}

export const TextLangMark = Mark.create({
  name: "textLang",
  priority: 1000,
  spanning: true,

  addAttributes() {
    return {
      lang: {
        default: null,
        parseHTML: (el) => el.getAttribute("lang"),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        renderHTML: (attrs) => (attrs.lang ? { lang: attrs.lang } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span[lang]" }];
  },

  renderHTML({ HTMLAttributes }) {
    // Minimal output: <span lang="xx">...</span>
    return ["span", HTMLAttributes, 0];
  },
});

export const LangExtension = Extension.create<LangOptions>({
  name: "lang",

  addOptions() {
    return {
      blockTypes: ["paragraph", "heading", "blockquote", "listItem"],
    };
  },

  addExtensions() {
    return [TextLangMark];
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.blockTypes,
        attributes: {
          lang: {
            default: null,
            parseHTML: (el: HTMLElement) => el.getAttribute("lang"),
            renderHTML: (attrs: Record<string, unknown>) =>
              typeof attrs.lang === "string" && attrs.lang
                ? { lang: attrs.lang }
                : {},
          },
        },
      },
    ];
  },

  addCommands() {
    const typeNames = new Set(this.options.blockTypes);

    return {
      setTextLang:
        (lang: string) =>
        ({ commands }) => {
          // “Override” behavior: remove existing lang mark, then apply the new one.
          commands.unsetMark("textLang");
          return commands.setMark("textLang", { lang });
        },

      unsetTextLang:
        () =>
        ({ commands }) =>
          commands.unsetMark("textLang"),

      setBlockLang:
        (lang: string) =>
        ({ state, tr, dispatch }) =>
          updateBlockLang({
            state,
            tr,
            dispatch,
            typeNames,
            nextLang: () => lang,
          }),

      unsetBlockLang:
        () =>
        ({ state, tr, dispatch }) =>
          updateBlockLang({
            state,
            tr,
            dispatch,
            typeNames,
            nextLang: () => null,
          }),
    };
  },
});

export default LangExtension;
