import classes from "./MemoField.module.css";

/**
 * Author-provided example answer. Shown when displayCorrectAnswers is on.
 * Memo has no scored correct answers.
 */
export function MemoAnswerExample(props: {
  example?: string;
  visible?: boolean;
}) {
  if (!props.visible || !props.example) {
    return null;
  }
  return (
    <span className={classes.example}>
      Esimerkkivastaus:
      {props.example?.replace(/\n/g, "<br/>") || ""}
    </span>
  );
}
