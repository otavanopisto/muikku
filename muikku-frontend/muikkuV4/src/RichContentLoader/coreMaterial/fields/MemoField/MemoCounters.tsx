import { parseMemoLimit } from "../../utils/memoField";
import classes from "./MemoField.module.css";

/**
 * Word / character counters.
 */
export function MemoCounters(props: {
  words: number;
  characters: number;
  maxWords?: string;
  maxChars?: string;
}) {
  const maxWords = parseMemoLimit(props.maxWords);
  const maxChars = parseMemoLimit(props.maxChars);
  return (
    <span className={classes.counters}>
      <span
        className={classes.counter}
        data-limit={maxWords && props.words >= maxWords ? true : undefined}
      >
        Sanoja {props.words}
        {maxWords ? ` / ${maxWords}` : ""}
      </span>
      <span
        className={classes.counter}
        data-limit={maxChars && props.characters >= maxChars ? true : undefined}
      >
        Merkkejä {props.characters}
        {maxChars ? ` / ${maxChars}` : ""}
      </span>
    </span>
  );
}
