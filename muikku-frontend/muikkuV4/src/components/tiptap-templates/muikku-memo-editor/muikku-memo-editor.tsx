import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-templates/muikku-memo-editor/muikku-memo-editor.scss";
import { MuikkuMemoEditorCore } from "./muikku-memo-editor-core";
import type { MemoEditorCharacterCount } from "./muikku-memo-editor-core";
import { MuikkuMemoEditorToolbar } from "./muikku-memo-editor-toolbar";

/**
 * MuikkuMemoEditorProps
 */
export interface MuikkuMemoEditorProps {
  content: string;
  minRows?: number;
  richedit?: boolean;
  characterCount?: MemoEditorCharacterCount;
  onChange?: (html: string) => void;
}

/**
 * Student memo Tiptap template. Always an editor; richedit only changes tools.
 * @param props - Initial HTML, toolbar preset, optional character cap
 */
export function MuikkuMemoEditor(props: MuikkuMemoEditorProps) {
  const {
    content,
    minRows = 3,
    richedit = false,
    characterCount,
    onChange,
  } = props;

  return (
    <div
      className="muikku-memo-editor"
      style={{ ["--memo-rows" as string]: minRows }}
    >
      <MuikkuMemoEditorCore
        content={content}
        richedit={richedit}
        characterCount={characterCount}
        toolbar={<MuikkuMemoEditorToolbar richedit={richedit} />}
        onChange={onChange}
      />
    </div>
  );
}

export default MuikkuMemoEditor;
