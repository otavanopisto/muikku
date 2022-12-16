import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import AssignmentsAndDiaries from "../body/application/assignments-and-diaries/assignments-and-diaries";
import { WorkspaceType } from "~/reducers/workspaces";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface WorkspaceAssignmentsAndDiaryDialogProps {
  workspace: WorkspaceType;
  workspaceId: number;
  i18nOLD: i18nType;
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
      <AssignmentsAndDiaries
        workspaceId={this.props.workspaceId}
        workspace={this.props.workspace}
      />
    );

    let title = this.props.workspace.name;

    if (this.props.workspace.nameExtension) {
      title = `${this.props.workspace.name} (${this.props.workspace.nameExtension})`;
    }

    return (
      <Dialog
        disableScroll={true}
        title={title}
        content={content}
        modifier={["studies"]}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceAssignmentsAndDiaryDialog);
