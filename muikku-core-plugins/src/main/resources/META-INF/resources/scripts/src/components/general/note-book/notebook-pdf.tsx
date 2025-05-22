import * as React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { styles, htmlStyles } from "./notebook-pdf-styles";
import { WorkspaceNote } from "~/generated/client";

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
 * @returns React.JSX.Element
 */
const NoteBookPDF = (props: NoteBookPFDProps) => {
  const { notes } = props;

  /**
   * renderNote
   * @param note note
   * @returns React.JSX.Element
   */
  const renderNote = (note: WorkspaceNote) => (
    <View key={note.id} wrap={false} style={styles.noteContainer}>
      <Text style={styles.noteFieldLabel}>{note.title}</Text>
      <View style={styles.noteFieldValue}>
        <Html stylesheet={htmlStyles}>{note.workspaceNote}</Html>
      </View>
    </View>
  );

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

        {notes && notes.length > 0 ? (
          notes.map((n) => renderNote(n))
        ) : (
          <View>
            <Text style={styles.empty}>Ei muistiinpanoja</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default NoteBookPDF;
