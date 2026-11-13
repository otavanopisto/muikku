import { TextInput } from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type { MaterialContentNode } from "~/generated/client";
import {
  MATERIAL_AUTHOR,
  MuikkuEditor,
} from "src/components/tiptap-templates/muikku-editor";
import classes from "src/RichContentLoader/coreMaterial/MaterialPage.module.css";

/**
 * Sisältö: page title as a heading, then the HTML editor.
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
    <>
      <div className={classes.titleBar}>
        <TextInput
          variant="unstyled"
          aria-label="Otsikko"
          placeholder="Otsikko"
          classNames={{ input: classes.titleInput }}
          value={page.title ?? ""}
          onChange={(event) => onTitleChange(event.currentTarget.value)}
        />
      </div>
      <div className={classes.panelEditor}>
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
      </div>
    </>
  );
}
