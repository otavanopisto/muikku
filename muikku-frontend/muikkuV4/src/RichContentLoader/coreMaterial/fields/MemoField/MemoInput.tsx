import { MemoRichEditor } from "./MemoRichEditor";

/**
 * Student memo control: plain textarea, Tiptap, or readonly HTML.
 */
export function MemoInput(props: {
  value: string;
  richedit?: boolean;
  rows?: string;
  maxChars?: string;
  maxWords?: string;
  readOnly?: boolean;
  onChange: (next: string) => void;
}) {
  const { value, richedit, rows, maxChars, maxWords, readOnly, onChange } =
    props;

  return (
    <MemoRichEditor
      readOnly={readOnly}
      value={value}
      rows={rows}
      richedit={richedit}
      maxChars={maxChars}
      maxWords={maxWords}
      onChange={onChange}
    />
  );
}
