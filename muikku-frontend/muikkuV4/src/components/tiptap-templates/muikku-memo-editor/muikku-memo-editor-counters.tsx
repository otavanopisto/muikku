import type { Editor } from "@tiptap/react";
import { useTiptapEditorV2 } from "@/hooks/use-tiptap-editor-v2";

/**
 * Live word/character counts from CharacterCount storage.
 */
export function MuikkuMemoEditorCounters(props: {
  editor: Editor | null;
  characterLimit?: number | null;
  wordLimit?: number | null;
}) {
  const { editor, characterLimit, wordLimit } = props;
  const { selected } = useTiptapEditorV2({
    editor,
    selector: ({ editor: instance }) => ({
      characters: instance.storage.characterCount?.characters() ?? 0,
      words: instance.storage.characterCount?.words() ?? 0,
    }),
  });

  const characters =
    selected?.characters ?? editor?.storage.characterCount?.characters() ?? 0;
  const words = selected?.words ?? editor?.storage.characterCount?.words() ?? 0;
  const maxChars =
    characterLimit && characterLimit > 0 ? characterLimit : undefined;
  const maxWords = wordLimit && wordLimit > 0 ? wordLimit : undefined;

  return (
    <span className="muikku-memo-editor__counters">
      <span
        className="muikku-memo-editor__counter"
        data-limit={maxWords && words >= maxWords ? true : undefined}
      >
        Sanoja {words}
        {maxWords ? ` / ${maxWords}` : ""}
      </span>
      <span
        className="muikku-memo-editor__counter"
        data-limit={maxChars && characters >= maxChars ? true : undefined}
      >
        Merkkejä {characters}
        {maxChars ? ` / ${maxChars}` : ""}
      </span>
    </span>
  );
}
