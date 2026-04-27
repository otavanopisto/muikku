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
import { MathEquationButton } from "@/components/tiptap-extension-custom/math-equations";
import { DetailsButton } from "@/components/tiptap-extension-custom/details";
import { IndentButton } from "@/components/tiptap-extension-custom/indent";
import { LangDropdownMenu } from "@/components/tiptap-extension-custom/lang";
import { DivBoxSelect } from "@/components/tiptap-extension-custom/div-box";
import { IframeButton } from "@/components/tiptap-extension-custom/iframe";

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

/**
 * MainToolbarContent is the main toolbar content for the Muikku Material Editor.
 * @param props - The props for the MainToolbarContent component.
 * @returns MainToolbarContent
 */
function MainToolbarContent(props: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  editor: Editor | null;
}) {
  const { onHighlighterClick, onLinkClick, isMobile } = props;

  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <LangDropdownMenu />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        <TextColorPopover />
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <IndentButton action="increase" />
        <IndentButton action="decrease" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextDirectionLeftButton />
        <TextDirectionRightButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ImageUploadButton text="Add" />
        <IframeButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MathEquationButton />
        <TablePopover />
        <DetailsButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <DivBoxSelect />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MuikkuTextFieldButton />
        <MuikkuMemoFieldButton />
        <MuikkuConnectFieldButton />
        <MuikkuOrganizerFieldButton />
        <MuikkuSorterFieldButton />
        <MuikkuJournalFieldButton />
        <MuikkuAudioFieldButton />
        <MuikkuSelectFieldButton />
        <MuikkuFileFieldButton />
        <MuikkuMathFieldButton />
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

  const rect = useCursorVisibility({
    editor,
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
          editor={editor}
        />
      ) : (
        <MobileToolbarContent
          type={mobileView === "highlighter" ? "highlighter" : "link"}
          onBack={() => setMobileView("main")}
        />
      )}
    </Toolbar>
  );
}

export default MuikkuMaterialEditorToolbar;
