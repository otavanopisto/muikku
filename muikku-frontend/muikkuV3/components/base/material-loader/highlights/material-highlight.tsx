import * as React from "react";
import { MaterialHighlightKind } from "~/components/base/material-loader/types";
import MaterialContextHighlight from "./material-context-highlight";
import MaterialContextNote from "./material-context-note";
import MaterialContextNoteDraft from "./material-context-note-draft";

/**
 * MaterialHighlightProps
 */
export interface MaterialHighlightProps {
  highlightId: number;
  kind: MaterialHighlightKind;
  children: React.ReactNode;
}

/**
 * Router for material page highlight spans.
 * @param props props
 */
const MaterialHighlight = (props: MaterialHighlightProps) => {
  const { highlightId, kind, children } = props;

  if (!Number.isFinite(highlightId)) {
    return <span className="material-annotation">{children}</span>;
  }

  switch (kind) {
    case "note":
      return (
        <MaterialContextNote highlightId={highlightId}>
          {children}
        </MaterialContextNote>
      );
    case "note-draft":
      return (
        <MaterialContextNoteDraft highlightId={highlightId}>
          {children}
        </MaterialContextNoteDraft>
      );
    case "highlight":
    default:
      return (
        <MaterialContextHighlight highlightId={highlightId}>
          {children}
        </MaterialContextHighlight>
      );
  }
};

export default MaterialHighlight;
