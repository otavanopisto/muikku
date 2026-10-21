import { useState } from "react";
import { MuikkuMemoEditor } from "@/components/tiptap-templates/muikku-memo-editor";
import type {
  FieldComponentProps,
  JournalFieldContent,
} from "../../coreMaterial/types";
import { Synchronizer } from "../../coreMaterial/fields/Synchronizer";
import { MemoReadonly } from "../../coreMaterial/fields/MemoField/MemoReadonly";
import { useFieldSyncHandle } from "../../coreMaterial/hooks/useFieldSyncHandle";
import { toMemoDisplayHtml } from "../../coreMaterial/utils/memoField";
import classes from "../../coreMaterial/fields/JournalField/JournalField.module.css";

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
        <MuikkuMemoEditor
          content={toMemoDisplayHtml(value)}
          minRows={8}
          richedit
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
