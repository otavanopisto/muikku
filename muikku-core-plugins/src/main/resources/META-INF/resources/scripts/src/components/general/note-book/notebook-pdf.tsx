import * as React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { WorkspaceNote } from "~/reducers/notebook/notebook";
import { styles, htmlStyles } from "./notebook-pdf-styles";

/**
 * NoteBookPDFProps
 */
interface NoteBookPFDProps {
  workspaceName?: string;
  notes?: WorkspaceNote[];
}

/**
 * NoteBookPDF
 * @param props props
 * @returns JSX.Element
 */
const NoteBookPDF = (props: NoteBookPFDProps) => {
  const { notes } = props;

  /**
   * renderNote
   * @param note note
   * @returns JSX.Element
   */
  const renderNote = (note: WorkspaceNote) => (
    <View key={note.id} wrap={false} style={styles.noteContainer}>
      <Text style={styles.noteFieldLabel}>{note.title}</Text>
      <View style={styles.noteFieldValue}>
        <Html stylesheet={htmlStyles}>{note.workspaceNote}</Html>
      </View>
    </View>
  );

  let pageTitle = "Muistiinpanot";

  if (props.workspaceName) {
    pageTitle += ` - ${props.workspaceName}`;
  }

  return (
    <Document>
      <Page style={styles.body} size="A4" wrap>
        <Text style={styles.pageTitle}>{pageTitle}</Text>

        {notes && notes.length > 0 ? (
          notes.map((n) => renderNote(n))
        ) : (
          <View>
            <Text style={styles.noteFieldLabel}>Ei muistiinpanoja</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default NoteBookPDF;
