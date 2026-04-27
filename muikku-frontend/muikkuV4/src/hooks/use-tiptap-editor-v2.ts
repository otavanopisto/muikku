import type { Editor } from "@tiptap/react";
import { useCurrentEditor, useEditorState } from "@tiptap/react";
import { useEffect, useState } from "react";

/**
 * Get the active page editor from the editor.storage.pages.activeEditor
 * @param editor - The editor.
 * @returns The active page editor or null.
 */
function getActivePageEditor(editor: Editor): Editor | null {
  const storage = editor.storage as unknown as Record<string, unknown>;
  const pages = storage.pages as { activeEditor?: Editor | null } | undefined;
  if (!pages || !("activeEditor" in pages)) return null;
  return pages.activeEditor ?? null;
}

export type UseTiptapEditorV2Options<TSelected> = {
  /**
   * If provided, use this editor instead of context editor.
   */
  editor?: Editor | null;

  /**
   * If true, attempts to resolve the active page editor from editor.storage.pages.activeEditor
   * (same behavior as your current hook). Defaults to false for performance.
   */
  resolveActivePageEditor?: boolean;

  /**
   * Optional subscription selector. If provided, the hook subscribes to editor state changes
   * and returns `selected`. If omitted, the hook does not subscribe to transactions.
   */
  selector?: (ctx: { editor: Editor }) => TSelected;
};

export type UseTiptapEditorV2Result<TSelected> = {
  editor: Editor | null;
  selected?: TSelected;
};

/**
 * useTiptapEditorV2 is a hook that provides the current editor and the selected state.
 * @param options - The options for the hook.
 * @returns The editor and the selected state.
 */
export function useTiptapEditorV2<TSelected = never>(
  options?: UseTiptapEditorV2Options<TSelected>
): UseTiptapEditorV2Result<TSelected> {
  const { editor: contextEditor } = useCurrentEditor();
  const mainEditor = options?.editor ?? contextEditor;

  const resolveActivePageEditor = options?.resolveActivePageEditor ?? false;

  const [storageEditor, setStorageEditor] = useState<Editor | null>(null);

  // Only set up the "pages.activeEditor" tracking if requested.
  useEffect(() => {
    if (!resolveActivePageEditor) {
      setStorageEditor(null);
      return;
    }

    if (!mainEditor) {
      setStorageEditor(null);
      return;
    }

    const updateHandler = () =>
      setStorageEditor(getActivePageEditor(mainEditor));

    updateHandler();

    mainEditor.on("update", updateHandler);
    mainEditor.on("selectionUpdate", updateHandler);

    return () => {
      mainEditor.off("update", updateHandler);
      mainEditor.off("selectionUpdate", updateHandler);
    };
  }, [mainEditor, resolveActivePageEditor]);

  useEffect(() => {
    if (!storageEditor) return;

    const handleDestroy = () => setStorageEditor(null);

    storageEditor.on("destroy", handleDestroy);
    return () => {
      storageEditor.off("destroy", handleDestroy);
    };
  }, [storageEditor]);

  const effectiveEditor = resolveActivePageEditor
    ? storageEditor ?? mainEditor
    : mainEditor;

  // No subscription mode: return stable shape, no useEditorState

  // Always call useEditorState (hook order stable).
  // If no selector is provided, select `undefined` so callers can ignore it.
  const selectedState = useEditorState({
    editor: effectiveEditor ?? null,
    selector: (ctx) => {
      if (!ctx.editor) return undefined as unknown as TSelected | undefined;
      if (!options?.selector) {
        return undefined;
      }
      return options.selector({ editor: ctx.editor });
    },
  });
  return {
    editor: effectiveEditor ?? null,
    selected: options?.selector ? (selectedState as TSelected) : undefined,
  };
}
