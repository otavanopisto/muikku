import { sourceModePluginKey } from "@/components/tiptap-extension-custom/source-mode";
import {
  Toolbar,
  ToolbarGroup,
} from "@/components/tiptap-ui-primitive/toolbar";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";

/**
 * Toolbar shell. Marks source mode so CSS can freeze non-document groups.
 * @param props - Generated groups
 */
export function MuikkuEditorToolbar(props: { children: React.ReactNode }) {
  const { selected: isSourceMode } = useTiptapEditorV2({
    selector: ({ editor }) =>
      !!sourceModePluginKey.getState(editor.state)?.enabled,
  });

  return (
    <Toolbar
      variant="fixed"
      data-source-mode={isSourceMode ? "true" : undefined}
    >
      {props.children}
    </Toolbar>
  );
}

export { ToolbarGroup };
