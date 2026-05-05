import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";

import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";
import { isExtensionAvailable } from "@/lib/tiptap-utils";
import type { MuikkuImageAlign } from "@/components/tiptap-extension-custom/muikku-image";

import { ImageAlignCenterIcon } from "@/components/tiptap-icons/image-align-center-icon";
import { ImageAlignLeftIcon } from "@/components/tiptap-icons/image-align-left-icon";
import { ImageAlignRightIcon } from "@/components/tiptap-icons/image-align-right-icon";
import { BanIcon } from "@/components/tiptap-icons/ban-icon";

/**
 * UseImageAlignConfig
 */
export interface UseImageAlignConfig {
  editor?: Editor | null;
  align: MuikkuImageAlign | "none";
  hideWhenUnavailable?: boolean;
  onAligned?: () => void;
}

const labels: Record<MuikkuImageAlign | "none", string> = {
  left: "Float image left",
  center: "Center image",
  right: "Float image right",
  none: "Clear image alignment",
};

const icons = {
  left: ImageAlignLeftIcon,
  center: ImageAlignCenterIcon,
  right: ImageAlignRightIcon,
  none: BanIcon,
};

/**
 * Get the active image-like node kind (image / imageFigure / null).
 * @param editor - The editor.
 * @returns The active node name or null.
 */
function getActiveImageNodeName(
  editor: Editor | null
): "image" | "imageFigure" | null {
  if (!editor) return null;
  if (editor.isActive("imageFigure")) return "imageFigure";
  if (editor.isActive("image")) return "image";
  return null;
}

/**
 * Can set image align
 * @param editor - The editor.
 * @returns True if alignment can be set.
 */
export function canSetImageAlign(editor: Editor | null): boolean {
  if (!editor?.isEditable) return false;
  const name = getActiveImageNodeName(editor);
  if (!name) return false;
  if (!isExtensionAvailable(editor, name)) return false;
  return editor.can().updateAttributes(name, { align: null });
}

/**
 * Is image align active
 * @param editor - The editor.
 * @param align - The align.
 * @returns True if the align is currently set on the active node.
 */
export function isImageAlignActive(
  editor: Editor | null,
  align: MuikkuImageAlign | "none"
): boolean {
  if (!editor?.isEditable) return false;
  const name = getActiveImageNodeName(editor);
  if (!name) return false;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const a = editor.getAttributes(name)?.align ?? null;
  if (align === "none") return a === null || a === undefined;
  return a === align;
}

/**
 * Set image align
 * @param editor - The editor.
 * @param align - The align.
 * @returns True if the align was set.
 */
export function setImageAlign(
  editor: Editor | null,
  align: MuikkuImageAlign | "none"
): boolean {
  if (!editor?.isEditable) return false;
  if (!canSetImageAlign(editor)) return false;
  const name = getActiveImageNodeName(editor);
  if (!name) return false;
  const next = align === "none" ? null : align;
  return editor.chain().focus().updateAttributes(name, { align: next }).run();
}

/**
 * Should show image align button
 * @param props - The props.
 * @returns True if visible.
 */
function shouldShowImageAlignButton(props: {
  editor: Editor | null;
  hideWhenUnavailable: boolean;
}): boolean {
  const { editor, hideWhenUnavailable } = props;
  if (!editor) return false;
  if (!hideWhenUnavailable) return true;
  if (!editor.isEditable) return false;
  return getActiveImageNodeName(editor) !== null;
}

/**
 * Use image align
 * @param config - The config.
 * @returns Image align state and action.
 */
export function useImageAlign(config: UseImageAlignConfig) {
  const {
    editor: providedEditor,
    align,
    hideWhenUnavailable = false,
    onAligned,
  } = config;

  const { editor, selected } = useTiptapEditorV2({
    editor: providedEditor,
    selector: ({ editor }) => ({
      canAlign: canSetImageAlign(editor),
      isActive: isImageAlignActive(editor, align),
    }),
  });

  const [isVisible, setIsVisible] = useState(true);
  const canAlign = selected?.canAlign ?? false;
  const isActive = selected?.isActive ?? false;

  useEffect(() => {
    if (!editor) return;
    const tick = () => {
      setIsVisible(shouldShowImageAlignButton({ editor, hideWhenUnavailable }));
    };
    tick();
    editor.on("selectionUpdate", tick);
    return () => {
      editor.off("selectionUpdate", tick);
    };
  }, [editor, hideWhenUnavailable]);

  const handleAlign = useCallback(() => {
    if (!editor) return false;
    const ok = setImageAlign(editor, align);
    if (ok) onAligned?.();
    return ok;
  }, [editor, align, onAligned]);

  return {
    isVisible,
    isActive,
    handleAlign,
    canAlign,
    label: labels[align],
    Icon: icons[align],
  };
}
