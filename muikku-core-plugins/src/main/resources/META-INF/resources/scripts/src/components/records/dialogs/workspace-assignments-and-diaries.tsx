import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";
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
  i18n: i18nType;
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
    const content = (closeDialog: () => any) => (
      <div>
        <AssignmentsAndDiaries
          workspaceId={this.props.workspaceId}
          workspace={this.props.workspace}
        />
      </div>
    );
    return (
      <Dialog
        disableScroll={true}
        title="Tehtävät ja päiväkirjamerkinnät"
        content={content}
        modifier={["wizard", "records"]}
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
    i18n: state.i18n,
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
