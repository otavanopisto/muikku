import { Stack, TextInput } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type { MaterialContentNode } from "~/generated/client";
import {
  MATERIAL_AUTHOR,
  MuikkuEditor,
} from "src/components/tiptap-templates/muikku-editor";

/**
 * Sisältö: title + HTML editor.
 */
export function PageContentTab(props: {
  page: MaterialContentNode;
  savedHtml: string;
  onTitleChange: (title: string) => void;
  onHtmlChange: (html: string) => void;
  onEditorReady: (editor: Editor | null) => void;
}) {
  const { page, savedHtml, onTitleChange, onHtmlChange, onEditorReady } = props;

  return (
    <Stack gap="md">
      <TextInput
        label="Otsikko"
        value={page.title ?? ""}
        onChange={(event) => onTitleChange(event.currentTarget.value)}
      />
      <MuikkuEditor
        key={page.workspaceMaterialId}
        className="muikku-editor--material-editor"
        content={savedHtml}
        features={MATERIAL_AUTHOR}
        minRows={16}
        editable
        onChange={onHtmlChange}
        onEditorReady={onEditorReady}
      />
    </Stack>
  );
}
