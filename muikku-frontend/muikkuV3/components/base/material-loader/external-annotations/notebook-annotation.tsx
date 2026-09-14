import * as React from "react";
import { NotebookAnnotationKind } from "~/components/base/material-loader/types";
import NotebookContextHighlight from "./notebook-context-highlight";
import NotebookContextNote from "./notebook-context-note";
import NotebookContextNoteDraft from "./notebook-context-note-draft";

/**
 * MaterialHighlightProps
 */
export interface NotebookAnnotationProps {
  notebookAnnotationId: number;
  kind: NotebookAnnotationKind;
  children: React.ReactNode;
}

/**
 * Router for notebook annotation spans.
 * @param props props
 */
const NotebookAnnotation = (props: NotebookAnnotationProps) => {
  const { notebookAnnotationId, kind, children } = props;

  if (!Number.isFinite(notebookAnnotationId)) {
    return <span className="material-annotation">{children}</span>;
  }

  switch (kind) {
    case "note":
      return (
        <NotebookContextNote notebookAnnotationId={notebookAnnotationId}>
          {children}
        </NotebookContextNote>
      );
    case "note-draft":
      return (
        <NotebookContextNoteDraft notebookAnnotationId={notebookAnnotationId}>
          {children}
        </NotebookContextNoteDraft>
      );
    case "highlight":
    default:
      return (
        <NotebookContextHighlight notebookAnnotationId={notebookAnnotationId}>
          {children}
        </NotebookContextHighlight>
      );
  }
};

export default NotebookAnnotation;
