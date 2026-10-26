import {
  getMemoCharacters,
  getMemoWords,
  memoRowCount,
  parseMemoLimit,
  toMemoDisplayHtml,
} from "../../utils/memoField";
import {
  MuikkuEditor,
  STUDENT_PLAIN,
  STUDENT_RICH,
} from "~/src/components/tiptap-templates/muikku-editor";

/**
 * Memo field adapter around the memo Tiptap template.
 */
export function MemoRichEditor(props: {
  value: string;
  readOnly?: boolean;
  rows?: string;
  richedit?: boolean;
  maxChars?: string;
  maxWords?: string;
  onChange: (next: string) => void;
}) {
  const { value, readOnly, rows, richedit, maxChars, maxWords, onChange } =
    props;

  return (
    <MuikkuEditor
      className="muikku-editor"
      editable={!readOnly}
      content={toMemoDisplayHtml(value)}
      features={{
        ...(richedit ? STUDENT_RICH : STUDENT_PLAIN),
        characterCount: {
          characterLimit: parseMemoLimit(maxChars) ?? null,
          wordLimit: parseMemoLimit(maxWords) ?? null,
          textCounter: (text) => getMemoCharacters(text).length,
          wordCounter: (text) => getMemoWords(text).length,
        },
      }}
      minRows={memoRowCount(rows)}
      onChange={onChange}
    />
  );
}
