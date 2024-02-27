import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import AssignmentsAndDiaries from "../body/application/assignments-and-diaries/assignments-and-diaries";
import { WorkspaceActivity } from "~/generated/client";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface WorkspaceAssignmentsAndDiaryDialogProps {
  workspaceId: number;
  credit: WorkspaceActivity;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface WorkspaceAssignmentsAndDiaryDialogState {
  scale: number;
  angle: number;
}

/**
 * MatriculationExaminationWizardDialog
 */
class WorkspaceAssignmentsAndDiaryDialog extends React.Component<
  WorkspaceAssignmentsAndDiaryDialogProps,
  WorkspaceAssignmentsAndDiaryDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (closeDialog: () => any) => (
      <AssignmentsAndDiaries credit={this.props.credit} />
    );

    return (
      <Dialog
        disableScroll={true}
        title={this.props.credit.name}
        content={content}
        modifier={["studies"]}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default WorkspaceAssignmentsAndDiaryDialog;
