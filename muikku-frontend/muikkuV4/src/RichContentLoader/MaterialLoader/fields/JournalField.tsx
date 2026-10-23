import { useState } from "react";
import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../coreMaterial/types";
import { Synchronizer } from "../../coreMaterial/fields/Synchronizer";
import { MemoReadonly } from "../../coreMaterial/fields/MemoField/MemoReadonly";
import { useFieldSyncHandle } from "../../coreMaterial/hooks/useFieldSyncHandle";
import classes from "../../coreMaterial/fields/JournalField/JournalField.module.css";
import {
  MuikkuEditor,
  STUDENT_RICH,
} from "~/src/components/tiptap-templates/muikku-editor";

/**
 * JournalFieldProps
 */
interface JournalFieldProps extends FieldComponentProps<JournalFieldContent> {}

/**
 * Student materials journal field. Always Tiptap (V3 was always CKEditor).
 * @param props - Live field props from FieldWithLiveProps
 */
export function MaterialJournalField(props: JournalFieldProps) {
  const { content, readOnly, initialValue, invisible, onChange } = props;
  const [value, setValue] = useState(initialValue ?? "");
  const handle = useFieldSyncHandle();

  if (!content) {
    return null;
  }

  /**
   * Persist HTML on each editor update; field manager debounces the save.
   * @param next - Next HTML value
   */
  function handleChange(next: string) {
    if (!content) {
      return;
    }
    setValue(next);
    onChange?.(handle, content.name, next);
  }

  if (invisible) {
    return (
      <span className={classes.wrapper} aria-hidden>
        <span className={classes.header} />
        <MemoReadonly value={value} />
      </span>
    );
  }

  return (
    <span className={classes.wrapper}>
      <span className={classes.header}>
        <span className={classes.title}>Päiväkirjamerkintä</span>
      </span>
      {readOnly ? (
        <MemoReadonly value={value} />
      ) : (
        <MuikkuEditor
          content={value}
          features={STUDENT_RICH}
          minRows={8}
          onChange={handleChange}
        />
      )}
      <Synchronizer
        modified={handle.state.modified}
        synced={handle.state.synced}
        syncError={handle.state.syncError}
      />
    </span>
  );
}
