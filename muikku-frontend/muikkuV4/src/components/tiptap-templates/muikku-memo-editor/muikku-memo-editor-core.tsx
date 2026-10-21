/* eslint-disable react-x/no-context-provider */
import { useMemo, useRef } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { TableBubbleMenu } from "@/components/tiptap-ui/table-bubble-menu";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { MuikkuLinkExtension } from "@/components/tiptap-extension-custom/muikku-link";
import { MathEquation } from "@/components/tiptap-extension-custom/math-equations";
import { IndentExtension } from "@/components/tiptap-extension-custom/indent";
import { PasteSanitizerExtension } from "@/components/tiptap-extension-custom/paste-sanitizer";
import { CharAndWordLimitExtension } from "@/components/tiptap-extension-custom/char-and-word-limit";
import { MuikkuMemoEditorCounters } from "./muikku-memo-editor-counters";

/**
 * Limits forwarded to CharAndWordLimitExtension.
 */
export interface MemoEditorCharacterCount {
  characterLimit?: number | null;
  wordLimit?: number | null;
  textCounter?: (text: string) => number;
  wordCounter?: (text: string) => number;
}

/**
 * MuikkuMemoEditorCoreProps
 */
export interface MuikkuMemoEditorCoreProps {
  content: string;
  toolbar: React.ReactNode;
  richedit?: boolean;
  characterCount?: MemoEditorCharacterCount;
  onChange?: (html: string) => void;
}

/**
 * Tiptap core for the student memo editor.
 * @param props - Template props
 */
export function MuikkuMemoEditorCore(props: MuikkuMemoEditorCoreProps) {
  const { content, toolbar, characterCount, onChange, richedit } = props;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: "muikku-memo-editor__content",
        spellcheck: "false",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: false,
        codeBlock: false,
      }),
      MuikkuLinkExtension.configure({
        openOnClick: false,
        enableClickSelection: true,
      }),
      TableKit.configure({
        table: { resizable: true },
      }),
      TextStyleKit,
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Image.configure({ inline: true, allowBase64: true }),
      IndentExtension.configure({ stepPx: 40 }),
      MathEquation.configure({
        legacyMathRules: [
          {
            tag: "span.math-tex",
            getAttrsLegacy: (el) => {
              const raw = (
                (el.textContent ?? "") ||
                (el.innerHTML ?? "")
              ).trim();
              return { latex: raw };
            },
          },
        ],
      }),
      PasteSanitizerExtension,
      CharAndWordLimitExtension.configure({
        limit: characterCount?.wordLimit ?? null,
        characterCount: {
          limit: characterCount?.characterLimit ?? null,
          mode: "textSize",
          ...(characterCount?.textCounter
            ? { textCounter: characterCount.textCounter }
            : {}),
          ...(characterCount?.wordCounter
            ? { wordCounter: characterCount.wordCounter }
            : {}),
        },
      }),
    ],
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      onChangeRef.current?.(instance.getText().trim() ? html : "");
    },
  });

  const ctxValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={ctxValue}>
      {toolbar}
      {editor && richedit ? <TableBubbleMenu editor={editor} /> : null}
      <EditorContent editor={editor} />
      {characterCount && (
        <MuikkuMemoEditorCounters
          editor={editor}
          characterLimit={characterCount?.characterLimit}
          wordLimit={characterCount?.wordLimit}
        />
      )}
    </EditorContext.Provider>
  );
}

export default MuikkuMemoEditorCore;
