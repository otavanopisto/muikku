import { Extension, type Dispatch } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "@tiptap/pm/state";

type SourceModeState = { enabled: boolean };

export const sourceModePluginKey = new PluginKey<SourceModeState>("sourceMode");

declare module "@tiptap/core" {
  /**
   * Commands interface for the source mode extension.
   */
  interface Commands<ReturnType> {
    sourceMode: {
      enableSourceMode: () => ReturnType;
      disableSourceMode: () => ReturnType;
      toggleSourceMode: () => ReturnType;
    };
  }
}

/**
 * The SourceModeExtension is the extension for the source mode.
 * @returns The SourceModeExtension.
 */
export const SourceModeExtension = Extension.create({
  name: "sourceMode",

  addProseMirrorPlugins() {
    return [
      new Plugin<SourceModeState>({
        key: sourceModePluginKey,
        state: {
          init: () => ({ enabled: false }),
          apply: (tr, prev) => {
            const meta = tr.getMeta(sourceModePluginKey) as
              | { enabled?: boolean }
              | undefined;
            if (meta && typeof meta.enabled === "boolean") {
              return { enabled: meta.enabled };
            }
            return prev;
          },
        },
        props: {
          // Optional hardening: when source mode is enabled, block editor input.
          // This is useful even if you hide EditorContent, because it prevents
          // accidental commands/shortcuts from mutating the doc.
          handleDOMEvents: {
            beforeinput: (view, _event) => {
              const st = sourceModePluginKey.getState(view.state);
              return !!st?.enabled;
            },
          },
        },
      }),
    ];
  },

  addCommands() {
    const setEnabled =
      (enabled: boolean) =>
      ({ tr, dispatch }: { tr: Transaction; dispatch: Dispatch }) => {
        tr = tr.setMeta(sourceModePluginKey, { enabled });
        if (dispatch) dispatch(tr);
        return true;
      };

    return {
      enableSourceMode: () => setEnabled(true),
      disableSourceMode: () => setEnabled(false),
      toggleSourceMode:
        () =>
        ({ state, tr, dispatch }) => {
          const prev = sourceModePluginKey.getState(state)?.enabled ?? false;
          tr = tr.setMeta(sourceModePluginKey, { enabled: !prev });
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});
