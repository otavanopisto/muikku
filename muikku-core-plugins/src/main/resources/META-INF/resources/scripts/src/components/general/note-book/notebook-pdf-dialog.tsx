/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Dialog from "~/components/general/dialog";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import NoteBookPDF from "./notebook-pdf";
import { PDFViewer } from "@react-pdf/renderer";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { WorkspaceNote } from "~/generated/client";

/**
 * NoteBookPDFProps
 */
interface NoteBookPDFDialogProps {
  children?: React.ReactElement<any>;
  notes: WorkspaceNote[];
  workspace?: WorkspaceDataType;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * NoteBookPDFDialog
 * @param props props
 * @returns JSX.Element
 */
const NoteBookPDFDialog = (props: NoteBookPDFDialogProps) => {
  const { children, notes, workspace, isOpen, onClose } = props;

  let workspaceName: string = undefined;

  if (workspace) {
    workspaceName = workspace.name;

    if (workspace.nameExtension) {
      workspaceName += ` (${workspace.nameExtension})`;
    }
  }

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <PDFViewer className="notebook-pdf">
      <NoteBookPDF notes={notes} workspaceName={workspaceName} />
    </PDFViewer>
  );

  return (
    <Dialog
      modifier="notebook-pdf-dialog"
      isOpen={isOpen}
      onClose={onClose}
      title="Muistiinpanot"
      content={content}
      disableScroll
    >
      {children}
    </Dialog>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(null, mapDispatchToProps)(NoteBookPDFDialog);
