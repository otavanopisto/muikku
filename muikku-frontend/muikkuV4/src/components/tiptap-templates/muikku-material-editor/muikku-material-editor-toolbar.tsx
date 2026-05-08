"use client";

import { useEffect, useRef, useState } from "react";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import { TextColorPopover } from "@/components/tiptap-ui/text-color-popover";
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import {
  TextDirectionLeftButton,
  TextDirectionRightButton,
} from "@/components/tiptap-ui/text-direction-buttons";
import TablePopover from "@/components/tiptap-ui/table-popover/table-popover";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Tiptap Extension Custom ---
import {
  SourceModeButton,
  sourceModePluginKey,
} from "@/components/tiptap-extension-custom/source-mode";
import { MathEquationButton } from "@/components/tiptap-extension-custom/math-equations";
import { DetailsButton } from "@/components/tiptap-extension-custom/details";
import { IndentButton } from "@/components/tiptap-extension-custom/indent";
import { LangDropdownMenu } from "@/components/tiptap-extension-custom/lang";
import { DivBoxSelect } from "@/components/tiptap-extension-custom/div-box";
import { IframeButton } from "@/components/tiptap-extension-custom/iframe";
import { ImageAddButton } from "@/components/tiptap-extension-custom/muikku-image/ImageAddButton";
import { SpecialCharButton } from "@/components/tiptap-extension-custom/special-char";

// --- Muikku fields ---
import {
  MuikkuTextFieldButton,
  MuikkuMemoFieldButton,
  MuikkuConnectFieldButton,
  MuikkuOrganizerFieldButton,
  MuikkuSorterFieldButton,
  MuikkuJournalFieldButton,
  MuikkuAudioFieldButton,
  MuikkuSelectFieldButton,
  MuikkuFileFieldButton,
  MuikkuMathFieldButton,
} from "@/components/tiptap-extension-custom/muikku-fields-kit";

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle";
import { useCursorVisibility } from "~/src/hooks/use-cursor-visibility";
import { Editor, useCurrentEditor } from "@tiptap/react";
import { useWindowSize } from "~/src/hooks/use-window-size";
import { useIsBreakpoint } from "~/src/hooks/use-is-breakpoint";
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

/**
 * MainToolbarContent is the main toolbar content for the Muikku Material Editor.
 * @param props - The props for the MainToolbarContent component.
 * @returns MainToolbarContent
 */
function MainToolbarContent(props: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  isSourceMode: boolean;
  editor: Editor | null;
}) {
  const { onHighlighterClick, onLinkClick, isMobile, isSourceMode } = props;

  return (
    <>
      <ToolbarGroup>
        <SourceModeButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <UndoRedoButton action="undo" disabled={isSourceMode} />
        <UndoRedoButton action="redo" disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu
          modal={false}
          levels={[1, 2, 3, 4]}
          disabled={isSourceMode}
        />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
          disabled={isSourceMode}
        />
        <BlockquoteButton disabled={isSourceMode} />
        <CodeBlockButton disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <LangDropdownMenu disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" disabled={isSourceMode} />
        <MarkButton type="italic" disabled={isSourceMode} />
        <MarkButton type="strike" disabled={isSourceMode} />
        <MarkButton type="code" disabled={isSourceMode} />
        <MarkButton type="underline" disabled={isSourceMode} />
        {!isMobile ? (
          <ColorHighlightPopover disabled={isSourceMode} />
        ) : (
          <ColorHighlightPopoverButton
            onClick={onHighlighterClick}
            disabled={isSourceMode}
          />
        )}
        <TextColorPopover disabled={isSourceMode} />
        {!isMobile ? (
          <LinkPopover disabled={isSourceMode} />
        ) : (
          <LinkButton onClick={onLinkClick} disabled={isSourceMode} />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" disabled={isSourceMode} />
        <MarkButton type="subscript" disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" disabled={isSourceMode} />
        <TextAlignButton align="center" disabled={isSourceMode} />
        <TextAlignButton align="right" disabled={isSourceMode} />
        <TextAlignButton align="justify" disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageAddButton disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <IndentButton action="increase" disabled={isSourceMode} />
        <IndentButton action="decrease" disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextDirectionLeftButton disabled={isSourceMode} />
        <TextDirectionRightButton disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" disabled={isSourceMode} />
        <IframeButton disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MathEquationButton disabled={isSourceMode} />
        <TablePopover disabled={isSourceMode} />
        <DetailsButton disabled={isSourceMode} />
        <SpecialCharButton disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <DivBoxSelect disabled={isSourceMode} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MuikkuTextFieldButton disabled={isSourceMode} />
        <MuikkuMemoFieldButton disabled={isSourceMode} />
        <MuikkuConnectFieldButton disabled={isSourceMode} />
        <MuikkuOrganizerFieldButton disabled={isSourceMode} />
        <MuikkuSorterFieldButton disabled={isSourceMode} />
        <MuikkuJournalFieldButton disabled={isSourceMode} />
        <MuikkuAudioFieldButton disabled={isSourceMode} />
        <MuikkuSelectFieldButton disabled={isSourceMode} />
        <MuikkuFileFieldButton disabled={isSourceMode} />
        <MuikkuMathFieldButton disabled={isSourceMode} />
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
}

/**
 * MobileToolbarContent is the mobile toolbar content for the Muikku Material Editor.
 * @param props - The props for the MobileToolbarContent component.
 * @returns MobileToolbarContent
 */
function MobileToolbarContent(props: {
  type: "highlighter" | "link";
  isSourceMode: boolean;
  onBack: () => void;
}) {
  const { type, onBack } = props;

  return (
    <>
      <ToolbarGroup>
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeftIcon className="tiptap-button-icon" />
          {type === "highlighter" ? (
            <HighlighterIcon className="tiptap-button-icon" />
          ) : (
            <LinkIcon className="tiptap-button-icon" />
          )}
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      {type === "highlighter" ? (
        <ColorHighlightPopoverContent />
      ) : (
        <LinkContent />
      )}
    </>
  );
}

/**
 * MuikkuMaterialEditorToolbar is the toolbar for the Muikku Material Editor.
 * @param props - The props for the MuikkuMaterialEditorToolbar component.
 * @returns MuikkuMaterialEditorToolbar
 */
export function MuikkuMaterialEditorToolbar() {
  const { editor } = useCurrentEditor();

  const isMobile = useIsBreakpoint();

  const toolbarRef = useRef<HTMLDivElement | null>(null);

  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  const { editor: effectiveEditor, selected: isSourceMode } = useTiptapEditorV2(
    {
      editor,
      selector: ({ editor }) =>
        !!sourceModePluginKey.getState(editor.state)?.enabled,
    }
  );

  const rect = useCursorVisibility({
    editor: effectiveEditor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  const { height } = useWindowSize();

  const toolbarStyle: React.CSSProperties | undefined = isMobile
    ? { bottom: `calc(100% - ${height - rect.y}px)` }
    : undefined;

  return (
    <Toolbar ref={toolbarRef} style={toolbarStyle}>
      {mobileView === "main" ? (
        <MainToolbarContent
          onHighlighterClick={() => setMobileView("highlighter")}
          onLinkClick={() => setMobileView("link")}
          isMobile={isMobile}
          isSourceMode={isSourceMode ?? false}
          editor={editor}
        />
      ) : (
        <MobileToolbarContent
          type={mobileView === "highlighter" ? "highlighter" : "link"}
          onBack={() => setMobileView("main")}
          isSourceMode={isSourceMode ?? false}
        />
      )}
    </Toolbar>
  );
}

export default MuikkuMaterialEditorToolbar;
