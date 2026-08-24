import * as React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { styles, htmlStyles } from "./notebook-pdf-styles";
import { NotebookNote } from "~/generated/client";
import { isNotebookContextNote } from "~/helper-functions/notebook";
import {
  NotebookMaterialPageGroup,
  WorkspaceNotebookNote,
} from "./helpers/notebook-layout";
import { isNotebookDraftId } from "./helpers/notebook-drafts";
import {
  getNotebookNoteBodyHtml,
  getNotebookNoteListTitle,
} from "./helpers/notebook-display";

/**
 * NoteBookPDF props
 */
interface NoteBookPFDProps {
  workspaceName?: string;
  workspaceNotes?: WorkspaceNotebookNote[];
  materialGroups: NotebookMaterialPageGroup[];
}

/**
 * NoteBookPDF component
 * @param props NoteBookPFDProps
 * @returns React.ReactNode
 */
const NoteBookPDF = (props: NoteBookPFDProps) => {
  const { workspaceNotes, materialGroups } = props;

  /**
   * Render note
   * @param note NotebookNote
   * @returns React.ReactNode
   */
  const renderNote = (note: NotebookNote) => {
    const title = getNotebookNoteListTitle(note);
    const html = getNotebookNoteBodyHtml(note);

    if (!title && !html) {
      return null;
    }

    return (
      <View key={note.id} wrap={false} style={styles.noteContainer}>
        {title ? <Text style={styles.noteFieldLabel}>{title}</Text> : null}
        {html ? (
          <View style={styles.noteFieldValue}>
            <Html stylesheet={htmlStyles}>{html}</Html>
          </View>
        ) : null}
      </View>
    );
  };

  /**
   * Render material group
   * @param group NotebookMaterialPageGroup
   * @returns React.ReactNode
   */
  const renderMaterialGroup = (group: NotebookMaterialPageGroup) => {
    const materialNotes = group.materialNotes.filter(
      (note) => !isNotebookDraftId(note.id)
    );
    const contextNotes = group.contextItems.filter(
      (note) => isNotebookContextNote(note) && !isNotebookDraftId(note.id)
    );

    if (materialNotes.length === 0 && contextNotes.length === 0) {
      return null;
    }

    return (
      <View key={group.page.workspaceMaterialId} wrap={false}>
        <Text style={styles.pageTitle}>{group.page.title}</Text>
        {materialNotes.map(renderNote)}
        {contextNotes.map(renderNote)}
      </View>
    );
  };

  const hasWorkspaceNotes = !!workspaceNotes?.length;
  const materialGroupViews = materialGroups
    .map(renderMaterialGroup)
    .filter(Boolean);
  const hasAnyNotes = hasWorkspaceNotes || materialGroupViews.length > 0;

  const pageHeader = (
    <View style={styles.header} fixed>
      <View style={styles.headerInfoContainer}>
        <Text style={styles.headerTitle}>Muistiinpanot</Text>
        {props.workspaceName && (
          <Text style={styles.headerSubtitle}>{props.workspaceName}</Text>
        )}
        <Text
          style={styles.headerPageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} (${totalPages})`
          }
        />
      </View>
    </View>
  );

  return (
    <Document>
      <Page style={styles.body} size="A4" wrap>
        {pageHeader}

        {!hasAnyNotes ? (
          <View>
            <Text style={styles.empty}>Ei muistiinpanoja</Text>
          </View>
        ) : (
          <>
            {hasWorkspaceNotes && workspaceNotes.map(renderNote)}
            {materialGroupViews}
          </>
        )}
      </Page>
    </Document>
  );
};

export default NoteBookPDF;
