"use client";

import { MATERIAL_AUTHOR, MuikkuEditor } from "../muikku-editor";

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
    <MuikkuEditor
      className="muikku-editor--material-editor"
      content=""
      features={MATERIAL_AUTHOR}
      minRows={16}
      onChange={onChange}
    />
  );
}

export default MuikkuMaterialEditor;
