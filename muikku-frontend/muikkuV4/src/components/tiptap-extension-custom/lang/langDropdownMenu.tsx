"use client";

import { useCallback, useMemo, useState } from "react";
import { useEditorState, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/tiptap-ui-primitive/dropdown-menu";

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";

// If you already have a generic "language" icon, use it.
// Otherwise you can temporarily reuse something (or text label only).
// import { LanguageIcon } from "@/components/tiptap-icons/language-icon"

const LANGUAGE_LIST = [
  { code: "fi", label: "Suomi" },
  { code: "en", label: "Englanti" },
  { code: "sv", label: "Ruotsi" },
  { code: "de", label: "Saksa" },
  { code: "es", label: "Espanja" },
  { code: "ru", label: "Venäjä" },
  { code: "ja", label: "Japani" },
  { code: "fr", label: "Ranska" },
  { code: "it", label: "Italia" },
  { code: "la", label: "Latina" },
  { code: "el", label: "Kreikka" },
] as const;

/**
 * The props for the LangDropdownMenu component.
 * @extends Omit<ButtonProps, "type">
 */
export interface LangDropdownMenuProps extends Omit<ButtonProps, "type"> {
  editor?: Editor | null;
  hideWhenUnavailable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  modal?: boolean;
}

/**
 * Checks if the lang extension is available.
 * @param editor - The editor to check.
 * @returns True if the lang extension is available, false otherwise.
 */
function canUseLang(editor: Editor | null) {
  if (!editor?.isEditable) return false;
  // commands exist when extension is installed; this is a cheap runtime guard
  return typeof editor.commands.setBlockLang === "function";
}

/**
 * The LangDropdownMenu component.
 * @param props - The props for the LangDropdownMenu component.
 * @returns The LangDropdownMenu component.
 */
export function LangDropdownMenu({
  editor: providedEditor,
  hideWhenUnavailable = false,
  onOpenChange,
  modal = true,
  children,
  ...props
}: LangDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = useState(false);

  const canToggle = canUseLang(editor);

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      onOpenChange?.(open);
    },
    [onOpenChange]
  );

  const items = useMemo(() => LANGUAGE_LIST, []);

  /**
   * Applies the lang to the selection.
   * @param lang - The lang to apply.
   * @returns True if the lang was applied, false otherwise.
   */
  const applyLang = useCallback(
    (lang: string | null) => {
      if (!editor?.isEditable) return false;

      const { state } = editor;
      const { from, empty } = state.selection;

      setIsOpen(false);

      // Helper: apply/remove the textLang mark for the "current intent"
      const applyToSelection = () =>
        lang
          ? editor.chain().focus().setTextLang(lang).run()
          : editor.chain().focus().unsetTextLang().run();

      if (!empty) {
        // Non-empty selection: apply directly
        return applyToSelection();
      }

      // Caret only: apply to whole nearest block's inline content
      const $from = state.selection.$from;

      // Find nearest block ancestor
      let depth = $from.depth;
      while (depth > 0 && !$from.node(depth).isBlock) depth--;

      const blockStart = $from.start(depth);
      const blockEnd = $from.end(depth);

      // Inline content range inside the block
      const rangeFrom = blockStart + 1;
      const rangeTo = blockEnd - 1;

      // Empty block: no valid text range → set stored mark (so new typing gets the lang)
      if (rangeFrom > rangeTo) {
        return lang
          ? editor.chain().focus().setMark("textLang", { lang }).run()
          : editor.chain().focus().unsetMark("textLang").run();
      }

      // Select the block's content, apply mark, then restore the caret.
      // (Restoring is optional, but feels nicer.)
      const caretPos = from;

      const chain = editor
        .chain()
        .focus()
        .setTextSelection({ from: rangeFrom, to: rangeTo });

      const ok = lang
        ? chain.setTextLang(lang).run()
        : chain.unsetTextLang().run();

      if (ok) {
        editor.chain().focus().setTextSelection(caretPos).run();
      }

      return ok;
    },
    [editor, setIsOpen]
  );

  /**
   * Handles the set language click.
   * @param lang - The lang to apply.
   * @returns True if the lang was applied, false otherwise.
   */
  const handleSetLanguageClick = useCallback(
    (lang: string | null) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setIsOpen(false);
      applyLang(lang);
    },
    [applyLang]
  );

  const selectedLangCode =
    useEditorState({
      editor,
      selector: ({ editor }) => {
        if (!editor) return null;
        const { from, to } = editor.state.selection;
        const isEmptySelection = from === to;
        // 1) Inline override has priority, especially for caret inside <span lang="..">
        const inlineAttrs = editor.getAttributes("textLang");
        const inlineLang =
          typeof inlineAttrs.lang === "string" && inlineAttrs.lang
            ? inlineAttrs.lang
            : null;
        if (isEmptySelection && inlineLang) return inlineLang;
        // 2) Block lang (only if no inline override at caret)
        const blockTypes = [
          "paragraph",
          "heading",
          "blockquote",
          "listItem",
        ] as const;
        for (const type of blockTypes) {
          const attrs = editor.getAttributes(type);
          if (typeof attrs.lang === "string" && attrs.lang) return attrs.lang;
        }
        // 3) For non-empty selection, if you want inline to “win” when any is active:
        if (!isEmptySelection && inlineLang) return inlineLang;
        return null;
      },
    }) ?? null;

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          data-active-state={selectedLangCode ? "on" : "off"}
          aria-label="Language"
          tooltip="Language"
          {...props}
        >
          {children ?? (
            <>
              {/* <LanguageIcon className="tiptap-button-icon" /> */}
              <span className="tiptap-button-icon" aria-hidden>
                L
              </span>
              <ChevronDownIcon className="tiptap-button-dropdown-small" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {/* Block language first (your requested default for empty selection) */}
        <DropdownMenuGroup>
          {items.map((opt) => (
            <DropdownMenuItem key={`lang-${opt.code}`}>
              <Button
                type="button"
                variant="ghost"
                onClick={handleSetLanguageClick(opt.code)}
                data-active-state={opt.code === selectedLangCode ? "on" : "off"}
                aria-pressed={opt.code === selectedLangCode}
                className="w-full justify-start"
              >
                {opt.label}
              </Button>
            </DropdownMenuItem>
          ))}

          <DropdownMenuItem>
            <Button
              type="button"
              variant="ghost"
              onClick={handleSetLanguageClick(null)}
              className="w-full justify-start"
            >
              Clear
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LangDropdownMenu;
