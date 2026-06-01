import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { ImageCaptionIcon } from "@/components/tiptap-icons/image-caption-icon";

/**
 * UseImageCaptionConfig
 */
export interface UseImageCaptionConfig {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onToggled?: () => void;
}

/**
 * Get the active image-like node kind (if any).
 * @param editor - The editor.
 * @returns The active node kind.
 */
function getActiveImageKind(
  editor: Editor | null
): "image" | "imageFigure" | null {
  if (!editor) return null;
  if (editor.isActive("imageFigure")) return "imageFigure";
  if (editor.isActive("image")) return "image";
  return null;
}

/**
 * Can toggle image caption
 * @param editor - The editor.
 * @returns True if a caption can be added/removed.
 */
export function canToggleImageCaption(editor: Editor | null): boolean {
  if (!editor?.isEditable) return false;
  return getActiveImageKind(editor) !== null;
}

/**
 * Is image caption active (the selected image already has a caption).
 * @param editor - The editor.
 * @returns True when an `imageFigure` is the active node.
 */
export function isImageCaptionActive(editor: Editor | null): boolean {
  return getActiveImageKind(editor) === "imageFigure";
}

/**
 * Toggle the image caption (image <-> imageFigure).
 * @param editor - The editor.
 * @returns True if the toggle ran.
 */
export function toggleImageCaption(editor: Editor | null): boolean {
  if (!editor?.isEditable) return false;
  const kind = getActiveImageKind(editor);
  if (!kind) return false;

  const chain = editor.chain().focus() as ReturnType<Editor["chain"]> & {
    toggleImageCaption?: () => ReturnType<Editor["chain"]>;
    addImageCaption?: () => ReturnType<Editor["chain"]>;
    removeImageCaption?: () => ReturnType<Editor["chain"]>;
  };

  if (typeof chain.toggleImageCaption === "function") {
    return chain.toggleImageCaption().run();
  }
  if (kind === "image" && typeof chain.addImageCaption === "function") {
    return chain.addImageCaption().run();
  }
  if (
    kind === "imageFigure" &&
    typeof chain.removeImageCaption === "function"
  ) {
    return chain.removeImageCaption().run();
  }
  return false;
}

/**
 * Should show the caption toggle button.
 * @param props - The props.
 * @returns True if visible.
 */
function shouldShowButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;
  if (!editor) return false;
  if (!hideWhenUnavailable) return true;
  if (!editor.isEditable) return false;
  return canToggleImageCaption(editor);
}

/**
 * Use image caption.
 * @param config - The config.
 * @returns Image caption state and action.
 */
export function useImageCaption(config: UseImageCaptionConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config;

  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      canToggle: canToggleImageCaption(editor),
      isActive: isImageCaptionActive(editor),
    }),
  });

  const [isVisible, setIsVisible] = useState(true);
  const canToggle = selected?.canToggle ?? false;
  const isActive = selected?.isActive ?? false;

  useEffect(() => {
    if (!editor) return;
    const tick = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }));
    };
    tick();
    editor.on("selectionUpdate", tick);
    return () => {
      editor.off("selectionUpdate", tick);
    };
  }, [editor, hideWhenUnavailable]);

  /**
   * The handleToggle function.
   * @returns True if the toggle ran.
   */
  const handleToggle = useCallback(() => {
    if (!editor) return false;
    const ok = toggleImageCaption(editor);
    if (ok) onToggled?.();
    return ok;
  }, [editor, onToggled]);

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: isActive ? "Remove image caption" : "Add image caption",
    Icon: ImageCaptionIcon,
  };
}
