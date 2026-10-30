"use client";

import { Button } from "@mantine/core";
import { MATERIAL_AUTHOR, MuikkuEditor } from "./muikku-editor";
import { useState } from "react";

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
  const [editable, setEditable] = useState(false);
  return (
    <>
      <Button onClick={() => setEditable(!editable)}>Toggle editable</Button>
      <MuikkuEditor
        className="muikku-editor--material-editor"
        content=""
        features={MATERIAL_AUTHOR}
        minRows={16}
        editable={editable}
        onChange={onChange}
      />
    </>
  );
}

export default MuikkuMaterialEditor;
