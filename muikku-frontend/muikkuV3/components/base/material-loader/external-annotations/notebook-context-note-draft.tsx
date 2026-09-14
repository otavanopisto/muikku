import * as React from "react";
import NotebookAnnotationShell from "./notebook-annotation-shell";

/**
 * NotebookContextNoteDraftProps
 */
export interface NotebookContextNoteDraftProps {
  notebookAnnotationId: number;
  children: React.ReactNode;
}

/**
 * Unsaved context note draft preview (kind=note-draft).
 * @param props props
 */
const NotebookContextNoteDraft = (props: NotebookContextNoteDraftProps) => {
  const { notebookAnnotationId, children } = props;

  return (
    <NotebookAnnotationShell
      notebookAnnotationId={notebookAnnotationId}
      kind="note-draft"
    >
      {children}
    </NotebookAnnotationShell>
  );
};

export default NotebookContextNoteDraft;
