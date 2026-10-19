import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover";
import { TextColorPopover } from "@/components/tiptap-ui/text-color-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";
import TablePopover from "@/components/tiptap-ui/table-popover/table-popover";
import { MathEquationButton } from "@/components/tiptap-extension-custom/math-equations";
import { IndentButton } from "@/components/tiptap-extension-custom/indent";
import { SpecialCharButton } from "@/components/tiptap-extension-custom/special-char";
import { MuikkuLinkButton } from "@/components/tiptap-extension-custom/muikku-link";

/**
 * Toolbar for the student memo editor.
 * richedit false: no tools yet (fullscreen comes later).
 * @param props - Toolbar preset
 */
export function MuikkuMemoEditorToolbar(props: { richedit?: boolean }) {
  if (!props.richedit) {
    return null;
  }

  return (
    <Toolbar variant="fixed">
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu modal={false} types={["bulletList", "orderedList"]} />
        <BlockquoteButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="underline" />
        <MarkButton type="strike" />
        <ColorHighlightPopover />
        <TextColorPopover />
        <MuikkuLinkButton />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <IndentButton action="increase" />
        <IndentButton action="decrease" />
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <MathEquationButton />
        <TablePopover />
        <SpecialCharButton />
      </ToolbarGroup>
    </Toolbar>
  );
}

export default MuikkuMemoEditorToolbar;
