import * as React from "react";
import {
  getMemoFieldContentFormatSync,
  MemoFieldContentFormat,
} from "~/util/memo-content-format";
import { htmlToPlainText, toMemoDisplayHtml } from "~/util/html";
import CkeditorLoaderContent from "~/components/base/ckeditor-loader/content";

/**
 * Memo field snapshot content props
 */
interface MemoSnapshotContentProps {
  value: string;
  maxWords?: string;
  maxChars?: string;
  replaceNewlinesWithBreaks: (str: string) => string;
  getWords: (str: string) => string[];
  getCharacters: (str: string) => string[];
  wordCountLabel: string;
  characterCountLabel: string;
}

/**
 * Memo field snapshot content
 * @param props props
 */
export const MemoSnapshotContent = (props: MemoSnapshotContentProps) => {
  const {
    value,
    maxWords,
    maxChars,
    replaceNewlinesWithBreaks,
    getWords,
    getCharacters,
    wordCountLabel,
    characterCountLabel,
  } = props;

  const [format, setFormat] = React.useState<MemoFieldContentFormat | null>(
    null
  );

  // Determine the format of the value
  React.useEffect(() => {
    let cancelled = false;

    const format = getMemoFieldContentFormatSync(value);
    if (!cancelled) {
      setFormat(format);
    }

    return () => {
      cancelled = true;
    };
  }, [value]);

  // While validating: show plain (safe default)
  const resolvedFormat: MemoFieldContentFormat = format ?? "plain";

  // Convert the value to plain text if it's not HTML
  const rawText = resolvedFormat === "html" ? htmlToPlainText(value) : value;

  // Get the word and character counts
  const words = getWords(rawText).length;
  const characters = getCharacters(rawText).length;

  // Render the snapshot field
  const snapshotField = (
    <div className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly memofield__ckeditor-replacement--evaluation">
      <CkeditorLoaderContent
        html={toMemoDisplayHtml(
          value,
          resolvedFormat,
          replaceNewlinesWithBreaks
        )}
      />
    </div>
  );

  return (
    <span className="memofield-wrapper rs_skip_always">
      {snapshotField}
      <span className="memofield__counter-wrapper">
        <span className="memofield__word-count-container">
          <span className="memofield__word-count-title">{wordCountLabel}</span>
          <span className="memofield__word-count">
            {words} {maxWords && `/ ${maxWords}`}
          </span>
        </span>
        <span className="memofield__character-count-container">
          <span className="memofield__character-count-title">
            {characterCountLabel}
          </span>
          <span className="memofield__character-count">
            {characters} {maxChars && `/ ${maxChars}`}
          </span>
        </span>
      </span>
    </span>
  );
};
