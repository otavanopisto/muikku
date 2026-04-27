/* eslint-disable react-x/no-context-provider */
/* eslint-disable no-console */
"use client";

import { useMemo } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { TextStyleKit } from "@tiptap/extension-text-style";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";

// --- Tiptap UI ---
import { TableBubbleMenu } from "@/components/tiptap-ui/table-bubble-menu";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Tiptap Extension Custom ---
import { MathEquation } from "@/components/tiptap-extension-custom/math-equations";
import { DetailsKit } from "@/components/tiptap-extension-custom/details";
import { IndentExtension } from "@/components/tiptap-extension-custom/indent";
import { LangExtension } from "@/components/tiptap-extension-custom/lang";
import {
  DivBoxBubbleMenu,
  DivBoxExtension,
} from "@/components/tiptap-extension-custom/div-box";
import { IframeExtension } from "@/components/tiptap-extension-custom/iframe";
import { MuikkuFieldsKit } from "@/components/tiptap-extension-custom/muikku-fields-kit";

/**
 * MuikkuMaterialEditorCore is the core component for the Muikku Material Editor.
 * @param props - The props for the MuikkuMaterialEditorCore component.
 * @returns MuikkuMaterialEditorCore
 */
export function MuikkuMaterialEditorCore(props: {
  toolbar: React.ReactNode;
  onChange?: (html: string) => void;
}) {
  const { toolbar } = props;

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      LangExtension.configure({
        blockTypes: ["paragraph", "heading", "blockquote", "listItem"],
      }),
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      DetailsKit.configure({
        classes: {
          details: "details",
          summary: "details__summary",
          content: "details__content",
        },
        openByDefault: false,
      }),
      TextStyleKit,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      MathEquation,
      DivBoxExtension,
      IframeExtension,
      IndentExtension.configure({ stepPx: 40 }),
      MuikkuFieldsKit.configure({
        fields: {
          text: true,
          memo: true,
          connect: true,
          organizer: true,
          sorter: true,
          journal: true,
          audio: true,
          select: true,
          file: true,
          mathexercise: true,
        },
      }),
    ],
    textDirection: "auto",
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => props.onChange?.(editor.getHTML()),
  });

  const ctxValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={ctxValue}>
      {toolbar}

      {editor && <TableBubbleMenu editor={editor} />}
      {editor && <DivBoxBubbleMenu editor={editor} />}

      <EditorContent
        editor={editor}
        role="presentation"
        className="simple-editor-content"
      />
    </EditorContext.Provider>
  );
}

export default MuikkuMaterialEditorCore;
