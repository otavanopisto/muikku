import * as React from "react";
import MaterialHighlightShell from "./material-highlight-shell";

/**
 * MaterialContextNoteDraftProps
 */
export interface MaterialContextNoteDraftProps {
  highlightId: number;
  children: React.ReactNode;
}

/**
 * Unsaved context note draft preview (kind=note-draft).
 * @param props props
 */
const MaterialContextNoteDraft = (props: MaterialContextNoteDraftProps) => {
  const { highlightId, children } = props;

  return (
    <MaterialHighlightShell highlightId={highlightId} kind="note-draft">
      {children}
    </MaterialHighlightShell>
  );
};

export default MaterialContextNoteDraft;
