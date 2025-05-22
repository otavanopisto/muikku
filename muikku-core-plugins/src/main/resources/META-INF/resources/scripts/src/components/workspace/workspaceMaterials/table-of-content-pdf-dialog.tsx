/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Dialog from "~/components/general/dialog";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { PDFViewer } from "@react-pdf/renderer";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import TableOfContentPDF from "./table-of-content-pdf";
import { StatusType } from "~/reducers/base/status";
import { MaterialCompositeReply } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * NoteBookPDFProps
 */
interface TableOfContentPDFDialogProps {
  children?: React.ReactElement<any>;
  assignmentTypeFilters: string[];
  materials: MaterialContentNodeWithIdAndLogic[];
  compositeReplies: MaterialCompositeReply[];
  workspace?: WorkspaceDataType;
  isOpen?: boolean;
  onClose?: () => void;
  status: StatusType;
}

/**
 * NoteBookPDFDialog
 * @param props props
 * @returns JSX.Element
 */
const TableOfContentPDFDialog = (props: TableOfContentPDFDialogProps) => {
  const {
    children,
    assignmentTypeFilters,
    materials,
    compositeReplies,
    workspace,
    status,
    isOpen,
    onClose,
  } = props;

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
      <TableOfContentPDF
        assignmentTypeFilters={assignmentTypeFilters}
        materials={materials}
        compositeReplies={compositeReplies}
        workspace={workspace}
        workspaceName={workspaceName}
        status={status}
      />
    </PDFViewer>
  );

  return (
    <Dialog
      modifier="notebook-pdf-dialog"
      isOpen={isOpen}
      onClose={onClose}
      title="Sisällysluettelo"
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableOfContentPDFDialog);
