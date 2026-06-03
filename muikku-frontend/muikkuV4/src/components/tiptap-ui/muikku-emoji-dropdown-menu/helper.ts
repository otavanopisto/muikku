import { computePosition } from "@floating-ui/react";
import type { EmojiItem } from "@tiptap/extension-emoji";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

import {
  EmojiSuggestionList,
  type EmojiSuggestionListRef,
} from "./muikku-emoji-dropdown-menu";

type EmojiSuggestionItem = EmojiItem;

/**
 * getClientRect is a function that returns the clientRect of the props.
 * @param props - The props for the getClientRect function.
 * @returns The clientRect of the props.
 */
function getClientRect(
  props: SuggestionProps<EmojiSuggestionItem, EmojiSuggestionItem>
) {
  return props.clientRect?.() ?? new DOMRect(0, 0, 0, 0);
}

/**
 * createEmojiSuggestion creates a suggestion config for `Emoji.configure({ suggestion })`.
 */
export function createEmojiSuggestion(
  emojis: EmojiItem[]
): Omit<SuggestionOptions<EmojiSuggestionItem, EmojiSuggestionItem>, "editor"> {
  return {
    char: ":",

    allowSpaces: false,

    items: ({ query }) => {
      const q = query.toLowerCase();

      return emojis
        .filter(({ shortcodes, tags, name }) => {
          if (name?.toLowerCase().startsWith(q)) return true;
          if (shortcodes?.some((s) => s.toLowerCase().startsWith(q)))
            return true;
          if (tags?.some((t) => t.toLowerCase().startsWith(q))) return true;
          return false;
        })
        .slice(0, 8);
    },

    command: ({ editor, range, props }) => {
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          { type: "emoji", attrs: { name: props.name } },
          { type: "text", text: " " },
        ])
        .run();
    },

    render: () => {
      let renderer: ReactRenderer<
        EmojiSuggestionListRef,
        SuggestionProps<EmojiSuggestionItem, EmojiSuggestionItem>
      > | null = null;

      const reposition = (
        props: SuggestionProps<EmojiSuggestionItem, EmojiSuggestionItem>
      ) => {
        if (!renderer?.element) return;

        const rect = getClientRect(props);

        const virtualEl = {
          getBoundingClientRect() {
            return rect;
          },
        };

        void computePosition(virtualEl, renderer.element, {
          placement: "bottom-start",
        }).then((pos) => {
          Object.assign(renderer!.element.style, {
            position: pos.strategy === "fixed" ? "fixed" : "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
          });
        });
      };

      return {
        onStart: (props) => {
          renderer = new ReactRenderer(EmojiSuggestionList, {
            props,
            editor: props.editor,
          });

          document.body.appendChild(renderer.element);
          reposition(props);
        },

        onUpdate: (props) => {
          renderer?.updateProps(props);
          reposition(props);
        },

        onKeyDown: (props) => {
          if (props.event.key === "Escape") {
            // let Suggestion handle closing; we’ll cleanup in onExit
            return true;
          }

          return renderer?.ref?.onKeyDown(props) ?? false;
        },

        onExit: () => {
          if (renderer?.element?.parentNode) {
            renderer.element.parentNode.removeChild(renderer.element);
          }
          renderer?.destroy();
          renderer = null;
        },
      };
    },
  };
}
