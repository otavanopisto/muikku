"use client";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/muikku-material-editor/muikku-material-editor.scss";

import MuikkuMaterialEditorCore from "./muikku-material-editor-core";
import MuikkuMaterialEditorToolbar from "./muikku-material-editor-toolbar";

/**
 * MuikkuMaterialEditorProps is the props for the MuikkuMaterialEditor component.
 */
interface MuikkuMaterialEditorProps {
  onChange?: (html: string) => void;
}

/**
 * MuikkuMaterialEditor is the component for the Muikku Material Editor.
 * @param onChange - The function to call when the content changes.
 * @returns MuikkuMaterialEditor
 */
export function MuikkuMaterialEditor({ onChange }: MuikkuMaterialEditorProps) {
  return (
    <div className="muikkuTiptap simple-editor-wrapper">
      <MuikkuMaterialEditorCore
        toolbar={<MuikkuMaterialEditorToolbar />}
        onChange={onChange}
      />
    </div>
  );
}

export default MuikkuMaterialEditor;
