import { MuikkuMemoEditor } from "@/components/tiptap-templates/muikku-memo-editor";
import {
  getMemoCharacters,
  getMemoWords,
  memoRowCount,
  parseMemoLimit,
  toMemoDisplayHtml,
} from "../../utils/memoField";

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
    <MuikkuMemoEditor
      content={toMemoDisplayHtml(value)}
      minRows={memoRowCount(rows)}
      richedit={richedit}
      characterCount={{
        characterLimit: parseMemoLimit(maxChars) ?? null,
        wordLimit: parseMemoLimit(maxWords) ?? null,
        textCounter: (text) => getMemoCharacters(text).length,
        wordCounter: (text) => getMemoWords(text).length,
      }}
      onChange={onChange}
    />
  );
}
