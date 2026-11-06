import { Extension } from "@tiptap/core";
import { CharacterCount, type CharacterCountOptions } from "@tiptap/extensions";
import { Plugin, PluginKey } from "@tiptap/pm/state";

/**
 * CharAndWordLimitOptions
 */
export interface CharAndWordLimitOptions {
  /** Maximum words. `null` = no word cap. */
  limit: number | null | undefined;
  /**
   * Nested CharacterCount config.
   * `false` skips character counting/limiting.
   */
  characterCount: Partial<CharacterCountOptions> | false;
}

/**
 * Character limits via Tiptap CharacterCount, plus a strict word cap.
 */
export const CharAndWordLimitExtension =
  Extension.create<CharAndWordLimitOptions>({
    name: "charAndWordLimit",

    addOptions() {
      return {
        limit: null,
        characterCount: {},
      };
    },

    addExtensions() {
      if (this.options.characterCount === false) {
        return [];
      }

      return [
        CharacterCount.configure({
          autoTrim: false,
          ...this.options.characterCount,
        }),
      ];
    },

    addProseMirrorPlugins() {
      const wordLimit = this.options.limit;

      return [
        new Plugin({
          key: new PluginKey("charAndWordLimit"),
          filterTransaction: (transaction, state) => {
            if (
              !transaction.docChanged ||
              wordLimit === null ||
              wordLimit === undefined ||
              wordLimit === 0
            ) {
              return true;
            }

            const words = this.editor.storage.characterCount?.words;
            if (!words) {
              return true;
            }

            const oldSize = words({ node: state.doc });
            const newSize = words({ node: transaction.doc });

            if (newSize <= wordLimit) {
              return true;
            }

            // Already over: allow edits that do not add more words.
            if (oldSize > wordLimit && newSize <= oldSize) {
              return true;
            }

            return false;
          },
        }),
      ];
    },
  });
