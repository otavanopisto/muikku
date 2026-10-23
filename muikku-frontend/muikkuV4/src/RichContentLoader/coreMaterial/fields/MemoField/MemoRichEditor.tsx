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
  rows?: string;
  richedit?: boolean;
  maxChars?: string;
  maxWords?: string;
  onChange: (next: string) => void;
}) {
  const { value, rows, richedit, maxChars, maxWords, onChange } = props;

  return (
    <MuikkuEditor
      className="muikku-editor"
      content={toMemoDisplayHtml(value)}
      features={richedit ? STUDENT_RICH : STUDENT_PLAIN}
      minRows={memoRowCount(rows)}
      onChange={onChange}
      characterCount={{
        characterLimit: parseMemoLimit(maxChars) ?? null,
        wordLimit: parseMemoLimit(maxWords) ?? null,
        textCounter: (text) => getMemoCharacters(text).length,
        wordCounter: (text) => getMemoWords(text).length,
      }}
    />
  );
}
