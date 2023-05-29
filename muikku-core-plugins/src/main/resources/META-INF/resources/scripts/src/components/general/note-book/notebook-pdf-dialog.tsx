/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { WorkspaceNote } from "~/reducers/notebook/notebook";
import Dialog from "~/components/general/dialog";
import { i18nType } from "~/reducers/base/i18n";
import { bindActionCreators } from "redux";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import NoteBookPDF from "./notebook-pdf";
import { PDFViewer } from "@react-pdf/renderer";
import { WorkspaceType } from "~/reducers/workspaces";

/**
 * NoteBookPDFProps
 */
interface NoteBookPDFDialogProps {
  children?: React.ReactElement<any>;
  notes: WorkspaceNote[];
  workspace?: WorkspaceType;
  isOpen?: boolean;
  onClose?: () => void;
  i18n: i18nType;
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
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteBookPDFDialog);
