import classes from "./JournalField.module.css";

/**
 * Student-facing journal title row (instructions can go here later).
 */
export function JournalHeader(props: { title?: string }) {
  return (
    <span className={classes.header}>
      <span className={classes.title}>
        {props.title ?? "Päiväkirjamerkintä"}
      </span>
    </span>
  );
}
