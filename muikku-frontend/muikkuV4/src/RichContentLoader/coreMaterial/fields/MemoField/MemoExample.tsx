import { MemoReadonly } from "./MemoReadonly";
import classes from "./MemoField.module.css";

/**
 * Example answer under the field when answers are visible.
 */
export function MemoExample(props: { example?: string; visible?: boolean }) {
  if (!props.visible || !props.example) {
    return null;
  }
  return (
    <span className={classes.example}>
      Esimerkkivastaus:
      <MemoReadonly value={props.example} />
    </span>
  );
}
