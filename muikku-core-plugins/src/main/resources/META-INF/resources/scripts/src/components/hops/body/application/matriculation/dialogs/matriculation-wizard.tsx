import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { MatriculationFormType } from "~/@types/shared";
import MatriculationExaminationWizard from "~/components/general/matriculationExaminationWizard";
import { Action, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import {
  UpdateMatriculationExaminationTriggerType,
  updateMatriculationExamination,
} from "../../../../../../actions/main-function/hops/index";
import { StateType } from "~/reducers";
import { MatriculationExam } from "~/generated/client";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface MatriculationExaminationWizardDialogProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  exam: MatriculationExam;
  compulsoryEducationEligible: boolean;
  formType: MatriculationFormType;
  updateMatriculationExamination: UpdateMatriculationExaminationTriggerType;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface MatriculationExaminationWizardDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class MatriculationExaminationWizardDialog extends React.Component<
  MatriculationExaminationWizardDialogProps,
  MatriculationExaminationWizardDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <>
        <MatriculationExaminationWizard
          exam={this.props.exam}
          compulsoryEducationEligible={this.props.compulsoryEducationEligible}
          onClose={closeDialog}
          onUpdateExam={(examId) => {
            this.props.updateMatriculationExamination({
              examId,
            });
          }}
          formType={this.props.formType}
        />
      </>
    );
    return (
      <Dialog
        disableScroll={true}
        title="Ilmoittaudu ylioppilaskokeisiin"
        content={content}
        modifier={["wizard", "matriculation"]}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateMatriculationExamination }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizardDialog);
