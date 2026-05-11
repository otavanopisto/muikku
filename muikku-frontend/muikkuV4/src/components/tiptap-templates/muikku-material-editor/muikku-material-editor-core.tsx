/* eslint-disable react-x/no-context-provider */
/* eslint-disable no-console */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditorV2 } from "~/src/hooks/use-tiptap-editor-v2";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
//import { Image } from "@tiptap/extension-image";
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
import { createEmojiSuggestion } from "@/components/tiptap-ui/muikku-emoji-dropdown-menu";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Tiptap Extension Custom ---
import { MuikkuLinkExtension } from "@/components/tiptap-extension-custom/muikku-link";
import { MuikkuAnchorExtension } from "@/components/tiptap-extension-custom/muikku-anchor";
import { Emoji, gitHubEmojis } from "@tiptap/extension-emoji";
import {
  SourceModeExtension,
  sourceModePluginKey,
} from "@/components/tiptap-extension-custom/source-mode";
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
import { PasteSanitizerExtension } from "@/components/tiptap-extension-custom/paste-sanitizer";
import {
  MuikkuImage,
  MuikkuImageFigure,
} from "@/components/tiptap-extension-custom/muikku-image";
import { ImageBubbleMenu } from "@/components/tiptap-extension-custom/muikku-image";
const testContent = String.raw`
<img dir="ltr" src="https://www.kennelliitto.fi/sites/default/files/styles/mobile_large_header_640x430/public/images/7.pystispentu.JPG?itok=UR5FZrmQ" alt="Test image" width="425" height="286" align="left" style="float: left;"><p dir="ltr">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><img dir="ltr" src="https://www.kennelliitto.fi/sites/default/files/images/berninpaimenkoira_1440_Aino%20Pikkusaari.jpg" width="377" height="242" align="right" style="float: right;"><p dir="ltr" style="text-align: left;">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>   
`;

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
    content: testContent,
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
        link: false,
      }),
      MuikkuLinkExtension.configure({
        openOnClick: false,
        enableClickSelection: true,
      }),
      MuikkuAnchorExtension,
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
      MuikkuImage,
      MuikkuImageFigure,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Emoji.configure({
        enableEmoticons: true,
        emojis: gitHubEmojis,
        suggestion: createEmojiSuggestion(gitHubEmojis),
      }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
      MathEquation.configure({
        legacyMathRules: [
          {
            // Legacy CKEditor 4: math equation stored as literal text with delimiters.
            // Example: <span class="math-tex">\(a + b = c\)</span>
            tag: "span.math-tex",
            getAttrsLegacy: (el) => {
              const raw = (
                (el.textContent ?? "") ||
                (el.innerHTML ?? "")
              ).trim();

              return {
                latex: raw,
              };
            },
          },
        ],
      }),
      DivBoxExtension.configure({
        dataStylePolicy: "knownPresetsOnly",
      }),
      IframeExtension.configure({
        allowedProtocols: ["https:"],
        srcAllowlist: ["*.youtube.com"],
      }),
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
      SourceModeExtension,
      PasteSanitizerExtension,
    ],
    textDirection: "ltr",
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => {
      console.log("onUpdate", editor.getHTML());
      //props.onChange?.(editor.getHTML());
    },
  });

  const { selected: isSourceMode } = useTiptapEditorV2({
    editor,
    selector: ({ editor }) =>
      !!sourceModePluginKey.getState(editor.state)?.enabled,
  });

  const [htmlDraft, setHtmlDraft] = useState("");

  const prev = useRef<boolean>(false);

  useEffect(() => {
    if (!editor || isSourceMode === undefined) return;
    // entering source mode
    if (!prev.current && isSourceMode) {
      setHtmlDraft(editor.getHTML());
    }
    // leaving source mode => apply
    if (prev.current && !isSourceMode) {
      editor.commands.setContent(htmlDraft);
    }
    prev.current = isSourceMode;
  }, [editor, isSourceMode, htmlDraft]);

  const ctxValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={ctxValue}>
      {toolbar}

      {editor && <TableBubbleMenu editor={editor} />}
      {editor && <DivBoxBubbleMenu editor={editor} />}
      {editor && <ImageBubbleMenu editor={editor} />}

      {!isSourceMode ? (
        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      ) : (
        <textarea
          value={htmlDraft}
          onChange={(e) => setHtmlDraft(e.target.value)}
          spellCheck={false}
          className="source-mode-textarea"
        />
      )}
    </EditorContext.Provider>
  );
}

export default MuikkuMaterialEditorCore;
