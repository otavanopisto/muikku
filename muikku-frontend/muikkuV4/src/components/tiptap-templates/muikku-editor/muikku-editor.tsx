/* eslint-disable react-x/no-context-provider */
import { useMemo, useRef } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-templates/muikku-editor/muikku-editor.scss";
import { createEditorParts } from "./create-editor-parts";
import { resolveFeatures } from "./features";
import { MuikkuEditorCounters } from "./muikku-editor-counters";
import type { MuikkuEditorCharacterCount, MuikkuEditorFeatures } from "./types";

/**
 * MuikkuEditorProps
 */
export interface MuikkuEditorProps {
  content: string;
  features?: MuikkuEditorFeatures;
  minRows?: number;
  className?: string;
  characterCount?: MuikkuEditorCharacterCount;
  onChange?: (html: string) => void;
}

/**
 * Feature-driven Tiptap instance. Remounts when `features` change.
 * @param props - Content, feature map, optional chrome
 */
export function MuikkuEditor(props: MuikkuEditorProps) {
  const {
    content,
    features,
    minRows = 3,
    className,
    characterCount,
    onChange,
  } = props;
  const resolved = resolveFeatures(features);
  const featureKey = JSON.stringify(resolved);

  return (
    <div
      className={["muikku-editor", className].filter(Boolean).join(" ")}
      style={{ ["--editor-rows" as string]: minRows }}
    >
      <MuikkuEditorInstance
        key={featureKey}
        content={content}
        resolved={resolved}
        characterCount={characterCount}
        onChange={onChange}
      />
    </div>
  );
}

/**
 * MuikkuEditorInstanceProps
 */
interface MuikkuEditorInstanceProps {
  content: string;
  resolved: ReturnType<typeof resolveFeatures>;
  characterCount?: MuikkuEditorCharacterCount;
  onChange?: (html: string) => void;
}

/**
 * Isolated useEditor so a feature-key change destroys the previous schema.
 * @param props - Resolved features and instance extras
 */
function MuikkuEditorInstance(props: MuikkuEditorInstanceProps) {
  const { content, resolved, characterCount, onChange } = props;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const parts = useMemo(
    () => createEditorParts(resolved, characterCount),
    [resolved, characterCount]
  );

  const editor = useEditor({
    content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class: "muikku-editor__content",
        spellcheck: "false",
      },
    },
    extensions: parts.extensions,
    onUpdate: ({ editor: instance }) => {
      const html = instance.getHTML();
      onChangeRef.current?.(instance.getText().trim() ? html : "");
    },
  });

  const ctxValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={ctxValue}>
      {parts.toolbar}
      {editor ? parts.renderBubbleMenus(editor) : null}
      <EditorContent editor={editor} />
      {characterCount ? (
        <MuikkuEditorCounters
          editor={editor}
          characterLimit={characterCount.characterLimit}
          wordLimit={characterCount.wordLimit}
        />
      ) : null}
    </EditorContext.Provider>
  );
}

export default MuikkuEditor;
