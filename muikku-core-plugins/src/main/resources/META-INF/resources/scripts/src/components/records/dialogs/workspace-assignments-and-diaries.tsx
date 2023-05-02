import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import AssignmentsAndDiaries from "../body/application/assignments-and-diaries/assignments-and-diaries";
import { RecordWorkspaceActivity } from "~/reducers/main-function/records";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface WorkspaceAssignmentsAndDiaryDialogProps {
  workspaceId: number;
  i18n: i18nType;
  credit: RecordWorkspaceActivity;
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
